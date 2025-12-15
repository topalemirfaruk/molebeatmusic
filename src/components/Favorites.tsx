import React from 'react';
import { Search, Heart, MoreVertical } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';


const Favorites: React.FC = () => {
    const { favorites, playTrack, toggleFavorite, currentTrack, tracks } = usePlayer();

    const favoriteTracks = tracks.filter(track => favorites.includes(track.id));

    return (
        <div className="page-content" style={{ flex: 1, padding: '20px 40px', overflowY: 'auto', height: 'calc(100vh - 90px)' }}>
            {/* Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', color: '#666' }}>
                <Search size={20} />
                <span style={{ fontSize: '16px' }}>Search</span>
            </div>



            {/* Track List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {favoriteTracks.length === 0 ? (
                    <div style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>No favorite tracks yet.</div>
                ) : (
                    favoriteTracks.map((track) => {
                        const isCurrent = currentTrack?.id === track.id;
                        return (
                            <div key={track.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px',
                                borderRadius: '12px',
                                backgroundColor: isCurrent ? 'rgba(255,255,255,0.1)' : 'transparent',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                                onMouseEnter={(e) => {
                                    if (!isCurrent) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                                onClick={() => playTrack(track)}
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
                                    <Heart size={18} color="var(--accent-color)" fill="var(--accent-color)" />
                                </div>

                                {/* Title & Artist */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: isCurrent ? 'var(--accent-color)' : '#fff', fontSize: '14px', fontWeight: 500 }}>{track.title}</div>
                                    <div style={{ color: '#666', fontSize: '12px' }}>{track.artist}</div>
                                </div>

                                {/* Duration */}
                                <div style={{ color: '#fff', fontSize: '14px', marginRight: '30px' }}>{track.duration}</div>

                                {/* Options */}
                                <MoreVertical size={18} color="#666" />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Favorites;
