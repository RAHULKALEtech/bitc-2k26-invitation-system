export type InvitationStatus = 'remaining' | 'share_prepared' | 'sent';

export interface Faculty {
  id: string;
  name: string;
  designation: string;
  photo: string; // Base64 encoded or default placeholder
  chatbotVideo?: string; // Optional custom MP4 video URL/Base64
  whatsappNumber: string;
  invitationMessage: string;
  invitationStatus: InvitationStatus;
  createdAt: string;
  sentAt?: string;
}

export interface AppSettings {
  muteAudio: boolean;
  reduceMotion: boolean;
  accessCode: string; // Default access code for Developer Mode or Locker
  customChatbotVideo?: string; // Global default MP4 chatbot video
}

export type AppMode = 'landing' | 'developer_login' | 'developer_dashboard' | 'invitation_mode';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}
