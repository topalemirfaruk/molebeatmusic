const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onYouTubeCode: (callback) => ipcRenderer.on('youtube-code', (_event, code) => callback(code)),
    toggleMiniPlayer: (enabled) => ipcRenderer.send('set-mini-player-mode', enabled),
});
