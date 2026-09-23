import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function VerifyEmailPage({ onShowToast }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  async function verify(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.verifyEmail(email.trim().toLowerCase(), otp);
      setSuccess(true);
      onShowToast?.({ type: 'success', title: 'Email verified', message: 'You can now sign in to TakeFashion.' });
      window.setTimeout(() => navigate('/login', { replace: true, state: { email } }), 900);
    } catch (verificationError) { setError(verificationError.message || 'Unable to verify this code.'); }
    finally { setLoading(false); }
  }

  async function resend() {
    setError('');
    try { await authService.resendVerification(email.trim().toLowerCase()); setCooldown(60); onShowToast?.({ type: 'success', title: 'Code sent', message: 'A new verification code was sent.' }); }
    catch (resendError) { setError(resendError.message || 'Unable to resend the code.'); }
  }

  return <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-[#fffafc] p-4"><div className="w-full max-w-md bg-white border border-slate-200 shadow-xl p-7 md:p-10"><div className="w-12 h-12 bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center mb-5"><Mail className="w-6 h-6" /></div><p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600">Account verification</p><h1 className="text-2xl font-black uppercase tracking-tight mt-1">Check your email</h1><p className="text-xs text-slate-500 mt-2">Enter the six-digit code sent to your email address.</p>{error && <div className="mt-5 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</div>}{success ? <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold flex gap-2"><CheckCircle2 className="w-5 h-5" />Email verified. Redirecting to sign in...</div> : <form onSubmit={verify} className="mt-6 space-y-4"><label className="text-xs font-bold">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-1 w-full border border-slate-300 p-3" /></label><label className="text-xs font-bold">Verification code<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} required className="mt-1 w-full border border-slate-300 p-3 text-center tracking-[0.5em] text-lg" /></label><button disabled={loading} className="w-full bg-slate-950 text-white p-3 font-black uppercase text-xs flex items-center justify-center gap-2 disabled:opacity-50">{loading ? 'Verifying...' : 'Verify email'}<ArrowRight className="w-4 h-4" /></button><button type="button" disabled={!email || cooldown > 0} onClick={resend} className="w-full border border-slate-300 p-3 font-black uppercase text-xs flex items-center justify-center gap-2 disabled:opacity-50"><RefreshCw className="w-4 h-4" />{cooldown ? `Resend in ${cooldown}s` : 'Resend code'}</button></form>}<Link to="/login" className="block mt-6 text-center text-xs font-bold text-slate-500 hover:text-fuchsia-600">Return to sign in</Link></div></div>;
}