import React, { createContext, useState, useContext, useRef, useEffect, useCallback } from 'react';
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



export interface Track {
    id: number;
    title: string;
    artist: string;
    album?: string;
    duration: string;
    image: string;
    audioUrl?: string;
    playCount?: number;
    lastPlayed?: number;
}

export type RepeatMode = 'off' | 'all' | 'one';

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
    isShuffling: boolean;
    repeatMode: RepeatMode;
    playTrack: (track: Track) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    toggleFavorite: (trackId: number) => void;
    seek: (time: number) => void;
    setVolume: (vol: number) => void;
    setPlaybackRate: (rate: number) => void;
    formatTime: (time: number) => string;
    addTrack: (file: File) => void;
    addTracks: (files: File[]) => void;
    removeTrack: (id: number) => void;
    updateTrackTitle: (id: number, newTitle: string) => void;
    updateTrackMetadata: (id: number, title: string, artist: string, imageBlob?: Blob) => Promise<void>;
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
    analyserNode: AnalyserNode | null;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(1);
    const [playbackRate, setPlaybackRateState] = useState(1.0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isShuffling, setIsShuffling] = useState(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
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

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    // Handle track ending (auto-play next)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            if (repeatMode === 'one') {
                audio.currentTime = 0;
                audio.play();
            } else {
                playNext();
            }
        };

        audio.addEventListener('ended', handleEnded);
        return () => audio.removeEventListener('ended', handleEnded);
    }, [currentTrack, tracks, isShuffling, repeatMode]); // Dependencies are crucial here

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

        // Update stats
        const updatedTrack = {
            ...track,
            playCount: (track.playCount || 0) + 1,
            lastPlayed: Date.now()
        };

        // Update local state
        setTracks(prev => prev.map(t => t.id === track.id ? updatedTrack : t));

        // Update DB
        updateTrack(updatedTrack).catch(e => console.error("Failed to update track stats:", e));

        if (audioRef.current) {
            audioRef.current.src = track.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
            audioRef.current.playbackRate = playbackRate;
            audioRef.current.volume = volume;
            setCurrentTrack(updatedTrack);
            setIsPlaying(true);
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const playNext = useCallback(() => {
        if (!currentTrack || tracks.length === 0) return;

        let nextTrack: Track;

        if (isShuffling) {
            const randomIndex = Math.floor(Math.random() * tracks.length);
            nextTrack = tracks[randomIndex];
        } else {
            const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
            const nextIndex = (currentIndex + 1) % tracks.length;

            // If we reached the end and repeat is off, stop
            if (currentIndex === tracks.length - 1 && repeatMode === 'off') {
                setIsPlaying(false);
                return;
            }

            nextTrack = tracks[nextIndex];
        }

        playTrack(nextTrack);
    }, [currentTrack, tracks, isShuffling, repeatMode]);

    const playPrevious = () => {
        if (!currentTrack || tracks.length === 0) return;

        // If playing for more than 3 seconds, restart track
        if (currentTime > 3) {
            seek(0);
            return;
        }

        let prevTrack: Track;

        if (isShuffling) {
            const randomIndex = Math.floor(Math.random() * tracks.length);
            prevTrack = tracks[randomIndex];
        } else {
            const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
            const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
            prevTrack = tracks[prevIndex];
        }

        playTrack(prevTrack);
    };

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    const toggleRepeat = () => {
        setRepeatMode(prev => {
            if (prev === 'off') return 'all';
            if (prev === 'all') return 'one';
            return 'off';
        });
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

    const updateTrackMetadata = async (id: number, title: string, artist: string, imageBlob?: Blob) => {
        let imageUrl: string | undefined;
        if (imageBlob) {
            imageUrl = URL.createObjectURL(imageBlob);
        }

        setTracks(prev => prev.map(t => {
            if (t.id === id) {
                const updated = {
                    ...t,
                    title,
                    artist,
                    image: imageUrl || t.image
                };
                // Pass imageBlob to updateTrack if it exists
                updateTrack(updated, imageBlob).catch(e => console.error("Failed to update track metadata:", e));
                return updated;
            }
            return t;
        }));

        // If current track is being updated, update it as well
        if (currentTrack?.id === id) {
            setCurrentTrack(prev => prev ? {
                ...prev,
                title,
                artist,
                image: imageUrl || prev.image
            } : null);
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
    const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

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

                // Create Analyser
                const analyser = audioContextRef.current.createAnalyser();
                analyser.fftSize = 256;
                setAnalyserNode(analyser);

                // Connect nodes: Source -> Filter1 -> Filter2 ... -> Analyser -> Destination
                let currentNode: AudioNode = sourceRef.current;
                filters.forEach(filter => {
                    currentNode.connect(filter);
                    currentNode = filter;
                });

                currentNode.connect(analyser);
                analyser.connect(audioContextRef.current.destination);
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
            isShuffling,
            repeatMode,
            playTrack,
            togglePlay,
            playNext,
            playPrevious,
            toggleShuffle,
            toggleRepeat,
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
            updateTrackMetadata,
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
            setEqualizerPreset,
            analyserNode
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
