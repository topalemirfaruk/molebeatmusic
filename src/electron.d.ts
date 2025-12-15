export interface ElectronAPI {
    onYouTubeCode: (callback: (code: string) => void) => void;
    toggleMiniPlayer: (enabled: boolean) => void;
    checkForUpdates: () => void;
    quitAndInstall: () => void;
    onUpdateStatus: (callback: (status: string) => void) => void;
    onUpdateAvailable: (callback: (info: any) => void) => void;
    onUpdateDownloaded: (callback: (info: any) => void) => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
