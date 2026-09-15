import React, { useState, useEffect, useCallback } from 'react';
import { AppMode, AppSettings, Faculty, ToastMessage } from './types';
import { getAllFaculty, saveFaculty, deleteFaculty } from './utils/db';
import { cyberAudio } from './utils/audio';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DeveloperLogin } from './components/DeveloperLogin';
import { DeveloperDashboard } from './components/DeveloperDashboard';
import { FacultyFormModal } from './components/FacultyFormModal';
import { DeleteModal } from './components/DeleteModal';
import { InvitationPortal } from './components/InvitationPortal';
import { ToastContainer } from './components/ToastContainer';

export function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('landing');
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deletingFaculty, setDeletingFaculty] = useState<Faculty | null>(null);

  // Settings
  const [settings, setSettings] = useState<AppSettings>({
    muteAudio: false,
    reduceMotion: false,
    accessCode: 'BITC2026',
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Data from IndexedDB
  const refreshFacultyData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const data = await getAllFaculty();
      setFacultyList(data);
    } catch (err) {
      console.error('Failed to load IndexedDB faculty data:', err);
      showToast('IndexedDB Error', 'Could not fetch faculty records', 'error');
    } finally {
      setIsLoadingData(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshFacultyData();
  }, [refreshFacultyData]);

  // Sound Audio Toggle
  const handleToggleAudio = () => {
    setSettings((prev) => {
      const next = !prev.muteAudio;
      cyberAudio.muted = next;
      showToast(next ? 'Sound Muted' : 'Sound Unmuted', undefined, 'info');
      return { ...prev, muteAudio: next };
    });
  };

  // Reduce Motion Toggle
  const handleToggleMotion = () => {
    setSettings((prev) => {
      const next = !prev.reduceMotion;
      showToast(next ? 'Reduce Motion Enabled' : 'Full Animations Enabled', undefined, 'info');
      return { ...prev, reduceMotion: next };
    });
  };

  // Mode Selection
  const handleSelectMode = (mode: AppMode) => {
    cyberAudio.playClick();
    setCurrentMode(mode);
  };

  // Save Faculty (Add / Edit)
  const handleSaveFaculty = async (faculty: Faculty) => {
    try {
      await saveFaculty(faculty);
      await refreshFacultyData();
      showToast(
        editingFaculty ? '✓ Faculty Updated' : '✓ Faculty Added',
        `${faculty.name} saved to IndexedDB database`,
        'success'
      );
    } catch (err: any) {
      showToast('Save Error', err.message, 'error');
    }
  };

  // Delete Faculty Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingFaculty) return;
    try {
      await deleteFaculty(deletingFaculty.id);
      await refreshFacultyData();
      showToast('✓ Faculty Deleted', `${deletingFaculty.name} permanently removed`, 'success');
    } catch (err: any) {
      showToast('Delete Error', err.message, 'error');
    } finally {
      setDeletingFaculty(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#040711] text-gray-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navigation Header */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        settings={settings}
        onToggleAudio={handleToggleAudio}
        onToggleMotion={handleToggleMotion}
      />

      {/* Main Views */}
      <main>
        {currentMode === 'landing' && (
          <LandingPage onSelectMode={handleSelectMode} />
        )}

        {currentMode === 'developer_login' && (
          <DeveloperLogin
            onSuccess={() => setCurrentMode('developer_dashboard')}
            onBack={() => setCurrentMode('landing')}
          />
        )}

        {currentMode === 'developer_dashboard' && (
          <DeveloperDashboard
            facultyList={facultyList}
            onAddFaculty={() => {
              setEditingFaculty(null);
              setIsFormModalOpen(true);
            }}
            onEditFaculty={(faculty) => {
              setEditingFaculty(faculty);
              setIsFormModalOpen(true);
            }}
            onDeleteFaculty={(faculty) => setDeletingFaculty(faculty)}
            onPreviewFaculty={(faculty) => {
              setCurrentMode('invitation_mode');
            }}
            onRefreshData={refreshFacultyData}
            onShowToast={showToast}
          />
        )}

        {currentMode === 'invitation_mode' && (
          <InvitationPortal
            facultyList={facultyList}
            onBack={() => setCurrentMode('landing')}
            onRefreshData={refreshFacultyData}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <FacultyFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveFaculty}
        editingFaculty={editingFaculty}
      />

      <DeleteModal
        isOpen={!!deletingFaculty}
        faculty={deletingFaculty}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingFaculty(null)}
      />

      {/* Cyber Toast System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
