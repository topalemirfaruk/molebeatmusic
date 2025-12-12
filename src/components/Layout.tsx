import React from 'react';
import Sidebar from './Sidebar';
import PlayerBar from './PlayerBar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <Sidebar />
                <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {children}
                </div>
            </div>
            <PlayerBar />
        </div>
    );
};

export default Layout;
