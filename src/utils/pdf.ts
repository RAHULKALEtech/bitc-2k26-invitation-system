import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Faculty } from '../types';

export function generatePDFReport(facultyList: Faculty[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const total = facultyList.length;
  const sentList = facultyList.filter((f) => f.invitationStatus === 'sent');
  const remainingList = facultyList.filter((f) => f.invitationStatus !== 'sent');
  const sentCount = sentList.length;
  const remainingCount = remainingList.length;
  const completionPercentage = total > 0 ? Math.round((sentCount / total) * 100) : 0;
  const reportDate = new Date().toLocaleString();

  // Header Banner
  doc.setFillColor(13, 19, 34);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(0, 240, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('B!T-C 2K26', 14, 18);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('Department Forum Invitation Report', 14, 28);

  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Department of Computer Science & Engineering`, 14, 34);

  // Date and Time
  doc.setFontSize(9);
  doc.text(`Generated: ${reportDate}`, 145, 34);

  // Summary Statistics Cards
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 48, 182, 32, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, 48, 182, 32, 'S');

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('INVITATION SUMMARY', 18, 56);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Total Faculty: ${total}`, 18, 64);
  doc.text(`Invitations Sent: ${sentCount}`, 75, 64);
  doc.text(`Invitations Remaining: ${remainingCount}`, 130, 64);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(14, 165, 233);
  doc.text(`Completion Rate: ${completionPercentage}%`, 18, 73);

  // Table Data Preparation
  const tableRows = facultyList.map((faculty, idx) => [
    (idx + 1).toString(),
    faculty.name,
    faculty.designation || 'N/A',
    faculty.whatsappNumber,
    faculty.invitationStatus === 'sent' ? 'SENT' : faculty.invitationStatus === 'share_prepared' ? 'PREPARED' : 'REMAINING',
    faculty.sentAt ? new Date(faculty.sentAt).toLocaleString() : 'N/A',
  ]);

  autoTable(doc, {
    startY: 88,
    head: [['Sr. No.', 'Faculty Name', 'Designation', 'WhatsApp Number', 'Status', 'Sent Date/Time']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [13, 19, 34],
      textColor: [0, 240, 255],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // Footer Note
  const finalY = (doc as any).lastAutoTable?.finalY || 200;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 150, 255);
  doc.text('B!T-C 2K26 SYSTEM', 14, finalY + 12);

  doc.save(`BIT-C_2K26_Invitation_Report_${Date.now()}.pdf`);
}
