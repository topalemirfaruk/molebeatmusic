// @ts-ignore
import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';

export interface AudioMetadata {
    title?: string;
    artist?: string;
    album?: string;
    pictureBlob?: Blob;
}

export const extractMetadata = (file: File): Promise<AudioMetadata> => {
    return new Promise((resolve) => {
        jsmediatags.read(file, {
            onSuccess: (tag: any) => {
                const { title, artist, album, picture } = tag.tags;
                let pictureBlob: Blob | undefined;

                if (picture) {
                    const { data, format } = picture;
                    const byteArray = new Uint8Array(data);
                    pictureBlob = new Blob([byteArray], { type: format });
                }

                resolve({ title, artist, album, pictureBlob });
            },
            onError: (error: any) => {
                console.warn("Error reading tags:", error);
                resolve({});
            }
        });
    });
};
