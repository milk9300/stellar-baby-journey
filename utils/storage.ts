import { Milestone, GrowthRecord } from '../types';

const DB_NAME = 'BabyBalloonJourneyDB';
const MILESTONE_STORE = 'milestones';
const GROWTH_STORE = 'growth_records';
const DB_VERSION = 2;

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(MILESTONE_STORE)) {
                db.createObjectStore(MILESTONE_STORE, { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(GROWTH_STORE)) {
                db.createObjectStore(GROWTH_STORE, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Milestone CRUD
/**
 * Saves or updates a milestone
 */
export const saveMilestone = async (milestone: Partial<Milestone> & { id?: number }): Promise<number> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(MILESTONE_STORE, 'readwrite');
        const store = transaction.objectStore(MILESTONE_STORE);
        const request = store.put(milestone);

        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(request.error);
    });
};

export const getAllMilestones = async (): Promise<Milestone[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(MILESTONE_STORE, 'readonly');
        const store = transaction.objectStore(MILESTONE_STORE);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const deleteMilestone = async (id: number): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(MILESTONE_STORE, 'readwrite');
        const store = transaction.objectStore(MILESTONE_STORE);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

/**
 * Retrieves a specific milestone by its numeric ID
 */
export const fetchMilestoneById = async (id: number): Promise<Milestone | undefined> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(MILESTONE_STORE, 'readonly');
        const store = transaction.objectStore(MILESTONE_STORE);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Growth Record CRUD
export const saveGrowthRecord = async (record: Partial<GrowthRecord> & { id?: number }): Promise<number> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(GROWTH_STORE, 'readwrite');
        const store = transaction.objectStore(GROWTH_STORE);
        const request = store.put(record);

        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(request.error);
    });
};

export const getAllGrowthRecords = async (): Promise<GrowthRecord[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(GROWTH_STORE, 'readonly');
        const store = transaction.objectStore(GROWTH_STORE);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const deleteGrowthRecord = async (id: number): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(GROWTH_STORE, 'readwrite');
        const store = transaction.objectStore(GROWTH_STORE);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};

export const compressImage = (file: File, maxWidth = 1200): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = Math.min(maxWidth / img.width, 1);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
        };
    });
};
