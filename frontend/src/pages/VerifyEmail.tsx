import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Check, X, Loader } from 'lucide-react';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    api.get<{ message: string }>(`/auth/verify/${token}`)
      .then(async res => {
        await refreshUser();
        navigate('/verify-success', { replace: true });
      })
      .catch(err => {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Verification failed');
      });
  }, [token, refreshUser, navigate]);

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
            <p className="text-xs text-gray-400">Redirecting to verification success page...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <X size={32} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold uppercase tracking-tight">Verification Failed</h1>
            <p className="text-gray-500 text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
