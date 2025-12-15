import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { autoUpdater } from 'electron-updater';

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

    // Auto Updater Logic
    autoUpdater.on('checking-for-update', () => {
        win.webContents.send('update-status', 'Checking for update...');
    });
    autoUpdater.on('update-available', (info) => {
        win.webContents.send('update-status', 'Update available.');
        win.webContents.send('update-available', info);
    });
    autoUpdater.on('update-not-available', (info) => {
        win.webContents.send('update-status', 'Update not available.');
    });
    autoUpdater.on('error', (err) => {
        win.webContents.send('update-status', 'Error in auto-updater. ' + err);
    });
    autoUpdater.on('download-progress', (progressObj) => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond;
        log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
        log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
        win.webContents.send('update-status', log_message);
    });
    autoUpdater.on('update-downloaded', (info) => {
        win.webContents.send('update-status', 'Update downloaded');
        win.webContents.send('update-downloaded', info);
    });
}

ipcMain.on('check-for-updates', () => {
    autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('quit-and-install', () => {
    autoUpdater.quitAndInstall();
});

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
