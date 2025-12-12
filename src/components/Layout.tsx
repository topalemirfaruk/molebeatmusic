import React from 'react';
import Sidebar from './Sidebar';
import PlayerBar from './PlayerBar';
import { usePlayer } from '../context/PlayerContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isMiniPlayer, addTracks } = usePlayer();
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('audio/'));
        if (files.length > 0) {
            addTracks(files);
        }
    };

    return (
        <div
            style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {isDragging && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    pointerEvents: 'none' // Allow drop to pass through
                }}>
                    <div style={{
                        border: '3px dashed var(--accent-color)',
                        borderRadius: '20px',
                        padding: '50px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                        backgroundColor: 'rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ color: 'var(--accent-color)', fontSize: '64px' }}>📂</div>
                        <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>Drop Music Here</h2>
                        <p style={{ color: '#aaa' }}>Add tracks to your library</p>
                    </div>
                </div>
            )}

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {!isMiniPlayer && <Sidebar />}
                <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {children}
                </div>
            </div>
            <PlayerBar />
        </div>
    );
};

export default Layout;
