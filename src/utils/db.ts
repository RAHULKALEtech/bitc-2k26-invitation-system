import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Faculty } from '../types';

interface BitCDatabase extends DBSchema {
  faculty: {
    key: string;
    value: Faculty;
    indexes: { 'by-status': string; 'by-name': string };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'BITC_2K26_INVITATION_DB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<BitCDatabase>> | null = null;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<BitCDatabase>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('faculty')) {
          const facultyStore = db.createObjectStore('faculty', { keyPath: 'id' });
          facultyStore.createIndex('by-status', 'invitationStatus');
          facultyStore.createIndex('by-name', 'name');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
};

// Initial Seed Data if DB is empty
const SEED_FACULTY: Faculty[] = [
  {
    id: 'fac-1',
    name: 'Dr. A. Sharma',
    designation: 'Head of Department & Professor',
    photo: '',
    whatsappNumber: '919876543210',
    invitationMessage: `Dear Dr. A. Sharma,\n\nWe are delighted to invite you to the B!T-C 2K26 Department Forum.\nWe would be greatly honoured by your presence as our esteemed guest.\n\nRegards,\nDepartment of Computer Science and Engineering`,
    invitationStatus: 'sent',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    sentAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'fac-2',
    name: 'Prof. R. V. Kulkarni',
    designation: 'Associate Professor',
    photo: '',
    whatsappNumber: '919812345678',
    invitationMessage: `Dear Prof. R. V. Kulkarni,\n\nIt is our privilege to extend a formal invitation to the B!T-C 2K26 Department Forum.\nYour insights and presence will inspire our students and faculty alike.\n\nRegards,\nDepartment of Computer Science and Engineering`,
    invitationStatus: 'remaining',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'fac-3',
    name: 'Dr. Meena Patil',
    designation: 'Assistant Professor',
    photo: '',
    whatsappNumber: '919988776655',
    invitationMessage: `Dear Dr. Meena Patil,\n\nWe cordially invite you to join us at the annual B!T-C 2K26 Department Forum.\nWe look forward to welcoming you to this grand academic celebration.\n\nRegards,\nDepartment of Computer Science and Engineering`,
    invitationStatus: 'remaining',
    createdAt: new Date().toISOString(),
  }
];

export async function getAllFaculty(): Promise<Faculty[]> {
  const db = await getDB();
  const all = await db.getAll('faculty');
  if (all.length === 0) {
    // Seed initial data
    const tx = db.transaction('faculty', 'readwrite');
    for (const item of SEED_FACULTY) {
      await tx.store.put(item);
    }
    await tx.done;
    return SEED_FACULTY;
  }
  return all;
}

export async function saveFaculty(faculty: Faculty): Promise<void> {
  const db = await getDB();
  await db.put('faculty', faculty);
}

export async function deleteFaculty(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('faculty', id);
}

export async function getFacultyById(id: string): Promise<Faculty | undefined> {
  const db = await getDB();
  return db.get('faculty', id);
}

export async function updateFacultyStatus(id: string, status: Faculty['invitationStatus']): Promise<Faculty | undefined> {
  const db = await getDB();
  const faculty = await db.get('faculty', id);
  if (faculty) {
    faculty.invitationStatus = status;
    if (status === 'sent') {
      faculty.sentAt = new Date().toISOString();
    }
    await db.put('faculty', faculty);
    return faculty;
  }
  return undefined;
}

export async function exportAllDataAsJSON(): Promise<string> {
  const facultyList = await getAllFaculty();
  return JSON.stringify(facultyList, null, 2);
}

export async function importDataFromJSON(jsonData: string): Promise<number> {
  const items = JSON.parse(jsonData) as Faculty[];
  if (!Array.isArray(items)) throw new Error('Invalid JSON format: expected an array of faculty records');
  const db = await getDB();
  const tx = db.transaction('faculty', 'readwrite');
  let count = 0;
  for (const item of items) {
    if (item.id && item.name && item.whatsappNumber) {
      await tx.store.put(item);
      count++;
    }
  }
  await tx.done;
  return count;
}
