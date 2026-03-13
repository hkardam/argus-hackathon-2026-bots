import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-heading tracking-tight">GrantFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-muted hover:text-primary transition-colors">Home</Link>
            <a href="#" className="text-sm font-medium text-primary transition-colors">Explore Grants</a>
            <a href="#" className="text-sm font-medium text-muted hover:text-primary transition-colors">About</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-heading transition-colors">
                <User className="h-4 w-4" />
                {user?.name}
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-muted hover:text-heading transition-colors">Log in</Link>
                <Link to="/signup" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-hover transition-colors shadow-sm">Sign up</Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-muted" /> : <Menu className="h-6 w-6 text-muted" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border-subtle px-4 pt-2 pb-4 space-y-1">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-body hover:text-primary hover:bg-primary-light">Home</Link>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-primary bg-primary-light">Explore Grants</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-body hover:text-primary hover:bg-primary-light">About</a>
          <div className="pt-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="w-full text-center px-4 py-2 border border-border-medium rounded-md text-base font-medium text-body bg-surface hover:bg-surface-hover">Dashboard</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="w-full text-center px-4 py-2 border border-border-medium rounded-md text-base font-medium text-body bg-surface hover:bg-surface-hover">Log in</Link>
                <Link to="/signup" className="w-full text-center px-4 py-2 border border-transparent rounded-md text-base font-medium text-white bg-primary hover:bg-primary-hover">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
