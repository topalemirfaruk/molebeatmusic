import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    win.webContents.on('will-redirect', (event, url) => {
        if (url.startsWith('http://localhost/callback')) {
            event.preventDefault();
            const code = new URL(url).searchParams.get('code');
            if (code) {
                // Navigate back to the app
                if (process.env.VITE_DEV_SERVER_URL) {
                    win.loadURL(process.env.VITE_DEV_SERVER_URL);
                } else {
                    win.loadFile(path.join(__dirname, '../dist/index.html'));
                }

                // Send code to renderer once loaded
                win.webContents.once('did-finish-load', () => {
                    win.webContents.send('youtube-code', code);
                });
            }
        }
    });

    ipcMain.on('set-mini-player-mode', (event, enabled) => {
        if (enabled) {
            if (win.isMaximized()) {
                win.unmaximize();
            }
            win.setSize(300, 150);
            win.setAlwaysOnTop(true);
        } else {
            win.setSize(1200, 800);
            win.setAlwaysOnTop(false);
            win.center();
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
