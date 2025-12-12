import React from 'react';
import { Search, Heart, MoreVertical, ThumbsUp, Star, RotateCcw } from 'lucide-react';
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

            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                {/* Favorite tracks */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#1e1c2e',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#333', backgroundImage: 'url(https://source.unsplash.com/random/50x50?sig=10)', backgroundSize: 'cover' }}></div>
                        <div>
                            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>Favorite tracks</div>
                            <div style={{ color: '#666', fontSize: '13px' }}>{favoriteTracks.length} tracks</div>
                        </div>
                    </div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ThumbsUp size={18} color="#fff" />
                    </div>
                </div>

                {/* Most played */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#1e1c2e',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#333', backgroundImage: 'url(https://source.unsplash.com/random/50x50?sig=11)', backgroundSize: 'cover' }}></div>
                        <div>
                            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>Most played</div>
                            <div style={{ color: '#666', fontSize: '13px' }}>100 tracks</div>
                        </div>
                    </div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={18} color="#fff" />
                    </div>
                </div>

                {/* Recently played */}
                <div style={{
                    flex: 1,
                    backgroundColor: '#1e1c2e',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '8px', backgroundColor: '#333', backgroundImage: 'url(https://source.unsplash.com/random/50x50?sig=12)', backgroundSize: 'cover' }}></div>
                        <div>
                            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 500 }}>Recently played</div>
                            <div style={{ color: '#666', fontSize: '13px' }}>100 tracks</div>
                        </div>
                    </div>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RotateCcw size={18} color="#fff" />
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: '20px' }}></div>

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
                                    <Heart size={18} color="#ff4b6e" fill="#ff4b6e" />
                                </div>

                                {/* Title & Artist */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: isCurrent ? '#ff4b6e' : '#fff', fontSize: '14px', fontWeight: 500 }}>{track.title}</div>
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
