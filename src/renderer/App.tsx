import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import './font.css';
import './globals.css';
import ConnectPage from './pages/Connect';
import ChatRoom from './pages/ChatRoom';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConnectPage />} />
        <Route path="/chatroom" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}
