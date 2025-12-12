import React, { useState, useRef } from 'react';
import { Search, Heart, MoreVertical, Plus, ListPlus } from 'lucide-react';
import { usePlayer, type Track } from '../context/PlayerContext';

interface TrackListProps {
    tracks?: Track[];
    hideAddButton?: boolean;
    onRemoveTrack?: (id: number) => void;
}

const TrackList: React.FC<TrackListProps> = ({ tracks: propTracks, hideAddButton, onRemoveTrack }) => {
    const {
        tracks: contextTracks,
        playTrack,
        toggleFavorite,
        favorites,
        currentTrack,
        addTrack,
        removeTrack,
        updateTrackTitle,
        playlists,
        addTrackToPlaylist
    } = usePlayer();

    const tracksToUse = propTracks || contextTracks;

    const [searchTerm, setSearchTerm] = useState('');
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const [editingTrackId, setEditingTrackId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [showPlaylistSubmenu, setShowPlaylistSubmenu] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredTracks = tracksToUse.filter(track =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            addTrack(file);
        }
    };

    const startEditing = (track: Track) => {
        setEditingTrackId(track.id);
        setEditTitle(track.title);
        setActiveMenuId(null);
        setShowPlaylistSubmenu(null);
    };

    const saveTitle = (id: number) => {
        if (editTitle.trim()) {
            updateTrackTitle(id, editTitle.trim());
        }
        setEditingTrackId(null);
    };

    const handleAddToPlaylist = async (playlistId: string, trackId: number) => {
        await addTrackToPlaylist(playlistId, trackId);
        setActiveMenuId(null);
        setShowPlaylistSubmenu(null);
    };

    return (
        <div className="page-content" style={{ flex: 1, padding: '20px 40px', overflowY: 'auto', height: 'calc(100vh - 90px)' }} onClick={() => { setActiveMenuId(null); setShowPlaylistSubmenu(null); }}>
            {/* Header / Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#666', flex: 1 }}>
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            fontSize: '16px',
                            background: 'transparent',
                            border: 'none',
                            color: '#fff',
                            outline: 'none',
                            width: '100%'
                        }}
                    />
                </div>

                {/* Add Music Button */}
                {!hideAddButton && (
                    <>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                backgroundColor: 'var(--accent-color)',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                color: '#fff',
                                fontWeight: 500,
                                fontSize: '14px',
                                boxShadow: '0 4px 12px rgba(255, 75, 110, 0.3)'
                            }}
                        >
                            <Plus size={18} />
                            <span>Add Music</span>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="audio/*"
                            style={{ display: 'none' }}
                        />
                    </>
                )}
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredTracks.map((track) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const isFavorite = favorites.includes(track.id);

                    return (
                        <div key={track.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px',
                            borderRadius: '12px',
                            backgroundColor: isCurrent ? 'rgba(255,255,255,0.1)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            position: 'relative'
                        }}
                            onMouseEnter={(e) => {
                                if (!isCurrent) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            onClick={() => {
                                if (editingTrackId !== track.id) {
                                    playTrack(track);
                                }
                            }}
                        >
                            {/* Image */}
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                backgroundColor: '#333',
                                marginRight: '15px',
                                backgroundImage: `url(${track.image})`,
                                backgroundSize: 'cover'
                            }}></div>

                            {/* Heart */}
                            <div
                                style={{ marginRight: '20px', cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(track.id);
                                }}
                            >
                                <Heart
                                    size={18}
                                    color={isFavorite ? "var(--accent-color)" : "#666"}
                                    fill={isFavorite ? "var(--accent-color)" : "none"}
                                />
                            </div>

                            {/* Title & Artist */}
                            <div style={{ flex: 1 }}>
                                {editingTrackId === track.id ? (
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveTitle(track.id);
                                            e.stopPropagation();
                                        }}
                                        onBlur={() => saveTitle(track.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            borderBottom: '1px solid var(--accent-color)',
                                            color: '#fff',
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            outline: 'none',
                                            width: '100%'
                                        }}
                                    />
                                ) : (
                                    <div style={{ color: isCurrent ? '#ff4b6e' : '#fff', fontSize: '14px', fontWeight: 500 }}>{track.title}</div>
                                )}
                                <div style={{ color: '#666', fontSize: '12px' }}>{track.artist}</div>
                            </div>

                            {/* Duration */}
                            <div style={{ color: '#fff', fontSize: '14px', marginRight: '30px' }}>{track.duration}</div>

                            {/* Options */}
                            <div style={{ position: 'relative' }}>
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveMenuId(activeMenuId === track.id ? null : track.id);
                                        setShowPlaylistSubmenu(null);
                                    }}
                                    style={{ padding: '5px', cursor: 'pointer' }}
                                >
                                    <MoreVertical size={18} color="#666" />
                                </div>

                                {activeMenuId === track.id && (
                                    <div style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '100%',
                                        backgroundColor: '#2a2a2a',
                                        borderRadius: '8px',
                                        padding: '5px',
                                        zIndex: 10,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                        minWidth: '160px'
                                    }}>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowPlaylistSubmenu(showPlaylistSubmenu === track.id ? null : track.id);
                                            }}
                                            style={{
                                                padding: '8px 12px',
                                                color: '#fff',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                position: 'relative'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <ListPlus size={14} />
                                            Add to Playlist
                                            {showPlaylistSubmenu === track.id && (
                                                <div style={{
                                                    position: 'absolute',
                                                    right: '100%',
                                                    top: 0,
                                                    backgroundColor: '#2a2a2a',
                                                    borderRadius: '8px',
                                                    padding: '5px',
                                                    zIndex: 11,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                                    minWidth: '150px',
                                                    marginRight: '5px'
                                                }}>
                                                    {playlists.length > 0 ? playlists.map(p => (
                                                        <div
                                                            key={p.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddToPlaylist(p.id, track.id);
                                                            }}
                                                            style={{
                                                                padding: '8px 12px',
                                                                color: '#fff',
                                                                fontSize: '13px',
                                                                cursor: 'pointer',
                                                                borderRadius: '4px'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        >
                                                            {p.name}
                                                        </div>
                                                    )) : (
                                                        <div style={{ padding: '8px 12px', color: '#666', fontSize: '12px' }}>No playlists</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(track);
                                            }}
                                            style={{
                                                padding: '8px 12px',
                                                color: '#fff',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            Rename
                                        </div>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onRemoveTrack) {
                                                    onRemoveTrack(track.id);
                                                } else {
                                                    removeTrack(track.id);
                                                }
                                                setActiveMenuId(null);
                                            }}
                                            style={{
                                                padding: '8px 12px',
                                                color: '#ff4b6e',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 75, 110, 0.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            {onRemoveTrack ? 'Remove from Playlist' : 'Delete'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TrackList;
