import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TrackList from './components/TrackList';
import Albums from './components/Albums';
import Favorites from './components/Favorites';
import Settings from './components/Settings';
import Playlists from './components/Playlists';
import PlaylistDetail from './components/PlaylistDetail';
import LyricsView from './components/LyricsView';
import { PlayerProvider } from './context/PlayerContext';

import Home from './components/Home';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracks" element={<TrackList />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/lyrics" element={<LyricsView />} />
          </Routes>
        </Layout>
      </Router>
    </PlayerProvider>
  );
}

export default App;
