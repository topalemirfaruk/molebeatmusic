import React from 'react';
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, Volume1, VolumeX } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

const PlayerBar: React.FC = () => {
    const {
        currentTrack,
        isPlaying,
        togglePlay,
        currentTime,
        duration,
        seek,
        volume,
        setVolume,
        formatTime
    } = usePlayer();

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        seek(Number(e.target.value));
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(Number(e.target.value));
    };

    if (!currentTrack) {
        return (
            <div style={{
                height: '90px',
                backgroundColor: '#1e1c2e',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 40px',
                color: '#666'
            }}>
                Select a track to start playing
            </div>
        );
    }

    return (
        <div style={{
            height: '90px',
            backgroundColor: '#1e1c2e',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            position: 'relative',
            zIndex: 10
        }}>
            {/* Track Info */}
            <div style={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '8px',
                    backgroundColor: '#333',
                    marginRight: '15px',
                    backgroundImage: `url(${currentTrack.image})`,
                    backgroundSize: 'cover'
                }}></div>
                <div>
                    <div style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>{currentTrack.title}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{currentTrack.artist}</div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '40%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '8px' }}>
                    <Shuffle size={18} color="#666" style={{ cursor: 'pointer' }} />
                    <SkipBack size={20} color="#fff" style={{ cursor: 'pointer' }} />

                    <div
                        onClick={togglePlay}
                        style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: '#fff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 0 10px rgba(255,255,255,0.2)'
                        }}
                    >
                        {isPlaying ?
                            <Pause size={20} fill="#000" color="#000" /> :
                            <Play size={20} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                        }
                    </div>

                    <SkipForward size={20} color="#fff" style={{ cursor: 'pointer' }} />
                    <Repeat size={18} color="#666" style={{ cursor: 'pointer' }} />
                </div>

                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                    <span style={{ color: '#666', fontSize: '11px', minWidth: '35px', textAlign: 'right' }}>{formatTime(currentTime)}</span>
                    <div style={{ flex: 1, height: '4px', backgroundColor: '#383651', borderRadius: '2px', position: 'relative', cursor: 'pointer' }}>
                        <input
                            type="range"
                            min="0"
                            max={duration || 100}
                            value={currentTime}
                            onChange={handleSeek}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer',
                                zIndex: 2
                            }}
                        />
                        <div style={{
                            width: `${(currentTime / (duration || 1)) * 100}%`,
                            height: '100%',
                            backgroundColor: '#fff',
                            borderRadius: '2px',
                            position: 'relative'
                        }}>
                            <div style={{
                                width: '10px',
                                height: '10px',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                                position: 'absolute',
                                right: '-5px',
                                top: '-3px',
                                boxShadow: '0 0 5px rgba(0,0,0,0.3)'
                            }}></div>
                        </div>
                    </div>
                    <span style={{ color: '#666', fontSize: '11px', minWidth: '35px' }}>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume */}
            <div style={{ display: 'flex', alignItems: 'center', width: '30%', justifyContent: 'flex-end', gap: '10px' }}>
                {volume === 0 ? <VolumeX size={18} color="#fff" /> : volume < 0.5 ? <Volume1 size={18} color="#fff" /> : <Volume2 size={18} color="#fff" />}
                <div style={{ width: '100px', height: '4px', backgroundColor: '#383651', borderRadius: '2px', position: 'relative' }}>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer',
                            zIndex: 2
                        }}
                    />
                    <div style={{ width: `${volume * 100}%`, height: '100%', backgroundColor: '#fff', borderRadius: '2px' }}></div>
                </div>
            </div>
        </div>
    );
};

export default PlayerBar;
