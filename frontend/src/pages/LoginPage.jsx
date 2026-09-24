import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export default function LoginPage({ onShowToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.login({ email, password });
      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Welcome Back',
          message: `Signed in as ${user.name}`
        });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestContinue = () => {
    if (onShowToast) {
      onShowToast({
        type: 'info',
        title: 'Guest Browsing',
        message: 'Continuing as guest. You can register anytime.'
      });
    }
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex bg-[#fffafc]">
      <div className="max-w-6xl w-full mx-auto my-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 rounded-xs border border-slate-200/90 shadow-2xl bg-white overflow-hidden">
        
        {/* Left: Editorial Fashion Visual */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-gradient-to-br from-slate-950 via-purple-950 to-fuchsia-950 p-12 text-white flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-45 mix-blend-overlay pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=85&w=1200"
              alt="TakeFashion Editorial"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            <Link to="/">
              <img
                src="/takefashion-logo.png"
                alt="TakeFashion"
                className="h-10 w-auto bg-white p-1 rounded-xs"
              />
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-fuchsia-200 rounded-xs mt-6">
              <Sparkles className="w-3 h-3 text-orange-400" />
              Member Exclusives
            </span>
          </div>

          <div className="relative z-10 space-y-3">
            <h2 className="text-3xl font-black uppercase tracking-tight leading-tight">
              Curated Style.<br />Personalized Access.
            </h2>
            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              Sign in to save your wishlist, track real-time orders, manage addresses, and unlock private seasonal drops.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 text-[11px] text-white/60">
            © 2026 TAKEFASHION Atelier. Designed in India.
          </div>
        </div>

        {/* Right: Sign In Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 mb-1">
                TakeFashion Account
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                Welcome Back
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials to access your fashion dashboard.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xs flex items-center gap-2 text-xs text-rose-700 font-bold animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 block mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (onShowToast) {
                        onShowToast({
                          type: 'info',
                          title: 'Password Reset',
                          message: 'Password reset link simulated. Check your inbox.'
                        });
                      }
                    }}
                    className="text-[11px] font-bold text-fuchsia-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 tf-btn-primary font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xs shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    Sign In to Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Or
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGuestContinue}
              className="w-full py-2.5 border border-slate-200 hover:border-slate-400 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xs transition bg-white"
            >
              Continue as Guest
            </button>

            <p className="text-center text-xs text-slate-600 pt-2">
              Don't have an account yet?{' '}
              <Link to="/signup" className="font-black text-fuchsia-700 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
