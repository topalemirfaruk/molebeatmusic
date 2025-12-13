import React, { useMemo, useState } from 'react';
import { Search, Disc } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import TrackList from './TrackList';

const Albums: React.FC = () => {
    const { tracks } = usePlayer();
    const [searchTerm, setSearchTerm] = useState('');
    // Store both title and artist for unique identification
    const [selectedAlbum, setSelectedAlbum] = useState<{ title: string, artist: string } | null>(null);

    const albums = useMemo(() => {
        const albumMap = new Map<string, { title: string, artist: string, image: string, count: number }>();

        tracks.forEach(track => {
            const albumName = track.album || 'Unknown Album';
            // Create a unique key combining album name and artist to separate same-named albums by different artists
            const uniqueKey = `${albumName}-${track.artist}`;

            if (!albumMap.has(uniqueKey)) {
                albumMap.set(uniqueKey, {
                    title: albumName,
                    artist: track.artist,
                    image: track.image,
                    count: 1
                });
            } else {
                const album = albumMap.get(uniqueKey)!;
                album.count++;
            }
        });

        return Array.from(albumMap.values());
    }, [tracks]);

    const filteredAlbums = albums.filter(album =>
        album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedAlbum) {
        const albumTracks = tracks.filter(t =>
            (t.album || 'Unknown Album') === selectedAlbum.title &&
            t.artist === selectedAlbum.artist
        );
        const albumInfo = albums.find(a =>
            a.title === selectedAlbum.title &&
            a.artist === selectedAlbum.artist
        );

        return (
            <div className="page-content" style={{ flex: 1, padding: '20px 40px', overflowY: 'auto', height: 'calc(100vh - 90px)' }}>
                <div style={{ marginBottom: '20px', cursor: 'pointer', color: '#aaa', display: 'inline-block' }} onClick={() => setSelectedAlbum(null)}>
                    &larr; Back to Albums
                </div>
                <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', alignItems: 'flex-end' }}>
                    <div style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '12px',
                        backgroundImage: `url(${albumInfo?.image})`,
                        backgroundSize: 'cover',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }} />
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '8px' }}>ALBUM</div>
                        <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '16px', lineHeight: 1 }}>{selectedAlbum.title}</h1>
                        <div style={{ color: '#ccc', fontSize: '14px' }}>
                            {albumInfo?.artist} • {albumInfo?.count} songs
                        </div>
                    </div>
                </div>
                <TrackList tracks={albumTracks} hideAddButton />
            </div>
        );
    }

    return (
        <div className="page-content" style={{ flex: 1, padding: '20px 40px', overflowY: 'auto', height: 'calc(100vh - 90px)' }}>
            {/* Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px', color: '#666' }}>
                <Search size={20} />
                <input
                    type="text"
                    placeholder="Search albums"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        fontSize: '16px',
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        outline: 'none',
                        width: '100%'
                    }}
                />
            </div>

            {/* Grid */}
            {filteredAlbums.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '30px'
                }}>
                    {filteredAlbums.map((album) => (
                        <div
                            key={`${album.title}-${album.artist}`}
                            style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}
                            onClick={() => setSelectedAlbum({ title: album.title, artist: album.artist })}
                        >
                            {/* Album Cover */}
                            <div style={{
                                width: '100%',
                                aspectRatio: '1/1',
                                borderRadius: '20px',
                                backgroundColor: '#333',
                                backgroundImage: `url(${album.image})`,
                                backgroundSize: 'cover',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                transition: 'transform 0.2s',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '10px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--accent-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                    }}>
                                        <Disc size={16} color="#fff" />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div>
                                <div style={{ color: '#fff', fontSize: '15px', fontWeight: 500, marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{album.title}</div>
                                <div style={{ color: '#666', fontSize: '13px' }}>{album.artist}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#666' }}>
                    <Disc size={48} style={{ marginBottom: '20px', opacity: 0.5 }} />
                    <p>No albums found</p>
                </div>
            )}
        </div>
    );
};

export default Albums;
