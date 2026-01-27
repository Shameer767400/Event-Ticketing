import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">EventTicket</div>
          <div className="navbar-links">
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-small">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="container text-center" style={{ marginTop: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Create & Manage Events
          <br />
          <span style={{ 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Effortlessly
          </span>
        </h1>
        
        <p className="text-secondary" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          The modern platform for event organizers to create events, manage registrations, 
          and issue tickets with auto or manual approval.
        </p>

        <div className="flex-center gap-2">
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Start Organizing
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Sign In
          </Link>
        </div>

        <div className="grid grid-2 mt-2" style={{ maxWidth: '900px', margin: '3rem auto 0' }}>
          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
            <h3>Easy Event Creation</h3>
            <p className="text-muted">
              Create events in minutes with our intuitive form. Set ticket limits and choose approval modes.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <h3>Auto or Manual Approval</h3>
            <p className="text-muted">
              Choose instant ticket generation or manually review each registration before approval.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3>Registration Management</h3>
            <p className="text-muted">
              View all registrations, approve or reject attendees, and track ticket distribution.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h3>Beautiful Tickets</h3>
            <p className="text-muted">
              Attendees receive stunning digital tickets with all event details and unique ticket IDs.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
