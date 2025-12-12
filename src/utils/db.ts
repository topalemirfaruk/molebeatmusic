import { openDB, type DBSchema } from 'idb';
import type { Track } from '../context/PlayerContext';

export interface Playlist {
    id: string;
    name: string;
    created: number;
    trackIds: number[];
}

interface MoleBeatDB extends DBSchema {
    tracks: {
        key: number;
        value: Track & { file: Blob, imageBlob?: Blob };
    };
    playlists: {
        key: string;
        value: Playlist;
    };
}

const DB_NAME = 'molebeat-db';
const STORE_NAME = 'tracks';
const PLAYLIST_STORE_NAME = 'playlists';

export const initDB = async () => {
    return openDB<MoleBeatDB>(DB_NAME, 2, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(PLAYLIST_STORE_NAME)) {
                db.createObjectStore(PLAYLIST_STORE_NAME, { keyPath: 'id' });
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

// Playlist Functions

export const createPlaylist = async (name: string): Promise<Playlist> => {
    const db = await initDB();
    const newPlaylist: Playlist = {
        id: crypto.randomUUID(),
        name,
        created: Date.now(),
        trackIds: []
    };
    await db.add(PLAYLIST_STORE_NAME, newPlaylist);
    return newPlaylist;
};

export const getAllPlaylists = async (): Promise<Playlist[]> => {
    const db = await initDB();
    return await db.getAll(PLAYLIST_STORE_NAME);
};

export const deletePlaylist = async (id: string) => {
    const db = await initDB();
    await db.delete(PLAYLIST_STORE_NAME, id);
};

export const updatePlaylist = async (playlist: Playlist) => {
    const db = await initDB();
    await db.put(PLAYLIST_STORE_NAME, playlist);
};

