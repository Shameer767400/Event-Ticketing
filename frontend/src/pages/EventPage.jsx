import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Registration Flow State
  const [step, setStep] = useState('form'); // 'form', 'otp', 'completed'
  const [otpId, setOtpId] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event);
    } catch (err) {
      console.error('Failed to fetch event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    setFormData({ ...formData, userPhone: value });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequestOTP = async (e) => {
    if (e) e.preventDefault();
    
    // Only validate email here
    if (!formData.userEmail) {
      setMessage({ type: 'error', text: 'Please enter your email first' });
      return;
    }

    setMessage(null);
    setSubmitting(true);

    try {
      const response = await api.post('/registrations/request-otp', {
        eventId: id,
        userEmail: formData.userEmail
      });
      
      setOtpId(response.data.otpId);
      setStep('otp_sent');
      setTimer(600); // 10 minutes
      setMessage({
        type: 'success',
        text: 'OTP code sent to your email.'
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to send OTP'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    // Full validation
    if (formData.userPhone.length < 10 || formData.userPhone.length > 15) {
      setMessage({ type: 'error', text: 'Phone number must be between 10 and 15 digits' });
      setSubmitting(false);
      return;
    }

    if (!otpId || !otpCode) {
      setMessage({ type: 'error', text: 'Please verify your email with OTP' });
      setSubmitting(false);
      return;
    }

    try {
      const response = await api.post('/registrations/verify-otp', {
        otpId,
        otpCode,
        userName: formData.userName,
        userPhone: formData.userPhone
      });
      
      setStep('completed');
      setMessage({
        type: 'success',
        text: response.data.message,
        ticketId: response.data.registration.ticketId
      });
      
      setFormData({ userName: '', userEmail: '', userPhone: '' });
      setOtpCode('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Registration failed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpCode('');
    await handleRequestOTP();
    setTimer(600);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container text-center" style={{ marginTop: '4rem' }}>
        <h1>Event not found</h1>
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

      <div className="container" style={{ maxWidth: '900px', marginTop: '2rem' }}>
        <div className="card">
          <h1>{event.title}</h1>
          <p className="text-muted mb-2">{event.description}</p>
          {/* Event details grid preserved, omitted here for brevity if no changes needed */}
          <div className="grid grid-2 mt-2 mb-2">
            <div>
              <p className="text-secondary"><strong>📅 Date:</strong></p>
              <p>{new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}</p>
            </div>
            <div>
              <p className="text-secondary"><strong>📍 Venue:</strong></p>
              <p>{event.venue}</p>
            </div>
            <div>
              <p className="text-secondary"><strong>🎫 Tickets Available:</strong></p>
              <p>{event.ticketLimit}</p>
            </div>
            <div>
              <p className="text-secondary"><strong>✅ Approval:</strong></p>
              <span className={`badge ${event.approvalMode === 'auto' ? 'badge-success' : 'badge-warning'}`}>
                {event.approvalMode === 'auto' ? 'Instant Approval' : 'Manual Approval'}
              </span>
            </div>
          </div>
        </div>

        <div className="card mt-2">
          <h2>{step === 'completed' ? 'Registration Complete' : 'Register for this Event'}</h2>
          
          {message && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {message.text}
              {message.ticketId && (
                <div className="mt-1">
                  <button onClick={() => navigate(`/ticket/${message.ticketId}`)} className="btn btn-success btn-small">
                    View Your Ticket
                  </button>
                </div>
              )}
            </div>
          )}

          {step !== 'completed' && (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="email"
                    className="form-input"
                    style={{ flex: 1 }}
                    value={formData.userEmail}
                    onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                    required
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleRequestOTP}
                    disabled={!formData.userEmail || submitting || timer > 540}
                  >
                    {timer > 540 ? `Wait ${timer - 540}s` : 'Send OTP'}
                  </button>
                </div>
              </div>

              {step === 'otp_sent' && (
                <div className="form-group" style={{ animation: 'fadeIn 0.5s ease' }}>
                  <label className="form-label">Enter OTP Code</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit code"
                      required
                      style={{ letterSpacing: '2px', width: '150px' }}
                    />
                    <small className="text-muted">
                      Check your email. Expires in {formatTime(timer)}
                    </small>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Phone Number (numbers only)</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.userPhone}
                  onChange={handlePhoneChange}
                  placeholder="1234567890"
                  required
                  minLength={10}
                  maxLength={15}
                  pattern="[0-9]{10,15}"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }} 
                disabled={submitting || !otpId || otpCode.length !== 6}
              >
                {submitting ? 'Registering...' : 'Submit Registration'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
