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
    Zap,
    Palette
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { getDatabaseUsage } from '../utils/db';

const Settings: React.FC = () => {
    const { volume, setVolume, tracks, favorites, playbackRate, setPlaybackRate, clearLibrary, themeColor, setThemeColor, equalizerBands, setEqualizerBand, setEqualizerPreset } = usePlayer();
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
            <Icon size={20} color="var(--accent-color)" />
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

            {/* Equalizer Settings */}
            <SectionTitle title="Equalizer" icon={Zap} />
            <div style={{ backgroundColor: '#252525', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ color: '#fff', fontSize: '15px' }}>10-Band EQ</div>
                    <select
                        onChange={(e) => {
                            const presets: { [key: string]: number[] } = {
                                'flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                'bass': [5, 4, 3, 2, 0, 0, 0, 0, 0, 0],
                                'rock': [4, 3, 2, 0, -1, -1, 0, 2, 3, 4],
                                'pop': [-1, 1, 3, 4, 4, 3, 1, -1, -1, -1],
                                'jazz': [3, 2, 1, 2, -2, -2, 0, 1, 2, 3],
                                'classical': [4, 3, 2, 1, -1, -1, 0, 2, 3, 4]
                            };
                            const val = e.target.value;
                            if (presets[val]) {
                                setEqualizerPreset(presets[val]);
                            }
                        }}
                        style={{
                            backgroundColor: '#333',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            outline: 'none',
                            cursor: 'pointer',
                            fontSize: '13px'
                        }}
                    >
                        <option value="flat">Flat</option>
                        <option value="bass">Bass Boost</option>
                        <option value="rock">Rock</option>
                        <option value="pop">Pop</option>
                        <option value="jazz">Jazz</option>
                        <option value="classical">Classical</option>
                    </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', height: '150px', alignItems: 'flex-end', gap: '10px' }}>
                    {equalizerBands.map((gain, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                            <input
                                type="range"
                                min="-12"
                                max="12"
                                value={gain}
                                onChange={(e) => setEqualizerBand(index, parseInt(e.target.value))}
                                style={{
                                    writingMode: 'bt-lr', /* IE */
                                    WebkitAppearance: 'slider-vertical', /* WebKit */
                                    width: '8px',
                                    height: '100px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    accentColor: 'var(--accent-color)'
                                } as any}
                            />
                            <div style={{ color: '#666', fontSize: '10px', marginTop: '10px' }}>
                                {[60, 170, 310, 600, '1k', '3k', '6k', '12k', '14k', '16k'][index]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Theme Settings */}
            <SectionTitle title="Theme" icon={Palette} />
            <div style={{
                backgroundColor: '#252525',
                padding: '20px',
                borderRadius: '12px',
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
                marginBottom: '20px'
            }}>
                {[
                    { name: 'Pink', color: '#ff4b6e' },
                    { name: 'Blue', color: '#4b6eff' },
                    { name: 'Green', color: '#4bff6e' },
                    { name: 'Purple', color: '#be4bff' },
                    { name: 'Orange', color: '#ffbe4b' },
                    { name: 'Cyan', color: '#4bbeff' },
                ].map((theme) => (
                    <div
                        key={theme.name}
                        onClick={() => setThemeColor(theme.color)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: theme.color,
                            cursor: 'pointer',
                            border: themeColor === theme.color ? '3px solid white' : '3px solid transparent',
                            transition: 'all 0.2s',
                            transform: themeColor === theme.color ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: themeColor === theme.color ? `0 0 15px ${theme.color}` : 'none'
                        }}
                        title={theme.name}
                    />
                ))}
            </div>

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
                        backgroundColor: isDarkMode ? 'var(--accent-color)' : 'transparent',
                        transition: 'all 0.2s'
                    }}>
                        <Moon size={14} color={isDarkMode ? '#fff' : '#666'} />
                    </div>
                    <div style={{
                        padding: '6px',
                        borderRadius: '50%',
                        backgroundColor: !isDarkMode ? 'var(--accent-color)' : 'transparent',
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
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '5px' }}>{tracks.length}</div>
                    <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Total Tracks</div>
                </div>
                <div style={{ backgroundColor: '#252525', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '5px' }}>{favorites.length}</div>
                    <div style={{ color: '#a0a0a0', fontSize: '13px' }}>Favorites</div>
                </div>
                <div style={{ backgroundColor: '#252525', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-color)', marginBottom: '5px' }}>{storageUsed}</div>
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
                        color: 'var(--accent-color)',
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
                <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--accent-color)', borderRadius: '15px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
