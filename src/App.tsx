import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TrackList from './components/TrackList';
import Albums from './components/Albums';
import Favorites from './components/Favorites';
import Settings from './components/Settings';

import { PlayerProvider } from './context/PlayerContext';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<TrackList />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </PlayerProvider>
  );
}

export default App;
