import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import TrackList from './TrackList';
import { ArrowLeft, Trash2, Music } from 'lucide-react';

const PlaylistDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { playlists, tracks, removePlaylist, removeTrackFromPlaylist } = usePlayer();
    const navigate = useNavigate();

    const playlist = playlists.find(p => p.id === id);

    if (!playlist) {
        return <div style={{ color: 'white', padding: '20px' }}>Playlist not found</div>;
    }

    const playlistTracks = tracks.filter(t => playlist.trackIds.includes(t.id));

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
            await removePlaylist(playlist.id);
            navigate('/playlists');
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div
                    onClick={() => navigate('/playlists')}
                    style={{
                        cursor: 'pointer',
                        padding: '10px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <ArrowLeft size={24} color="white" />
                </div>

                <div style={{
                    width: '150px',
                    height: '150px',
                    background: 'linear-gradient(135deg, var(--accent-color) 0%, #ff8fa3 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(255, 75, 110, 0.3)'
                }}>
                    <Music size={64} color="white" />
                </div>

                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '14px', color: 'var(--accent-color)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Playlist</h2>
                    <h1 style={{ fontSize: '48px', fontWeight: 800, color: 'white', margin: '10px 0' }}>{playlist.name}</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>{playlistTracks.length} tracks</p>
                </div>

                <button
                    onClick={handleDelete}
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 75, 110, 0.1)';
                        e.currentTarget.style.borderColor = 'var(--accent-color)';
                        e.currentTarget.style.color = 'var(--accent-color)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.color = 'white';
                    }}
                >
                    <Trash2 size={18} />
                    Delete Playlist
                </button>
            </div>

            {/* Tracks */}
            <TrackList
                tracks={playlistTracks}
                hideAddButton={true}
                onRemoveTrack={(trackId) => {
                    if (playlist) {
                        removeTrackFromPlaylist(playlist.id, trackId);
                    }
                }}
            />
        </div>
    );
};

export default PlaylistDetail;
