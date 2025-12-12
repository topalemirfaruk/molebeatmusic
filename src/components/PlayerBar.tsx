import React from 'react';
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Volume2, Volume1, VolumeX, MessageSquareQuote, PictureInPicture } from 'lucide-react';
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
        formatTime,
        isMiniPlayer,
        toggleMiniPlayerMode
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

    if (isMiniPlayer) {
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
            }}>
                {/* Background Image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${currentTrack.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                }} />

                {/* Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    zIndex: 1
                }} />

                {/* Controls Overlay */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    padding: '10px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                }}>
                    {/* Top Bar with Exit Button */}
                    <div style={{ position: 'absolute', top: '-100px', right: '10px', zIndex: 10 }}>
                        <PictureInPicture
                            size={20}
                            color="#fff"
                            style={{ cursor: 'pointer', opacity: 0.8 }}
                            onClick={toggleMiniPlayerMode}
                        />
                    </div>

                    <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentTrack.title}
                    </div>
                    <div style={{ color: '#ccc', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentTrack.artist}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '5px' }}>
                        <SkipBack size={20} color="#fff" style={{ cursor: 'pointer' }} />
                        <div
                            onClick={togglePlay}
                            style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            {isPlaying ?
                                <Pause size={18} fill="#000" color="#000" /> :
                                <Play size={18} fill="#000" color="#000" style={{ marginLeft: '2px' }} />
                            }
                        </div>
                        <SkipForward size={20} color="#fff" style={{ cursor: 'pointer' }} />
                    </div>

                    {/* Restore Button (Overlay on top right) */}
                    <div style={{ position: 'absolute', top: '-120px', right: '10px' }}>
                        <PictureInPicture
                            size={16}
                            color="#fff"
                            style={{ cursor: 'pointer', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                            onClick={toggleMiniPlayerMode}
                        />
                    </div>
                </div>
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
                <PictureInPicture
                    size={20}
                    color="#fff"
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                    onClick={toggleMiniPlayerMode}
                />
                <MessageSquareQuote
                    size={20}
                    color="#fff"
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                    onClick={() => window.location.hash = '#/lyrics'}
                />
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
