import { openDB, type DBSchema } from 'idb';
import type { Track } from '../context/PlayerContext';

interface MoleBeatDB extends DBSchema {
    tracks: {
        key: number;
        value: Track & { file: Blob, imageBlob?: Blob };
    };
}

const DB_NAME = 'molebeat-db';
const STORE_NAME = 'tracks';

export const initDB = async () => {
    return openDB<MoleBeatDB>(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
};

export const saveTrack = async (track: Track, file: Blob, imageBlob?: Blob) => {
    const db = await initDB();
    await db.put(STORE_NAME, { ...track, file, imageBlob });
};

export const getAllTracks = async (): Promise<Track[]> => {
    const db = await initDB();
    const storedTracks = await db.getAll(STORE_NAME);

    // Convert stored blobs back to URLs
    return storedTracks.map(item => ({
        ...item,
        audioUrl: URL.createObjectURL(item.file),
        image: item.imageBlob ? URL.createObjectURL(item.imageBlob) : item.image
    }));
};

export const deleteTrack = async (id: number) => {
    const db = await initDB();
    await db.delete(STORE_NAME, id);
};

export const updateTrack = async (updatedTrack: Track) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const existing = await store.get(updatedTrack.id);
    if (existing) {
        // Preserve file and imageBlob from existing record
        await store.put({ ...existing, ...updatedTrack, file: existing.file, imageBlob: existing.imageBlob });
    }
    await tx.done;
};

export const clearAllTracks = async () => {
    const db = await initDB();
    await db.clear(STORE_NAME);
};

export const getDatabaseUsage = async (): Promise<number> => {
    if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        return estimate.usage || 0;
    }
    return 0;
};
