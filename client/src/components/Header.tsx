import { useState } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">GrantFlow</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Home</Link>
            <Link to="/" className="text-sm font-medium text-emerald-600 transition-colors">Explore Grants</Link>
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">About</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Log in</Link>
            <Link to="/login" className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors shadow-sm">Sign up</Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-4 space-y-1">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50">Home</Link>
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-emerald-600 bg-emerald-50">Explore Grants</Link>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-emerald-50">About</a>
          <div className="pt-4 flex flex-col gap-2">
            <Link to="/login" className="w-full text-center px-4 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50">Log in</Link>
            <Link to="/login" className="w-full text-center px-4 py-2 border border-transparent rounded-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700">Sign up</Link>
          </div>
        </div>
      )}
    </header>
  );
}
