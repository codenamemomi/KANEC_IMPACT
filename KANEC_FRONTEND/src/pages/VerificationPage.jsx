import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API_CONFIG, API_BASE_URL } from '../api/config';
import './VerificationPage.css';

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Get email from location state or sessionStorage
  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromStorage = sessionStorage.getItem('pendingVerificationEmail');
    
    if (emailFromState) {
      setEmail(emailFromState);
      sessionStorage.setItem('pendingVerificationEmail', emailFromState);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // No email found, redirect to signin
      navigate('/signin');
    }
  }, [location, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }

    setLoading(true);

    try {
      // Use query parameters for the POST request
      const { data } = await axios({
        method: API_CONFIG.auth.verifyEmail.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.verifyEmail.url}?email=${encodeURIComponent(email.trim().toLowerCase())}&otp_code=${otp}`,
      });

      console.log('Verification successful:', data);
      toast.success('Email verified successfully!');
      
      // Clear pending verification
      sessionStorage.removeItem('pendingVerificationEmail');
      
      // Redirect to signin
      navigate('/signin', { 
        state: { message: 'Email verified successfully! You can now sign in.' }
      });
    } catch (err) {
      console.error('Verification failed:', err);
      console.error('Error details:', err.response?.data);
      
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setResendLoading(true);

    try {
      // Use query parameters for resend as well
      await axios({
        method: API_CONFIG.auth.resendVerification.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.resendVerification.url}?email=${encodeURIComponent(email.trim().toLowerCase())}`,
      });

      toast.success('Verification code sent!');
      setCountdown(60); // 60 seconds countdown
    } catch (err) {
      console.error('Resend failed:', err);
      console.error('Error details:', err.response?.data);
      
      const msg = err.response?.data?.detail || err.response?.data?.message || 'Failed to resend code. Please try again.';
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    sessionStorage.removeItem('pendingVerificationEmail');
    navigate('/signin');
  };

  return (
    <div className="verification-wrapper">
      <div className="verification-container">
        <button
          className="back-to-signin"
          type="button"
          onClick={handleBackToSignIn}
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>

        <div className="verification-card">
          <div className="verification-logo">
            <img src="/reallogo.png" alt="KANEC IMPACT LEDGER" className="logo-image" />
          </div>

          <div className="verification-header">
            <div className="verification-icon">
              <Mail size={48} color="#22c55e" />
            </div>
            <h1 className="verification-title">Verify Your Email</h1>
            <p className="verification-subtitle">
              We've sent a 6-digit verification code to<br />
              <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify} className="verification-form">
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
                className="otp-input"
              />
              <div className="otp-hint">Enter the 6-digit code from your email</div>
            </div>

            <button 
              type="submit" 
              className="verify-btn" 
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="verification-footer">
            <p>Didn't receive the code?</p>
            <button
              type="button"
              className="resend-btn"
              onClick={handleResendCode}
              disabled={resendLoading || countdown > 0}
            >
              {resendLoading ? (
                'Sending...'
              ) : countdown > 0 ? (
                <>
                  <Clock size={14} />
                  Resend in {countdown}s
                </>
              ) : (
                'Resend Verification Code'
              )}
            </button>
          </div>

          <div className="verification-tips">
            <div className="tip">
              <CheckCircle size={16} color="#22c55e" />
              <span>Check your spam folder if you don't see the email</span>
            </div>
            <div className="tip">
              <CheckCircle size={16} color="#22c55e" />
              <span>The code will expire after 10 minutes</span>
            </div>
            <div className="tip">
              <XCircle size={16} color="#ef4444" />
              <span>Make sure you entered the correct email address</span>
            </div>
          </div>
        </div>

        <p className="verification-footer-text">
          Having trouble? Contact support at support@kanec.org
        </p>
      </div>
    </div>
  );
};

export default VerificationPage;