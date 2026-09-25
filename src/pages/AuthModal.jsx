import React, { useState } from 'react';
import {
  X, Lock, Mail, User, Sparkles, Shield, ArrowRight, AlertCircle,
  CheckCircle2, KeyRound, ArrowLeft, Eye, EyeOff, Check, RefreshCw
} from 'lucide-react';
import { useSite } from '../cms/SiteContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const { login } = useSite();
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot' | 'verify_reset' | 'reset_success'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Password Reset Specific State
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  // Regular Sign In & Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed. Please check credentials.');
      } else {
        login(data.user, data.token);
        onSuccess && onSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Request Password Reset Code
  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError('Please enter your account email address.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Could not initiate password reset.');
      } else {
        setDemoCode(data.demoCode || '');
        setSuccessMessage(data.message || 'Verification code sent to your email.');
        setMode('verify_reset');
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code and Set New Password
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!resetCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail.trim(),
          code: resetCode.trim(),
          newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password. Please check the code.');
      } else {
        setSuccessMessage('Password reset successfully!');
        setMode('reset_success');
        if (data.user && data.token) {
          // Auto login after brief delay
          setTimeout(() => {
            login(data.user, data.token);
            onSuccess && onSuccess(data.user);
            onClose();
          }, 1800);
        }
      }
    } catch (err) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setMode('login');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ==================================================================== */}
        {/* VIEW 1: SIGN IN & REGISTER MODES */}
        {/* ==================================================================== */}
        {(mode === 'login' || mode === 'register') && (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/30">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {mode === 'login' ? 'Sign in to Vansh PDF' : 'Create Your Account'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Access your AES-256 cloud document vault and high-speed tools.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  mode === 'register' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Register Free
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-700">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        setMode('forgot');
                        setError(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{loading ? 'Processing...' : mode === 'login' ? 'Sign In Now' : 'Create Free Account'}</span>
              </button>
            </form>

            {/* Demo Fast Access Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
              <p className="text-[11px] text-gray-400 text-center font-medium">
                Quick Pre-seeded Demo Accounts:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@vanshpdf.com', 'admin123')}
                  className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold text-center cursor-pointer transition"
                >
                  👑 Demo Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('alexwatson0786@gmail.com', 'alexnewpassword123')}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-[11px] font-bold text-center cursor-pointer transition"
                >
                  ⭐ Demo User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 2: FORGOT PASSWORD - STEP 1 (REQUEST OTP) */}
        {/* ==================================================================== */}
        {mode === 'forgot' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-500/30">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Reset Password
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Enter your account email and we'll send you a 6-digit security code to reset your password.
              </p>
            </div>

            <form onSubmit={handleRequestResetCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{loading ? 'Sending Code...' : 'Send Verification Code'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 3: VERIFY CODE & SET NEW PASSWORD - STEP 2 */}
        {/* ==================================================================== */}
        {mode === 'verify_reset' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-indigo-500/30">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Verify & Set Password
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                We sent a 6-digit code to <strong className="text-gray-900">{resetEmail}</strong>
              </p>
            </div>

            {/* Sandbox / Development Code Display Helper */}
            {demoCode && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Dev Test Code: <strong className="font-mono text-sm tracking-widest">{demoCode}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setResetCode(demoCode)}
                  className="px-2 py-1 bg-amber-200 hover:bg-amber-300 rounded-lg text-[10px] font-bold cursor-pointer transition"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full py-2.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-lg font-mono font-bold tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  New Password (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{loading ? 'Updating Password...' : 'Set New Password & Sign In'}</span>
                {!loading && <Check className="w-4 h-4" />}
              </button>
            </form>

            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleRequestResetCode}
                className="text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-gray-500 hover:text-gray-800 font-semibold cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 4: RESET SUCCESS CONFIRMATION */}
        {/* ==================================================================== */}
        {mode === 'reset_success' && (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Password Changed!
            </h3>
            <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
              Your account password has been successfully updated. Securely logging you into your document vault now...
            </p>
            <div className="pt-2">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
