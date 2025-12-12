import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Link } from 'react-router-dom';
import { Plus, Music, Trash2 } from 'lucide-react';

const Playlists: React.FC = () => {
    const { playlists, createNewPlaylist, removePlaylist } = usePlayer();
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlaylistName.trim()) {
            await createNewPlaylist(newPlaylistName);
            setNewPlaylistName('');
            setIsCreating(false);
        }
    };

    return (
        <div style={{ padding: '20px', color: 'white', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Your Playlists</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    style={{
                        background: 'var(--accent-color)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: 600
                    }}
                >
                    <Plus size={18} /> New Playlist
                </button>
            </div>

            {isCreating && (
                <div style={{
                    marginBottom: '20px',
                    background: 'var(--bg-secondary)',
                    padding: '20px',
                    borderRadius: '12px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center'
                }}>
                    <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Playlist Name"
                        autoFocus
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '10px',
                            borderRadius: '8px',
                            color: 'white',
                            flex: 1
                        }}
                    />
                    <button
                        onClick={handleCreate}
                        style={{
                            background: 'var(--accent-color)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Create
                    </button>
                    <button
                        onClick={() => setIsCreating(false)}
                        style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--text-secondary)',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {playlists.map(playlist => (
                    <div key={playlist.id} style={{ position: 'relative' }}>
                        <Link to={`/playlists/${playlist.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'var(--bg-secondary)',
                                borderRadius: '12px',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '15px',
                                transition: 'transform 0.2s, background 0.2s',
                                cursor: 'pointer',
                                height: '100%'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.background = 'var(--bg-secondary)';
                                }}
                            >
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    background: 'var(--accent-color)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <Music size={48} />
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{playlist.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{playlist.trackIds.length} Tracks</p>
                                </div>
                            </div>
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (confirm('Are you sure you want to delete this playlist?')) {
                                    removePlaylist(playlist.id);
                                }
                            }}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(0,0,0,0.5)',
                                border: 'none',
                                color: 'white',
                                padding: '8px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                opacity: 0,
                                transition: 'opacity 0.2s'
                            }}
                            className="delete-btn"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
                div:hover > .delete-btn {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
};

export default Playlists;
