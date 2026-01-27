import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

export default function Ticket() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/registrations/ticket/${ticketId}`);
      setTicket(response.data.registration);
    } catch (err) {
      console.error('Failed to fetch ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container text-center" style={{ marginTop: '4rem' }}>
        <div className="card">
          <h1>Ticket Not Found</h1>
          <p className="text-muted">This ticket ID is invalid or has not been approved yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">EventTicket</div>
        </div>
      </nav>

      <div className="container" style={{ maxWidth: '700px', marginTop: '2rem' }}>
        <div className="text-center mb-2">
          <h1>🎉 Your Ticket</h1>
          <p className="text-muted">Save this page or take a screenshot</p>
        </div>

        <div className="ticket">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="text-center mb-2">
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{ticket.eventId.title}</h2>
              <div className="badge badge-success" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                APPROVED
              </div>
            </div>

            <div className="grid grid-2 mt-2">
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>TICKET HOLDER</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>{ticket.userName}</p>
              </div>
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>TICKET ID</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', fontFamily: 'monospace' }}>
                  {ticket.ticketId}
                </p>
              </div>
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>DATE & TIME</p>
                <p style={{ fontSize: '1.1rem' }}>
                  {new Date(ticket.eventId.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>VENUE</p>
                <p style={{ fontSize: '1.1rem' }}>{ticket.eventId.venue}</p>
              </div>
            </div>

            <div className="mt-2" style={{ 
              borderTop: '1px dashed var(--border)', 
              paddingTop: 'var(--spacing-md)' 
            }}>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>CONTACT</p>
              <p>{ticket.userEmail}</p>
              <p>{ticket.userPhone}</p>
            </div>

            <div className="mt-2 text-center">
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                Issued on {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-2">
          <button onClick={() => window.print()} className="btn btn-primary">
            Print Ticket
          </button>
        </div>
      </div>
    </>
  );
}
