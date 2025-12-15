import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    onYouTubeCode: (callback) => ipcRenderer.on('youtube-code', (_event, code) => callback(code)),
    toggleMiniPlayer: (enabled) => ipcRenderer.send('set-mini-player-mode', enabled),
    checkForUpdates: () => ipcRenderer.send('check-for-updates'),
    quitAndInstall: () => ipcRenderer.send('quit-and-install'),
    onUpdateStatus: (callback) => ipcRenderer.on('update-status', (_event, status) => callback(status)),
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (_event, info) => callback(info)),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', (_event, info) => callback(info)),
});
