import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Mic } from 'lucide-react';
import Visualizer from './Visualizer';

const LyricsView: React.FC = () => {
    const { currentTrack, lyrics, currentLineIndex } = usePlayer();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentLineIndex !== -1 && scrollRef.current) {
            // +1 because of the top spacer
            const activeLine = scrollRef.current.children[currentLineIndex + 1] as HTMLElement;
            if (activeLine) {
                activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentLineIndex]);

    if (!currentTrack) {
        return (
            <div className="page-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a0a0a0' }}>
                <Mic size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                <p>Play a song to see lyrics</p>
            </div>
        );
    }

    return (
        <div className="page-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 90px)', overflow: 'hidden', position: 'relative' }}>
            {/* Background Blur */}
            {/* Background Blur */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundImage: `url(${currentTrack.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(30px) brightness(0.3)',
                zIndex: 0,
                pointerEvents: 'none' // Ensure it doesn't block clicks
            }} />

            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', padding: '40px' }}>
                {/* Header */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '40px' }}>
                    <img
                        src={currentTrack.image}
                        alt={currentTrack.title}
                        style={{ width: '80px', height: '80px', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                    />
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{currentTrack.title}</h1>
                        <p style={{ fontSize: '16px', color: '#ccc' }}>{currentTrack.artist}</p>
                    </div>
                </div>

                {/* Lyrics Container */}
                <div
                    ref={scrollRef}
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        paddingRight: '20px',
                        position: 'relative',
                        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                    }}
                    className="hide-scrollbar"
                >
                    {lyrics.length > 0 ? (
                        <>
                            <div style={{ height: '50vh' }} />
                            {lyrics.map((line, index) => (
                                <p
                                    key={index}
                                    style={{
                                        fontSize: currentLineIndex === index ? '28px' : '20px',
                                        fontWeight: currentLineIndex === index ? 700 : 500,
                                        color: currentLineIndex === index ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                                        marginBottom: '24px',
                                        transition: 'all 0.3s ease',
                                        transform: currentLineIndex === index ? 'scale(1.05)' : 'scale(1)',
                                        transformOrigin: 'left center',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        // Optional: Seek to this line
                                    }}
                                >
                                    {line.text}
                                </p>
                            ))}
                            <div style={{ height: '50vh' }} />
                        </>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>
                            <Mic size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                            <p>No lyrics found for this track</p>
                        </div>
                    )}
                </div>
            </div>
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '300px',
                zIndex: 2,
                pointerEvents: 'none',
                opacity: 0.6
            }}>
                <Visualizer />
            </div>
        </div>
    );
};

export default LyricsView;
