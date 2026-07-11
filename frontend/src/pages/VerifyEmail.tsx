import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Check, X, Loader } from 'lucide-react';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }
    api.get<{ message: string }>(`/auth/verify/${token}`)
      .then(res => {
        setStatus('success');
        setMessage(res.message);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Verification failed');
      });
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {status === 'loading' && (
          <div className="space-y-4">
            <Loader size={40} className="animate-spin mx-auto text-gray-400" />
            <p className="text-sm uppercase tracking-wider text-gray-500">Verifying your email...</p>
          </div>
        )}
        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">Email Verified</h1>
            <p className="text-gray-500 text-sm">{message}</p>
            <Link to="/dashboard" className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-wider font-bold hover:bg-zinc-900 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <X size={32} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">Verification Failed</h1>
            <p className="text-gray-500 text-sm">{message}</p>
            <Link to="/" className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-wider font-bold hover:bg-zinc-900 transition-colors">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
