import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export default function SignupPage({ onShowToast }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authService.signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Account Created',
          message: 'Check your email for a verification code.'
        });
      }
      navigate('/verify-email', { replace: true, state: { email: result.email || formData.email } });
    } catch (err) {
      setError(err.message || 'Unable to create account. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex bg-[#fffafc]">
      <div className="max-w-6xl w-full mx-auto my-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 rounded-xs border border-slate-200/90 shadow-2xl bg-white overflow-hidden">
        
        {/* Left: Editorial Fashion Visual */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-gradient-to-br from-purple-950 via-slate-950 to-pink-950 p-12 text-white flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=85&w=1200"
              alt="TakeFashion Style"
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest text-orange-300 rounded-xs mt-6">
              <Sparkles className="w-3 h-3 text-orange-400" />
              Join TakeFashion
            </span>
          </div>

          <div className="relative z-10 space-y-3">
            <h2 className="text-3xl font-black uppercase tracking-tight leading-tight">
              A Modern Fashion Edit,<br />Curated For You.
            </h2>
            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              Unlock personalized size recommendations, early access to new season arrivals, and flat 20% off your initial purchase.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 text-[11px] text-white/60">
            Safe, verified & encrypted session.
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 md:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 mb-1">
                New Member Registration
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                Create Your Account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Join our fashion community in less than a minute.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xs flex items-center gap-2 text-xs text-rose-700 font-bold animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Aanya Verma"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 block mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 block mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 block mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-800 block mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-xs focus:outline-none focus:border-fuchsia-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-0.5 accent-fuchsia-600 w-4 h-4 rounded"
                  />
                  <span>
                    I agree to the TakeFashion <span className="font-bold text-slate-800 underline">Terms of Service</span> and <span className="font-bold text-slate-800 underline">Privacy Policy</span>.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 tf-btn-primary font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xs shadow-md disabled:opacity-50 mt-2"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-xs text-slate-600 pt-3">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-fuchsia-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
