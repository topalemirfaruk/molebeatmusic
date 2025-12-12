
import React from 'react';
import { Home, Heart, Settings, Music } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const iconContainerStyle = (active: boolean) => ({
        width: '36px',
        height: '36px',
        backgroundColor: active ? '#fff' : 'transparent',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? '#000' : '#666',
        cursor: 'pointer',
        transition: 'all 0.2s'
    });

    return (
        <div style={{
            width: '80px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '40px',
            gap: '30px'
        }}>
            <div style={{
                width: '50px',
                height: 'auto',
                backgroundColor: '#181818',
                borderRadius: '25px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '25px',
                padding: '25px 0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
                <div
                    className={`sidebar-icon ${isActive('/') ? 'active' : ''}`}
                    style={iconContainerStyle(isActive('/'))}
                    onClick={() => navigate('/')}
                >
                    <Home size={20} />
                </div>

                <div
                    className={`sidebar-icon ${isActive('/albums') ? 'active' : ''}`}
                    style={iconContainerStyle(isActive('/albums'))}
                    onClick={() => navigate('/albums')}
                >
                    <Music size={20} />
                </div>

                <div
                    className={`sidebar-icon ${isActive('/favorites') ? 'active' : ''}`}
                    style={iconContainerStyle(isActive('/favorites'))}
                    onClick={() => navigate('/favorites')}
                >
                    <Heart size={20} fill={isActive('/favorites') ? "currentColor" : "none"} />
                </div>

                <div
                    className={`sidebar-icon ${isActive('/settings') ? 'active' : ''}`}
                    style={iconContainerStyle(isActive('/settings'))}
                    onClick={() => navigate('/settings')}
                >
                    <Settings size={20} />
                </div>
            </div>

        </div>
    );
};

export default Sidebar;
