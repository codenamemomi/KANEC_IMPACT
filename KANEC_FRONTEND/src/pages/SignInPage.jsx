import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API_CONFIG, API_BASE_URL } from '../api/config';
import { useAuth } from '../contexts/AuthContext'; // Add this import
import './SignInPage.css';

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Add this hook

  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear session if no token
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const isAuth = sessionStorage.getItem('isAuthenticated');
    if (!token || !isAuth) sessionStorage.clear();
    console.log('Session check:', { token: !!token, isAuth: !!isAuth });
  }, []);

  // Add bearer token to all requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const token = sessionStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    console.log('Axios interceptor added');
    return () => {
      axios.interceptors.request.eject(interceptor);
      console.log('Axios interceptor removed');
    };
  }, []);

  // Password validation effect
  useEffect(() => {
    if (!isSignIn && password) {
      const validation = {
        minLength: password.length >= 6,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      };
      setPasswordValidation(validation);
      console.log('Password validation:', validation);
    }
  }, [password, isSignIn]);

  const validateSignup = () => {
    console.log('Validating signup form...');
    console.log('Form data:', { name: name.trim(), email, passwordLength: password.length });

    if (!name.trim()) {
      console.log('Validation failed: Full name is required');
      return 'Full name is required';
    }
    if (!email.includes('@')) {
      console.log('Validation failed: Invalid email format');
      return 'Enter a valid email address';
    }
    if (password.length < 6) {
      console.log('Validation failed: Password must be at least 6 characters');
      return 'Password must be at least 6 characters long';
    }

    console.log('All validations passed');
    return null;
  };

  const getPasswordStrength = () => {
    const validations = Object.values(passwordValidation);
    const passedCount = validations.filter(Boolean).length;
    const totalCount = validations.length;

    if (passedCount === totalCount) return { strength: 'strong', color: '#10b981', percentage: 100 };
    if (passedCount >= 3) return { strength: 'good', color: '#f59e0b', percentage: 70 };
    if (passedCount >= 2) return { strength: 'fair', color: '#f59e0b', percentage: 50 };
    return { strength: 'weak', color: '#ef4444', percentage: 30 };
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className="password-requirement">
      {met ? (
        <CheckCircle size={16} color="#10b981" />
      ) : (
        <XCircle size={16} color="#ef4444" />
      )}
      <span style={{ color: met ? '#10b981' : '#ef4444', fontSize: '14px' }}>
        {text}
      </span>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted - Mode:', isSignIn ? 'SIGN IN' : 'SIGN UP');
    console.log('Form data:', { email, name, passwordLength: password.length, role });

    setLoading(true);

    try {
      if (isSignIn) {
        // SIGN IN
        console.log('Starting sign in process...');
        const { data } = await axios({
          method: API_CONFIG.auth.login.method,
          url: `${API_BASE_URL}${API_CONFIG.auth.login.url}`,
          data: {
            email: email.trim().toLowerCase(),
            password,
          },
          headers: { 'Content-Type': 'application/json' },
        });

        console.log('Sign in successful - Response:', data);
        
        // In the handleSubmit function, after successful login:
        console.log('Sign in successful - Response:', data);

        // Use AuthContext login instead of direct sessionStorage
        login(data.user, data.access_token);
        toast.success('Signed in successfully!');

        // Check for redirect path in localStorage first, then sessionStorage
        const redirect = localStorage.getItem('redirectAfterLogin') || sessionStorage.getItem('redirectAfterLogin');
        console.log('Redirect path found:', redirect);

        // Clear redirect from both storages
        localStorage.removeItem('redirectAfterLogin');
        sessionStorage.removeItem('redirectAfterLogin');

        // Determine where to redirect
        let redirectTo = '/dashboard';
        if (redirect && !['/signin', '/signup', '/verify-email'].includes(redirect)) {
          redirectTo = redirect;
        }

        console.log('Redirecting to:', redirectTo);
        navigate(redirectTo, { replace: true });
      } else {
        // SIGN UP
        console.log('Starting sign up process...');
        const error = validateSignup();
        if (error) {
          console.log('Signup validation failed:', error);
          toast.error(error);
          setLoading(false);
          return;
        }

        console.log('Making signup API request...');
        console.log('API Config:', API_CONFIG.auth.register);
        console.log('Full URL:', `${API_BASE_URL}${API_CONFIG.auth.register.url}`);

        const { data } = await axios({
          method: API_CONFIG.auth.register.method,
          url: `${API_BASE_URL}${API_CONFIG.auth.register.url}`,
          data: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
          },
          headers: { 'Content-Type': 'application/json' },
        });

        console.log('Signup API response:', data);

        if (data?.message?.toLowerCase().includes('success')) {
          console.log('Account created successfully with success message');
          toast.success('Account created successfully! Please verify your email.');
          
          // Redirect to verification page with email
          navigate('/verify-email', { 
            state: { email: email.trim().toLowerCase() } 
          });
          
          // Clear form
          setName('');
          setEmail('');
          setPassword('');
          setRole('donor');
          setShowPassword(false);
          setPasswordValidation({
            minLength: false,
            hasUppercase: false,
            hasLowercase: false,
            hasNumber: false,
            hasSpecialChar: false,
          });
        } else {
          console.log('Account created with generic message');
          toast.success('Account created! Check your email for verification.');
          
          // Redirect to verification page with email
          navigate('/verify-email', { 
            state: { email: email.trim().toLowerCase() } 
          });
          
          setIsSignIn(true);
        }
      }
    } catch (err) {
      console.error('API Error occurred:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);

      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors)[0][0]
          : 'Invalid email or password. Please try again.');

      console.log('Displaying error to user:', msg);
      toast.error(msg); // This will now show every time
    } finally {
      console.log('Form submission finished');
      setLoading(false);
    }
  };

  // Forgot password logic
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (forgotPasswordStep === 1) {
        await axios({
          method: API_CONFIG.auth.forgotPassword.method,
          url: `${API_BASE_URL}${API_CONFIG.auth.forgotPassword.url}`,
          data: { email },
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('OTP sent to your email!');
        setForgotPasswordStep(2);
      } else if (forgotPasswordStep === 2) {
        await axios({
          method: API_CONFIG.auth.verifyEmail.method,
          url: `${API_BASE_URL}${API_CONFIG.auth.verifyEmail.url}`,
          data: { email, otp },
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('OTP verified!');
        setForgotPasswordStep(3);
      } else if (forgotPasswordStep === 3) {
        if (newPassword !== confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        if (newPassword.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        await axios({
          method: API_CONFIG.auth.resetPassword.method,
          url: `${API_BASE_URL}${API_CONFIG.auth.resetPassword.url}`,
          data: { email, otp, new_password: newPassword },
          headers: { 'Content-Type': 'application/json' },
        });

        toast.success('Password reset successful. Please sign in.');
        setShowForgotPassword(false);
        setIsSignIn(true);
        setForgotPasswordStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors)[0][0]
          : 'Operation failed. Please try again.');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const backToSignIn = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <button
          className="back-to-home"
          type="button"
          onClick={() => (showForgotPassword ? backToSignIn() : navigate('/'))}
        >
          <ArrowLeft size={16} />
          <span>{showForgotPassword ? 'Back to Sign In' : 'Back to Home'}</span>
        </button>

        <div className="auth-card">
          <div className="auth-logo">
            <img src="/reallogo.png" alt="KANEC IMPACT LEDGER" className="logo-image" />
          </div>

          {/* Forgot Password */}
          {showForgotPassword ? (
            <>
              <h1 className="auth-title">
                {forgotPasswordStep === 1 && 'Reset Your Password'}
                {forgotPasswordStep === 2 && 'Enter Verification Code'}
                {forgotPasswordStep === 3 && 'Create New Password'}
              </h1>

              <form onSubmit={handleForgotPassword} className="auth-form">
                {forgotPasswordStep === 1 && (
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                )}

                {forgotPasswordStep === 2 && (
                  <>
                    <div className="form-group">
                      <label>Verification Code</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div className="forgot-password-actions">
                      <button type="button" onClick={() => setForgotPasswordStep(1)}>Back</button>
                      <button type="button" onClick={() => toast.success('New OTP sent!')}>
                        Resend
                      </button>
                    </div>
                  </>
                )}

                {forgotPasswordStep === 3 && (
                  <>
                    <div className="form-group">
                      <label>New Password</label>
                      <div className="password-field">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {newPassword && (
                        <div style={{ fontSize: '12px', color: newPassword.length >= 6 ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                          {newPassword.length >= 6 ? 'Password length OK' : 'Password must be at least 6 characters'}
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Confirm Password</label>
                      <div className="password-field">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {confirmPassword && (
                        <div style={{ fontSize: '12px', color: newPassword === confirmPassword ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                          {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => setForgotPasswordStep(2)}>Back</button>
                  </>
                )}

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading
                    ? 'Processing...'
                    : forgotPasswordStep === 1
                    ? 'Send Code'
                    : forgotPasswordStep === 2
                    ? 'Verify'
                    : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            // Sign In / Sign Up
            <>
              <h1 className="auth-title">Welcome to Kanec</h1>
              <p className="auth-subtitle">Transparent, blockchain-powered donations</p>

              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${isSignIn ? 'active' : ''}`}
                  onClick={() => setIsSignIn(true)}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab ${!isSignIn ? 'active' : ''}`}
                  onClick={() => setIsSignIn(false)}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {!isSignIn && (
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="password-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="show-pass-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Password Strength Indicator for Sign Up */}
                  {!isSignIn && password && (
                    <div className="password-strength-indicator">
                      <div className="password-strength-bar">
                        <div
                          className="password-strength-progress"
                          style={{
                            width: `${passwordStrength.percentage}%`,
                            backgroundColor: passwordStrength.color
                          }}
                        />
                      </div>
                      <div className="password-strength-text">
                        Password strength: <span style={{ color: passwordStrength.color }}>
                          {passwordStrength.strength}
                        </span>
                      </div>

                      <div className="password-requirements">
                        <PasswordRequirement met={passwordValidation.minLength} text="At least 6 characters" />
                        <PasswordRequirement met={passwordValidation.hasUppercase} text="One uppercase letter (A-Z)" />
                        <PasswordRequirement met={passwordValidation.hasLowercase} text="One lowercase letter (a-z)" />
                        <PasswordRequirement met={passwordValidation.hasNumber} text="One number (0-9)" />
                        <PasswordRequirement met={passwordValidation.hasSpecialChar} text="One special character (!@#$% etc.)" />
                      </div>
                    </div>
                  )}

                  {/* Simple length warning for Sign In */}
                  {isSignIn && password && password.length < 6 && (
                    <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                      Warning: Password must be at least 6 characters
                    </div>
                  )}
                </div>

                {!isSignIn && (
                  <div className="form-group">
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="donor">Donor</option>
                    </select>
                  </div>
                )}

                {isSignIn && (
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot your password?
                  </button>
                )}

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Sign Up'}
                </button>

                <p className="auth-terms">
                  By continuing you agree to our{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Privacy Policy
                  </a>
                </p>
              </form>
            </>
          )}
        </div>

        <p className="auth-footer">
          Powered by blockchain technology for maximum transparency
        </p>
      </div>
    </div>
  );
};

export default SignInPage;