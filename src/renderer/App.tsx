import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import './font.css';
import './globals.css';
import ConnectPage from './pages/Connect';
import ChatRoom from './pages/ChatRoom';
import { SignUp } from './pages/SignUp';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<ConnectPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chatroom" element={<ChatRoom />} />
        </Routes>
      </Router>
    </>
  );
}
