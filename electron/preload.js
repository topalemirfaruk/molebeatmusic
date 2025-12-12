import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    onYouTubeCode: (callback) => ipcRenderer.on('youtube-code', (_event, code) => callback(code)),
});
