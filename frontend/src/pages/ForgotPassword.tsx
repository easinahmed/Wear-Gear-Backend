import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
            <Mail size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Check Your Email</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            If an account exists with <strong className="text-black">{email}</strong>,
            we've sent a password reset link. Please check your inbox.
          </p>
          <Link to="/login" className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-wider font-bold hover:bg-zinc-900 transition-colors">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Forgot Password</h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest">Enter your email to reset</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs uppercase tracking-wider px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-zinc-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          <Link to="/login" className="inline-flex items-center gap-1 text-black font-bold underline underline-offset-4 hover:no-underline">
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
