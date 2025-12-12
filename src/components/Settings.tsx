import React, { useState } from 'react';
import {
    Volume2,
    Monitor,
    HardDrive,
    Info,
    Moon,
    Sun,
    Trash2,
    Github,
    Globe,
    Zap
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { getDatabaseUsage } from '../utils/db';

const Settings: React.FC = () => {
    const { volume, setVolume, tracks, favorites, playbackRate, setPlaybackRate, clearLibrary } = usePlayer();
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [storageUsed, setStorageUsed] = useState<string>('Calculating...');

    React.useEffect(() => {
        getDatabaseUsage().then((bytes: number) => {
            const mb = bytes / (1024 * 1024);
            if (mb > 1024) {
                setStorageUsed(`${(mb / 1024).toFixed(2)} GB`);
            } else {
                setStorageUsed(`${mb.toFixed(2)} MB`);
            }
        });
    }, [tracks]); // Recalculate when tracks change

    const handleClearDatabase = () => {
        if (confirm('Are you sure you want to clear your library? This cannot be undone.')) {
            clearLibrary();
        }
    };

    const SectionTitle = ({ title, icon: Icon }: { title: string, icon: any }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', marginTop: '30px' }}>
            <Icon size={20} color="#ff4b6e" />
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#fff' }}>{title}</h2>
        </div>
    );

    const SettingItem = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => (
        <div style={{
            backgroundColor: '#252525',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...style
        }}>
            {children}
        </div>
    );

    return (
        <div className="page-content" style={{ flex: 1, padding: '20px 40px', overflowY: 'auto', height: 'calc(100vh - 90px)' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '10px' }}>Settings</h1>
            <p style={{ color: '#a0a0a0', marginBottom: '40px' }}>Manage your preferences and application data</p>

            {/* Audio Settings */}
            <SectionTitle title="Audio" icon={Volume2} />

            <SettingItem>
                <div>
                    <div style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>Global Volume</div>
                    <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Adjust the master volume output</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '200px' }}>
                    <Volume2 size={16} color="#a0a0a0" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        style={{
                            flex: 1,
                            height: '4px',
                            background: '#383651',
                            borderRadius: '2px',
                            appearance: 'none',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    />
                    <span style={{ color: '#fff', fontSize: '13px', width: '30px', textAlign: 'right' }}>{Math.round(volume * 100)}%</span>
                </div>
            </SettingItem>

            <SettingItem>
                <div>
                    <div style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>Playback Speed</div>
                    <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Control the speed of audio playback</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <select
                        value={playbackRate}
                        onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                        style={{
                            backgroundColor: '#333',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1">Normal</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                        <option value="2">2.0x</option>
                    </select>
                </div>
            </SettingItem>

            {/* Appearance Settings */}
            <SectionTitle title="Appearance" icon={Monitor} />

            <SettingItem>
                <div>
                    <div style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>App Theme</div>
                    <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Switch between dark and light mode</div>
                </div>
                <div
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    style={{
                        backgroundColor: '#333',
                        padding: '4px',
                        borderRadius: '20px',
                        display: 'flex',
                        gap: '4px',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{
                        padding: '6px',
                        borderRadius: '50%',
                        backgroundColor: isDarkMode ? '#ff4b6e' : 'transparent',
                        transition: 'all 0.2s'
                    }}>
                        <Moon size={14} color={isDarkMode ? '#fff' : '#666'} />
                    </div>
                    <div style={{
                        padding: '6px',
                        borderRadius: '50%',
                        backgroundColor: !isDarkMode ? '#ff4b6e' : 'transparent',
                        transition: 'all 0.2s'
                    }}>
                        <Sun size={14} color={!isDarkMode ? '#fff' : '#666'} />
                    </div>
                </div>
            </SettingItem>

            {/* Storage Settings */}
            <SectionTitle title="Storage & Data" icon={HardDrive} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div style={{ backgroundColor: '#252525', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff4b6e', marginBottom: '5px' }}>{tracks.length}</div>
                    <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Total Tracks</div>
                </div>
                <div style={{ backgroundColor: '#252525', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff4b6e', marginBottom: '5px' }}>{favorites.length}</div>
                    <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Favorites</div>
                </div>
                <div style={{ backgroundColor: '#252525', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff4b6e', marginBottom: '5px' }}>{storageUsed}</div>
                    <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Storage Used</div>
                </div>
            </div>

            <SettingItem>
                <div>
                    <div style={{ color: '#fff', fontSize: '15px', marginBottom: '4px' }}>Clear Library</div>
                    <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Remove all tracks and reset database</div>
                </div>
                <button
                    onClick={handleClearDatabase}
                    style={{
                        backgroundColor: 'rgba(255, 75, 110, 0.1)',
                        color: '#ff4b6e',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Trash2 size={14} />
                    Clear Data
                </button>
            </SettingItem>

            {/* About Section */}
            <SectionTitle title="About" icon={Info} />

            <div style={{ backgroundColor: '#252525', borderRadius: '12px', padding: '30px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#ff4b6e', borderRadius: '15px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={32} color="#fff" fill="currentColor" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '5px' }}>MoleBeat Music</h3>
                <p style={{ color: '#a0a0a0', fontSize: '14px', marginBottom: '20px' }}>Version 1.0.0 • Electron Build</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#333', padding: '8px 16px', borderRadius: '20px', fontSize: '13px' }}>
                        <Github size={16} />
                        GitHub
                    </a>
                    <a href="#" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#333', padding: '8px 16px', borderRadius: '20px', fontSize: '13px' }}>
                        <Globe size={16} />
                        Website
                    </a>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px', color: '#666', fontSize: '12px' }}>
                &copy; 2025 MoleBeat Team. All rights reserved.
            </div>
        </div>
    );
};

export default Settings;
