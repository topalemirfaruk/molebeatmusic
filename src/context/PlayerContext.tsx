import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { saveTrack, getAllTracks, deleteTrack, updateTrack, clearAllTracks } from '../utils/db';
import { extractMetadata } from '../utils/metadata';

export interface Track {
    id: number;
    title: string;
    artist: string;
    duration: string;
    image: string;
    audioUrl?: string;
}

interface PlayerContextType {
    tracks: Track[];
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    playbackRate: number;
    currentTime: number;
    duration: number;
    favorites: number[];
    playTrack: (track: Track) => void;
    togglePlay: () => void;
    toggleFavorite: (trackId: number) => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
    setPlaybackRate: (rate: number) => void;
    formatTime: (time: number) => string;
    addTrack: (file: File) => void;
    removeTrack: (id: number) => void;
    updateTrackTitle: (id: number, newTitle: string) => void;
    clearLibrary: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const initialTracks: Track[] = [
    { id: 1, title: 'Qui sait ?', artist: 'Niro, ElGrandeToto', duration: '2:02', image: 'https://source.unsplash.com/random/50x50?sig=1' },
    { id: 2, title: 'Adios', artist: 'Klass-A', duration: '4:17', image: 'https://source.unsplash.com/random/50x50?sig=2' },
    { id: 3, title: 'POWER - A COLORS SHOW', artist: 'Shobee', duration: '3:23', image: 'https://source.unsplash.com/random/50x50?sig=3' },
    { id: 4, title: 'EMO ERR', artist: 'Moro', duration: '2:02', image: 'https://source.unsplash.com/random/50x50?sig=4' },
    { id: 5, title: 'Helma', artist: 'Tagne', duration: '2:30', image: 'https://source.unsplash.com/random/50x50?sig=5' },
    { id: 6, title: 'Ojos Sin Ver', artist: 'Morad, ElGrandeToto', duration: '4:17', image: 'https://source.unsplash.com/random/50x50?sig=6' },
    { id: 7, title: 'Let me love you ~ Krisx', artist: 'Krisx', duration: '4:17', image: 'https://source.unsplash.com/random/50x50?sig=7' },
    { id: 8, title: 'M3a L3echrane', artist: 'Dizzy DROS', duration: '2:30', image: 'https://source.unsplash.com/random/50x50?sig=8' },
    { id: 9, title: 'Hiphop is dead', artist: 'Fat Mizzo', duration: '3:23', image: 'https://source.unsplash.com/random/50x50?sig=9' },
];

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tracks, setTracks] = useState<Track[]>(initialTracks);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(1);
    const [playbackRate, setPlaybackRateState] = useState(1.0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [favorites, setFavorites] = useState<number[]>(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Load tracks from DB
    useEffect(() => {
        const loadTracks = async () => {
            try {
                const storedTracks = await getAllTracks();
                console.log("Loaded tracks from DB:", storedTracks);
                if (storedTracks.length > 0) {
                    setTracks(prev => [...storedTracks, ...prev]);
                }
            } catch (error) {
                console.error("Failed to load tracks from DB:", error);
            }
        };
        loadTracks();
    }, []);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.volume = volume;

        const audio = audioRef.current;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration || 0);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    // Handle Play/Pause
    useEffect(() => {
        if (currentTrack && audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Play error:", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    const playTrack = (track: Track) => {
        if (currentTrack?.id === track.id) {
            togglePlay();
            return;
        }

        if (audioRef.current) {
            // Use provided audioUrl or fallback to sample
            audioRef.current.src = track.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
            audioRef.current.playbackRate = playbackRate;
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleFavorite = (trackId: number) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(trackId)
                ? prev.filter(id => id !== trackId)
                : [...prev, trackId];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const setVolume = (vol: number) => {
        setVolumeState(vol);
        if (audioRef.current) {
            audioRef.current.volume = vol;
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const addTrack = (file: File) => {
        const audioUrl = URL.createObjectURL(file);
        const tempAudio = new Audio(audioUrl);

        tempAudio.addEventListener('loadedmetadata', async () => {
            const duration = tempAudio.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            const metadata = await extractMetadata(file);
            const title = metadata.title || file.name.replace(/\.[^/.]+$/, "");
            const artist = metadata.artist || 'Local File';
            const image = metadata.pictureBlob ? URL.createObjectURL(metadata.pictureBlob) : 'https://source.unsplash.com/random/50x50?music';

            const newTrack: Track = {
                id: Date.now(),
                title: title,
                artist: artist,
                duration: formattedDuration,
                image: image,
                audioUrl: audioUrl
            };
            setTracks(prev => [newTrack, ...prev]);
            saveTrack(newTrack, file, metadata.pictureBlob).catch(e => console.error("Failed to save track:", e));
        });
    };

    const removeTrack = (id: number) => {
        setTracks(prev => prev.filter(t => t.id !== id));
        setFavorites(prev => {
            const newFavorites = prev.filter(fid => fid !== id);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
        if (currentTrack?.id === id) {
            setIsPlaying(false);
            setCurrentTrack(null);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        }
        deleteTrack(id).catch(e => console.error("Failed to delete track:", e));
    };

    const updateTrackTitle = (id: number, newTitle: string) => {
        setTracks(prev => prev.map(t => {
            if (t.id === id) {
                const updated = { ...t, title: newTitle };
                updateTrack(updated).catch(e => console.error("Failed to update track:", e));
                return updated;
            }
            return t;
        }));
    };

    const setPlaybackRate = (rate: number) => {
        setPlaybackRateState(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    const clearLibrary = async () => {
        setTracks([]);
        setFavorites([]);
        localStorage.removeItem('favorites');
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        setIsPlaying(false);
        setCurrentTrack(null);
        await clearAllTracks();
    };

    return (
        <PlayerContext.Provider value={{
            tracks,
            currentTrack,
            isPlaying,
            volume,
            currentTime,
            duration,
            favorites,
            playTrack,
            togglePlay,
            toggleFavorite,
            seek,
            setVolume,
            playbackRate,
            setPlaybackRate,
            formatTime,
            addTrack,
            removeTrack,
            updateTrackTitle,
            clearLibrary
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
