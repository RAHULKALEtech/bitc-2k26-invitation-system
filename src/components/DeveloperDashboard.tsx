import React, { useState, useMemo } from 'react';
import { Faculty, InvitationStatus } from '../types';
import { FacultyCard } from './FacultyCard';
import { generatePDFReport } from '../utils/pdf';
import { exportAllDataAsJSON, importDataFromJSON } from '../utils/db';
import { 
  Users, CheckCircle2, Clock, Percent, Plus, FileText, Download, 
  Upload, Search, Filter, SortAsc, Sparkles, AlertCircle 
} from 'lucide-react';

interface DeveloperDashboardProps {
  facultyList: Faculty[];
  onAddFaculty: () => void;
  onEditFaculty: (faculty: Faculty) => void;
  onDeleteFaculty: (faculty: Faculty) => void;
  onPreviewFaculty: (faculty: Faculty) => void;
  onRefreshData: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  facultyList,
  onAddFaculty,
  onEditFaculty,
  onDeleteFaculty,
  onPreviewFaculty,
  onRefreshData,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SENT' | 'REMAINING'>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'sent_first' | 'remaining_first'>('recent');

  // Stats
  const totalFaculty = facultyList.length;
  const sentCount = facultyList.filter((f) => f.invitationStatus === 'sent').length;
  const remainingCount = facultyList.filter((f) => f.invitationStatus !== 'sent').length;
  const completionPercentage = totalFaculty > 0 ? Math.round((sentCount / totalFaculty) * 100) : 0;

  // Filter & Search & Sort
  const processedFaculty = useMemo(() => {
    return facultyList
      .filter((faculty) => {
        const matchesSearch =
          faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faculty.whatsappNumber.includes(searchQuery);

        const matchesFilter =
          filterStatus === 'ALL'
            ? true
            : filterStatus === 'SENT'
            ? faculty.invitationStatus === 'sent'
            : faculty.invitationStatus !== 'sent';

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'sent_first') return (b.invitationStatus === 'sent' ? 1 : 0) - (a.invitationStatus === 'sent' ? 1 : 0);
        if (sortBy === 'remaining_first') return (a.invitationStatus === 'sent' ? 1 : 0) - (b.invitationStatus === 'sent' ? 1 : 0);
        return 0;
      });
  }, [facultyList, searchQuery, filterStatus, sortBy]);

  // Export JSON
  const handleExport = async () => {
    try {
      const json = await exportAllDataAsJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BIT-C_2K26_Faculty_Data_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onShowToast('✓ Export Successful', 'Faculty records exported as JSON file', 'success');
    } catch (err: any) {
      onShowToast('⚠ Export Failed', err.message, 'error');
    }
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const count = await importDataFromJSON(content);
          onRefreshData();
          onShowToast('✓ Import Successful', `Restored ${count} faculty records`, 'success');
        } catch (err: any) {
          onShowToast('⚠ Import Failed', 'Invalid JSON file format', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-cyber-dark p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Title & Stats Summary */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-cyan-400">
              B!T-C 2K26 — INVITATION CONTROL CENTER
            </h1>
            <p className="font-mono text-xs text-gray-400 mt-1">
              Developer Command Center • Real-time Faculty RSVP & Dispatch Management
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={onAddFaculty}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition"
            >
              <Plus className="h-4 w-4" />
              <span>ADD FACULTY</span>
            </button>

            <button
              onClick={() => generatePDFReport(facultyList)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold transition"
            >
              <FileText className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">PDF REPORT</span>
            </button>

            <button
              onClick={handleExport}
              title="Export Data as JSON"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 font-mono text-xs transition"
            >
              <Download className="h-4 w-4" />
            </button>

            <label
              title="Import Data from JSON"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 font-mono text-xs cursor-pointer transition"
            >
              <Upload className="h-4 w-4" />
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Dynamic Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-cyan-500/30 bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center justify-between text-gray-400">
              <span className="font-mono text-xs">TOTAL FACULTY</span>
              <Users className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="font-display text-3xl font-bold text-white mt-2">{totalFaculty}</p>
          </div>

          <div className="p-5 rounded-xl border border-emerald-500/30 bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center justify-between text-gray-400">
              <span className="font-mono text-xs">INVITATIONS SENT</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="font-display text-3xl font-bold text-emerald-400 mt-2">{sentCount}</p>
          </div>

          <div className="p-5 rounded-xl border border-amber-500/30 bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center justify-between text-gray-400">
              <span className="font-mono text-xs">REMAINING</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <p className="font-display text-3xl font-bold text-amber-400 mt-2">{remainingCount}</p>
          </div>

          <div className="p-5 rounded-xl border border-pink-500/30 bg-slate-900/60 backdrop-blur-md">
            <div className="flex items-center justify-between text-gray-400">
              <span className="font-mono text-xs">COMPLETION</span>
              <Percent className="h-4 w-4 text-pink-400" />
            </div>
            <p className="font-display text-3xl font-bold text-pink-400 mt-2">{completionPercentage}%</p>
          </div>
        </div>

        {/* Futuristic Progress Bar */}
        <div className="p-5 rounded-xl border border-cyan-500/20 bg-slate-900/40 space-y-2">
          <div className="flex justify-between font-mono text-xs text-gray-300">
            <span>INVITATION PROGRESS DISPATCH</span>
            <span className="text-cyan-400 font-bold">{completionPercentage}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 p-0.5 border border-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 shadow-[0_0_15px_rgba(0,240,255,0.6)] transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Controls: Search, Filters, Sorting */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty name or WhatsApp number..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-1 border-slate-800 bg-slate-950 p-1 rounded-lg border font-mono text-xs">
          {(['ALL', 'SENT', 'REMAINING'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-md transition ${
                filterStatus === status
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2">
          <SortAsc className="h-4 w-4 text-cyan-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-white font-mono text-xs py-2 px-3 rounded-lg focus:outline-none focus:border-cyan-400"
          >
            <option value="recent">Recently Added</option>
            <option value="name">Name A-Z</option>
            <option value="sent_first">Sent First</option>
            <option value="remaining_first">Remaining First</option>
          </select>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {processedFaculty.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedFaculty.map((faculty) => (
            <FacultyCard
              key={faculty.id}
              faculty={faculty}
              onEdit={onEditFaculty}
              onDelete={onDeleteFaculty}
              onPreview={onPreviewFaculty}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 space-y-4">
          <AlertCircle className="h-10 w-10 text-cyan-400/60 mx-auto" />
          <div>
            <p className="font-display text-lg font-bold text-gray-300">
              NO FACULTY RECORDS FOUND
            </p>
            <p className="font-mono text-xs text-gray-500 mt-1">
              Try adjusting your search query or add a new faculty record.
            </p>
          </div>
          <button
            onClick={onAddFaculty}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            <Plus className="h-4 w-4" />
            <span>+ ADD FIRST FACULTY</span>
          </button>
        </div>
      )}
    </div>
  );
};
