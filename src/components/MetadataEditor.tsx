import React, { useState, useRef } from 'react';
import { X, Upload, Save } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface MetadataEditorProps {
    trackId: number;
    initialTitle: string;
    initialArtist: string;
    initialImage: string;
    onClose: () => void;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({ trackId, initialTitle, initialArtist, initialImage, onClose }) => {
    const { updateTrackMetadata } = usePlayer();
    const [title, setTitle] = useState(initialTitle);
    const [artist, setArtist] = useState(initialArtist);
    const [imagePreview, setImagePreview] = useState(initialImage);
    const [imageBlob, setImageBlob] = useState<Blob | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            setImageBlob(file);
        }
    };

    const handleSave = async () => {
        await updateTrackMetadata(trackId, title, artist, imageBlob);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass" style={{
                width: '500px',
                padding: '30px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                backgroundColor: '#2d2b42',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff' }}>Edit Track Info</h2>
                    <X size={24} color="#a0a0a0" style={{ cursor: 'pointer' }} onClick={onClose} />
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    {/* Image Upload */}
                    <div
                        style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '16px',
                            backgroundColor: '#1e1c2e',
                            backgroundImage: `url(${imagePreview})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            cursor: 'pointer',
                            border: '2px dashed rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                        >
                            <Upload size={24} color="#fff" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {/* Inputs */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#a0a0a0', fontSize: '12px', marginBottom: '8px' }}>Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#1e1c2e',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#a0a0a0', fontSize: '12px', marginBottom: '8px' }}>Artist</label>
                            <input
                                type="text"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#1e1c2e',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    style={{
                        backgroundColor: 'var(--accent-color)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '14px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default MetadataEditor;
