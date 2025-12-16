export interface ElectronAPI {
    onYouTubeCode: (callback: (code: string) => void) => void;
    toggleMiniPlayer: (enabled: boolean) => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
