import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function ManageRegistrations() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [eventRes, regRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/registrations`)
      ]);
      setEvent(eventRes.data.event);
      setRegistrations(regRes.data.registrations);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId) => {
    try {
      await api.put(`/registrations/${registrationId}/approve`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve registration');
    }
  };

  const handleReject = async (registrationId) => {
    try {
      await api.put(`/registrations/${registrationId}/reject`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject registration');
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

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

      <div className="container" style={{ marginTop: '2rem' }}>
        <h1>Manage Registrations</h1>
        {event && (
          <div className="card mb-2">
            <h2>{event.title}</h2>
            <p className="text-muted">{new Date(event.date).toLocaleDateString()}</p>
            <div className="flex gap-1 mt-1">
              <span className="badge badge-success">{approvedCount} Approved</span>
              <span className="badge badge-warning">{pendingCount} Pending</span>
              <span className="badge badge-error">{rejectedCount} Rejected</span>
            </div>
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="card text-center">
            <h3>No registrations yet</h3>
            <p className="text-muted">Share your event link to get registrations!</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {registrations.map((reg) => (
              <div key={reg._id} className="card">
                <div className="flex-between mb-1">
                  <h3>{reg.userName}</h3>
                  <span className={`badge ${
                    reg.status === 'approved' ? 'badge-success' :
                    reg.status === 'pending' ? 'badge-warning' :
                    'badge-error'
                  }`}>
                    {reg.status}
                  </span>
                </div>
                <p className="text-secondary">📧 {reg.userEmail}</p>
                <p className="text-secondary">📱 {reg.userPhone}</p>
                {reg.ticketId && (
                  <p className="text-secondary mt-1">🎫 {reg.ticketId}</p>
                )}
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                  Registered: {new Date(reg.createdAt).toLocaleString()}
                </p>

                {reg.status === 'pending' && (
                  <div className="flex gap-1 mt-2">
                    <button 
                      onClick={() => handleApprove(reg._id)}
                      className="btn btn-success btn-small"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(reg._id)}
                      className="btn btn-error btn-small"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
