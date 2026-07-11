import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-8xl md:text-9xl font-black text-black">404</h1>
        <p className="text-sm uppercase tracking-[0.3em] font-bold text-gray-500">Page Not Found</p>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-wider font-bold hover:bg-zinc-900 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
