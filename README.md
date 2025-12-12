# MoleBeat Music 🎵

MoleBeat Music is a modern, desktop music player built with Electron, React, and TypeScript. It offers a sleek, dark-themed interface for managing and playing your local music library.

<img src="public/logo.svg" alt="MoleBeat Music Logo" width="120" height="120" />

## ✨ Features

*   **Local Library Management:** Easily add music from your computer.
*   **Favorites System:** Mark your top tracks and access them quickly.
*   **Smart Metadata:** Automatically extracts album art, artist, and title from your audio files.
*   **Persistent Storage:** Your library and favorites are saved automatically using IndexedDB.
*   **Custom Audio Controls:**
    *   Global Volume Control
    *   Playback Speed Adjustment (0.5x - 2.0x)
    *   Seek Bar & Time Display
*   **Modern UI:** A clean, dark-themed aesthetic built with custom CSS and Lucide icons.
*   **Track Options:** Rename or delete tracks directly from the list.
*   **Mini Player Mode:** Keep your music on top with a compact, Picture-in-Picture style player.
*   **Theme Engine:** Customize the look with 6 different accent colors (Pink, Blue, Green, Purple, Orange, Cyan).
*   **Drag & Drop Support:** Simply drag music files into the app to add them to your library.
*   **Playlists:** Create, manage, and organize your favorite tracks into playlists.
*   **Synced Lyrics:** View synchronized lyrics for your tracks (LRC support).
*   **Storage Insights:** View real-time storage usage of your library in Settings.

## 🛠️ Tech Stack

*   **Core:** [Electron](https://www.electronjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** Vanilla CSS (Custom Design System)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Data Persistence:** [idb](https://github.com/jakearchibald/idb) (IndexedDB wrapper)
*   **Metadata:** [jsmediatags](https://github.com/aadsm/jsmediatags)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v16 or higher)
*   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/topalemirfaruk/molebeatmusic.git
    cd molebeatmusic
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the application (Development):
    ```bash
    npm run electron
    ```

4.  Build for Production:
    ```bash
    npm run build
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
