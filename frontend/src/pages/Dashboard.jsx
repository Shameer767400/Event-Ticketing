import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">EventTicket</div>
          <div className="navbar-links">
            <span className="text-muted">Welcome, {user?.name}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-small">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="flex-between mb-2">
          <h1>My Events</h1>
          <Link to="/create-event" className="btn btn-primary">Create Event</Link>
        </div>

        {events.length === 0 ? (
          <div className="card text-center">
            <h3>No events yet</h3>
            <p className="text-muted">Create your first event to get started!</p>
            <Link to="/create-event" className="btn btn-primary mt-1">Create Event</Link>
          </div>
        ) : (
          <div className="grid grid-2">
            {events.map((event) => (
              <div key={event._id} className="card">
                <h3>{event.title}</h3>
                <p className="text-muted">{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
                <p className="text-secondary mt-1">📍 {event.venue}</p>
                <p className="text-secondary">🎫 {event.ticketLimit} tickets</p>
                <div className="flex gap-1 mt-1">
                  <span className={`badge ${event.approvalMode === 'auto' ? 'badge-success' : 'badge-warning'}`}>
                    {event.approvalMode} approval
                  </span>
                </div>
                <div className="flex gap-1 mt-2">
                  <Link to={`/event/${event._id}/manage`} className="btn btn-primary btn-small">
                    Manage Registrations
                  </Link>
                  <Link to={`/event/${event._id}`} className="btn btn-secondary btn-small">
                    View Public Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
