import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function VerifySuccess() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-lg bg-white border border-gray-200 p-10 rounded-3xl shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check size={32} className="text-green-600" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold uppercase tracking-[0.25em]">Verified</h1>
          <p className="text-sm text-gray-600 leading-7">
            Your email address has been successfully verified. You can now access your dashboard and place orders normally.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white transition hover:bg-zinc-900"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-zinc-900 px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-900 transition hover:bg-zinc-100"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
