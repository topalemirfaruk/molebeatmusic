import React from 'react';
import { Search } from 'lucide-react';

const albums = [
    { id: 1, title: 'EMO ERR', artist: 'Moro' },
    { id: 2, title: 'M3a L3echrane', artist: 'Dizzy DROS' },
    { id: 3, title: 'WILI', artist: 'Draganov' },
    { id: 4, title: 'Helma', artist: 'Tagne' },
    { id: 5, title: 'Qui sait ?', artist: 'Niro, ElGrandeToto' },
    { id: 6, title: 'Ojos Sin Ver', artist: 'Morad, ElGrandeToto' },
    { id: 7, title: 'Hiphop is dead', artist: 'Fat Mizzo' },
];

const Albums: React.FC = () => {
    return (
        <div className="page-content" style={{ flex: 1, padding: '20px 40px', overflowY: 'auto', height: 'calc(100vh - 90px)' }}>
            {/* Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px', color: '#666' }}>
                <Search size={20} />
                <span style={{ fontSize: '16px' }}>Search</span>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '30px'
            }}>
                {albums.map((album) => (
                    <div key={album.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}>
                        {/* Album Cover */}
                        <div style={{
                            width: '100%',
                            aspectRatio: '1/1',
                            borderRadius: '20px',
                            backgroundColor: '#333',
                            backgroundImage: `url(https://source.unsplash.com/random/300x300?sig=${album.id + 100})`,
                            backgroundSize: 'cover',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                            transition: 'transform 0.2s',
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />

                        {/* Info */}
                        <div>
                            <div style={{ color: '#fff', fontSize: '15px', fontWeight: 500, marginBottom: '4px' }}>{album.title}</div>
                            <div style={{ color: '#666', fontSize: '13px' }}>{album.artist}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Albums;
