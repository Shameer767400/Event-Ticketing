import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventPage from './pages/EventPage';
import ManageRegistrations from './pages/ManageRegistrations';
import Ticket from './pages/Ticket';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/event/:id/manage" element={<ManageRegistrations />} />
        <Route path="/ticket/:ticketId" element={<Ticket />} />
      </Routes>
    </Router>
  );
}

export default App;
