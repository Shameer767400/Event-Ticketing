import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    ticketLimit: '',
    approvalMode: 'auto'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/events', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">EventTicket</div>
          <div className="navbar-links">
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-small">
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: '700px', marginTop: '2rem' }}>
        <div className="card">
          <h1>Create New Event</h1>
          <p className="text-muted mb-2">Fill in the details for your event</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Event Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date & Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Venue</label>
              <input
                type="text"
                className="form-input"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ticket Limit</label>
              <input
                type="number"
                className="form-input"
                value={formData.ticketLimit}
                onChange={(e) => setFormData({ ...formData, ticketLimit: e.target.value })}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Approval Mode</label>
              <select
                className="form-select"
                value={formData.approvalMode}
                onChange={(e) => setFormData({ ...formData, approvalMode: e.target.value })}
              >
                <option value="auto">Auto Approval - Instant tickets</option>
                <option value="manual">Manual Approval - Review each registration</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
