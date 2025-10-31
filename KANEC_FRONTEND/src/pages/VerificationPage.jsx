// src/pages/VerificationPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API_CONFIG, API_BASE_URL } from '../api/config';
import './VerificationPage.css';

const VerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ── State ───────────────────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // useRef **without** TypeScript generic
  const inputRefs = useRef([]);

  // ── Get email (state → sessionStorage) ───────────────────────
  useEffect(() => {
    const fromState = location.state?.email;
    const fromStorage = sessionStorage.getItem('pendingVerificationEmail');

    if (fromState) {
      setEmail(fromState);
      sessionStorage.setItem('pendingVerificationEmail', fromState);
    } else if (fromStorage) {
      setEmail(fromStorage);
    } else {
      navigate('/signin');
    }
  }, [location, navigate]);

  // ── Countdown timer ─────────────────────────────────────────────
  useEffect(() => {
    if (countdown > 0) {
      const id = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [countdown]);

  // ── OTP helpers ─────────────────────────────────────────────────
  const focusNext = idx => {
    if (idx < 5) inputRefs.current[idx + 1]?.focus();
  };
  const focusPrev = idx => {
    if (idx > 0) inputRefs.current[idx - 1]?.focus();
  };

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val) focusNext(idx);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) focusPrev(idx);
  };

  const handlePaste = e => {
    const paste = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  // ── Verify ───────────────────────────────────────────────────────
  const handleVerify = async e => {
    e.preventDefault();
    if (otp.some(d => d === '')) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios({
        method: API_CONFIG.auth.verifyEmail.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.verifyEmail.url}?email=${encodeURIComponent(
          email.trim().toLowerCase()
        )}&otp_code=${otp.join('')}`,
      });

      toast.success('Email verified successfully!');
      sessionStorage.removeItem('pendingVerificationEmail');
      navigate('/signin', {
        state: { message: 'Email verified – you can now sign in.' },
      });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Verification failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Resend ───────────────────────────────────────────────────────
  const handleResend = async () => {
    if (countdown > 0) return;
    setResendLoading(true);
    try {
      await axios({
        method: API_CONFIG.auth.resendVerification.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.resendVerification.url}?email=${encodeURIComponent(
          email.trim().toLowerCase()
        )}`,
      });
      toast.success('Verification code sent!');
      setCountdown(60);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to resend code.';
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  // ── Back ────────────────────────────────────────────────────────
  const handleBack = () => {
    sessionStorage.removeItem('pendingVerificationEmail');
    navigate('/signin');
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="verification-wrapper">
      <div className="verification-container">
        {/* ── Back link ── */}
        <button className="back-to-signin" onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>

        {/* ── Card ── */}
        <div className="verification-card">
          {/* Logo */}
          <div className="verification-logo">
            <img src="/reallogo.png" alt="KANEC IMPACT LEDGER" className="logo-image" />
          </div>

          {/* Header */}
          <div className="verification-header">
            <div className="verification-icon">
              <Mail size={48} color="#22c55e" />
            </div>
            <h1 className="verification-title">Verify Your Email</h1>
            <p className="verification-subtitle">
              We've sent a <strong>6-digit verification code</strong> to
            </p>
            <p className="verification-email">{email}</p>
          </div>

          {/* ── OTP ── */}
          <form onSubmit={handleVerify} className="verification-form">
            <div className="form-group">
              <label className="otp-label">Verification Code</label>
              <div className="otp-inputs" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => (inputRefs.current[i] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(e, i)}
                    className="otp-digit"
                  />
                ))}
              </div>
              <p className="otp-hint">Enter the 6-digit code from your email</p>
            </div>

            <button
              type="submit"
              className="verify-btn"
              disabled={loading || otp.some(d => d === '')}
            >
              {loading ? 'Verifying…' : 'Verify Email'}
            </button>
          </form>

          {/* ── Resend ── */}
          <div className="verification-footer">
            <p>Didn't receive the code?</p>
            <button
              type="button"
              className="resend-otp-link"
              onClick={handleResend}
              disabled={resendLoading || countdown > 0}
            >
              {resendLoading ? (
                'Sending…'
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

          {/* ── Tips ── */}
          <div className="verification-tips">
            <div className="tip">
              <CheckCircle size={16} className="tip-success" />
              <span>Check your <strong>spam/junk</strong> folder</span>
            </div>
            <div className="tip">
              <CheckCircle size={16} className="tip-success" />
              <span>Code expires in <strong>10 minutes</strong></span>
            </div>
            <div className="tip">
              <XCircle size={16} className="tip-error" />
              <span>Make sure you entered the correct email address</span>
            </div>
          </div>
        </div>

        {/* Footer outside card */}
        <p className="verification-footer-text">
          Having trouble? Contact support at{' '}
          <a href="mailto:support@kanec.org">support@kanec.org</a>
        </p>
      </div>
    </div>
  );
};

export default VerificationPage;