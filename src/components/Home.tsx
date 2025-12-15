import React, { useState, useMemo } from 'react';
import { Search, Heart, Clock, BarChart2, Play } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import TrackList from './TrackList';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const { tracks, favorites, playTrack } = usePlayer();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const mostPlayed = useMemo(() => {
        return [...tracks]
            .filter(t => (t.playCount || 0) > 0)
            .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
            .slice(0, 100);
    }, [tracks]);

    const recentlyPlayed = useMemo(() => {
        return [...tracks]
            .filter(t => t.lastPlayed)
            .sort((a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0))
            .slice(0, 100);
    }, [tracks]);

    const favoriteTracks = useMemo(() => {
        return tracks.filter(t => favorites.includes(t.id));
    }, [tracks, favorites]);

    const StatCard = ({ title, count, icon: Icon, color, onClick, image }: any) => (
        <div
            onClick={onClick}
            style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s, background-color 0.2s',
                flex: 1,
                minWidth: '200px',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.backgroundColor = '#4a4866';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            }}
        >
            <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                backgroundColor: image ? 'transparent' : 'rgba(255,255,255,0.05)',
                backgroundImage: image ? `url(${image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: image ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
            }}>
                {!image && <Icon size={24} color={color} />}
            </div>
            <div style={{ zIndex: 1 }}>
                <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{title}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{count} tracks</div>
            </div>
            <div style={{ marginLeft: 'auto', opacity: 0.5, zIndex: 1 }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Play size={14} fill="currentColor" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="page-content" style={{ flex: 1, padding: '20px 40px', overflowY: 'auto', height: 'calc(100vh - 90px)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', paddingTop: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '5px' }}>Discover</h1>
                    <p style={{ color: '#666', fontSize: '14px' }}>Listen to your favorite music</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Search Bar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: '#1e1c2e',
                        padding: '10px 20px',
                        borderRadius: '25px',
                        width: '300px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <Search size={18} color="#666" />
                        <input
                            type="text"
                            placeholder="Search for songs, artists..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                fontSize: '14px',
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                outline: 'none',
                                width: '100%'
                            }}
                        />
                    </div>

                    {/* User Profile Placeholder - Removed as per user request */}
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <StatCard
                    title="Favorite tracks"
                    count={favoriteTracks.length}
                    icon={Heart}
                    color="#ff4b6e"
                    image={favoriteTracks.length > 0 ? favoriteTracks[0].image : undefined}
                    onClick={() => navigate('/favorites')}
                />
                <StatCard
                    title="Most played"
                    count={mostPlayed.length}
                    icon={BarChart2}
                    color="#4b6eff"
                    image={mostPlayed.length > 0 ? mostPlayed[0].image : undefined}
                    onClick={() => {
                        if (mostPlayed.length > 0) playTrack(mostPlayed[0]);
                    }}
                />
                <StatCard
                    title="Recently played"
                    count={recentlyPlayed.length}
                    icon={Clock}
                    color="#4bff6e"
                    image={recentlyPlayed.length > 0 ? recentlyPlayed[0].image : undefined}
                    onClick={() => {
                        if (recentlyPlayed.length > 0) playTrack(recentlyPlayed[0]);
                    }}
                />
            </div>

            {/* Track List */}
            <TrackList
                tracks={tracks.filter(t =>
                    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.artist.toLowerCase().includes(searchTerm.toLowerCase())
                )}
                hideSearch={true}
            />
        </div>
    );
};

export default Home;
