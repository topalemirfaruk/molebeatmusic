import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import {
    saveTrack,
    getAllTracks,
    deleteTrack,
    updateTrack,
    clearAllTracks,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    getAllPlaylists,
    type Playlist
} from '../utils/db';
import { extractMetadata } from '../utils/metadata';
import { fetchLyrics, parseLRC, type LyricLine } from '../utils/lyrics';

declare global {
    interface Window {
        electronAPI?: {
            onYouTubeCode: (callback: (code: string) => void) => void;
            toggleMiniPlayer: (enabled: boolean) => void;
        };
    }
}

export interface Track {
    id: number;
    title: string;
    artist: string;
    album?: string;
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
    playlists: Playlist[];
    playTrack: (track: Track) => void;
    togglePlay: () => void;
    toggleFavorite: (trackId: number) => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
    setPlaybackRate: (rate: number) => void;
    formatTime: (time: number) => string;
    addTrack: (file: File) => void;
    addTracks: (files: File[]) => void;
    removeTrack: (id: number) => void;
    updateTrackTitle: (id: number, newTitle: string) => void;
    clearLibrary: () => void;
    createNewPlaylist: (name: string) => Promise<void>;
    removePlaylist: (id: string) => Promise<void>;
    addTrackToPlaylist: (playlistId: string, trackId: number) => Promise<void>;
    removeTrackFromPlaylist: (playlistId: string, trackId: number) => Promise<void>;
    lyrics: LyricLine[];
    currentLineIndex: number;
    isMiniPlayer: boolean;
    toggleMiniPlayerMode: () => void;
    themeColor: string;
    setThemeColor: (color: string) => void;
    equalizerBands: number[];
    setEqualizerBand: (index: number, value: number) => void;
    setEqualizerPreset: (preset: number[]) => void;
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

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [lyrics, setLyrics] = useState<LyricLine[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio Element
    useEffect(() => {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audioRef.current = audio;

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

    // Fetch Lyrics when track changes
    useEffect(() => {
        const getLyrics = async () => {
            if (currentTrack) {
                setLyrics([]); // Clear previous lyrics
                setCurrentLineIndex(-1);
                // Convert duration string "MM:SS" to seconds
                const [min, sec] = currentTrack.duration.split(':').map(Number);
                const durationSec = min * 60 + sec;

                const lyricsData = await fetchLyrics(currentTrack.artist, currentTrack.title, durationSec);
                if (lyricsData) {
                    const parsed = parseLRC(lyricsData);
                    setLyrics(parsed);
                }
            } else {
                setLyrics([]);
            }
        };
        getLyrics();
    }, [currentTrack]);

    // Update current line index based on time
    useEffect(() => {
        if (lyrics.length > 0) {
            const index = lyrics.findIndex((line, i) => {
                const nextLine = lyrics[i + 1];
                return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
            });
            if (index !== -1 && index !== currentLineIndex) {
                setCurrentLineIndex(index);
            }
        }
    }, [currentTime, lyrics]);

    // Load tracks from DB
    useEffect(() => {
        const loadTracks = async () => {
            try {
                const storedTracks = await getAllTracks();
                if (storedTracks.length > 0) {
                    setTracks(prev => [...storedTracks, ...prev]);
                }
            } catch (error) {
                console.error("Failed to load tracks from DB:", error);
            }
        };
        loadTracks();
    }, []);

    // Load playlists from DB
    useEffect(() => {
        const loadPlaylists = async () => {
            try {
                const storedPlaylists = await getAllPlaylists();
                setPlaylists(storedPlaylists);
            } catch (error) {
                console.error("Failed to load playlists:", error);
            }
        };
        loadPlaylists();
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

    const playTrack = async (track: Track) => {
        if (currentTrack?.id === track.id) {
            togglePlay();
            return;
        }

        if (audioRef.current) {
            audioRef.current.src = track.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
            audioRef.current.playbackRate = playbackRate;
            audioRef.current.volume = volume;
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

    const setPlaybackRate = (rate: number) => {
        setPlaybackRateState(rate);
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const addTrack = (file: File) => {
        addTracks([file]);
    };

    const addTracks = async (files: File[]) => {
        const newTracks: Track[] = [];

        for (const file of files) {
            // Create a promise to handle the async nature of audio metadata loading
            const processFile = new Promise<Track>((resolve) => {
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
                    const album = metadata.album || 'Unknown Album';
                    const image = metadata.pictureBlob ? URL.createObjectURL(metadata.pictureBlob) : 'https://source.unsplash.com/random/50x50?music';

                    const newTrack: Track = {
                        id: Date.now() + Math.random(), // Ensure unique ID
                        title: title,
                        artist: artist,
                        album: album,
                        duration: formattedDuration,
                        image: image,
                        audioUrl: audioUrl
                    };

                    // Save to DB immediately
                    saveTrack(newTrack, file, metadata.pictureBlob).catch(e => console.error("Failed to save track:", e));

                    resolve(newTrack);
                });

                tempAudio.addEventListener('error', () => {
                    console.error("Error loading audio file:", file.name);
                    // Resolve with a dummy or null, but for now we just skip handling error gracefully in UI
                    // In a real app we might want to reject or return null
                    resolve({} as Track); // Should filter this out later if we were strict
                });
            });

            const track = await processFile;
            if (track.id) {
                newTracks.push(track);
            }
        }

        setTracks(prev => [...newTracks, ...prev]);
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

    const createNewPlaylist = async (name: string) => {
        const newPlaylist = await createPlaylist(name);
        setPlaylists(prev => [...prev, newPlaylist]);
    };

    const removePlaylist = async (id: string) => {
        await deletePlaylist(id);
        setPlaylists(prev => prev.filter(p => p.id !== id));
    };

    const [isMiniPlayer, setIsMiniPlayer] = useState(false);

    const toggleMiniPlayerMode = () => {
        const newState = !isMiniPlayer;
        setIsMiniPlayer(newState);
        if (window.electronAPI) {
            window.electronAPI.toggleMiniPlayer(newState);
        }
    };

    const [themeColor, setThemeColorState] = useState('#ff4b6e');

    useEffect(() => {
        const savedTheme = localStorage.getItem('themeColor');
        if (savedTheme) {
            setThemeColor(savedTheme);
        }
    }, []);

    const setThemeColor = (color: string) => {
        setThemeColorState(color);
        document.documentElement.style.setProperty('--accent-color', color);
        localStorage.setItem('themeColor', color);
    };

    const addTrackToPlaylist = async (playlistId: string, trackId: number) => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist && !playlist.trackIds.includes(trackId)) {
            const updatedPlaylist = { ...playlist, trackIds: [...playlist.trackIds, trackId] };
            await updatePlaylist(updatedPlaylist);
            setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
        }
    };

    const removeTrackFromPlaylist = async (playlistId: string, trackId: number) => {
        const playlist = playlists.find(p => p.id === playlistId);
        if (playlist) {
            const updatedPlaylist = { ...playlist, trackIds: playlist.trackIds.filter(id => id !== trackId) };
            await updatePlaylist(updatedPlaylist);
            setPlaylists(prev => prev.map(p => p.id === playlistId ? updatedPlaylist : p));
        }
    };

    // Equalizer State
    const [equalizerBands, setEqualizerBands] = useState<number[]>(new Array(10).fill(0));
    const filtersRef = useRef<BiquadFilterNode[]>([]);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Initialize Audio Context and Equalizer
    useEffect(() => {
        if (!audioRef.current) return;

        const initAudioContext = () => {
            if (!audioContextRef.current) {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioContext();

                const audio = audioRef.current!;
                if (!sourceRef.current) {
                    sourceRef.current = audioContextRef.current.createMediaElementSource(audio);
                }

                // Create filters
                const frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
                const filters = frequencies.map(freq => {
                    const filter = audioContextRef.current!.createBiquadFilter();
                    filter.type = 'peaking';
                    filter.frequency.value = freq;
                    filter.Q.value = 1;
                    filter.gain.value = 0;
                    return filter;
                });

                filtersRef.current = filters;

                // Connect nodes: Source -> Filter1 -> Filter2 ... -> Destination
                let currentNode: AudioNode = sourceRef.current;
                filters.forEach(filter => {
                    currentNode.connect(filter);
                    currentNode = filter;
                });
                currentNode.connect(audioContextRef.current.destination);
            }
        };

        // Initialize on first user interaction to comply with autoplay policies
        const handleInteraction = () => {
            initAudioContext();
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    const setEqualizerBand = (index: number, value: number) => {
        const newBands = [...equalizerBands];
        newBands[index] = value;
        setEqualizerBands(newBands);

        if (filtersRef.current[index]) {
            filtersRef.current[index].gain.value = value;
        }
    };

    const setEqualizerPreset = (preset: number[]) => {
        setEqualizerBands(preset);
        preset.forEach((value, index) => {
            if (filtersRef.current[index]) {
                filtersRef.current[index].gain.value = value;
            }
        });
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
            playlists,
            playTrack,
            togglePlay,
            toggleFavorite,
            seek,
            setVolume,
            playbackRate,
            setPlaybackRate,
            formatTime,
            addTrack,
            addTracks,
            removeTrack,
            updateTrackTitle,
            clearLibrary,
            createNewPlaylist,
            removePlaylist,
            addTrackToPlaylist,
            removeTrackFromPlaylist,
            lyrics,
            currentLineIndex,
            isMiniPlayer,
            toggleMiniPlayerMode,
            themeColor,
            setThemeColor,
            equalizerBands,
            setEqualizerBand,
            setEqualizerPreset
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
