import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const ROLES = [
  { value: 'APPLICANT', label: 'Applicant', description: 'Apply for grants and track your applications' },
  { value: 'PROGRAM_OFFICER', label: 'Program Officer', description: 'Manage grant programs and review applications' },
  { value: 'REVIEWER', label: 'Reviewer', description: 'Review and evaluate assigned grant applications' },
  { value: 'FINANCE_OFFICER', label: 'Finance Officer', description: 'Oversee financial disbursements and reporting' },
  { value: 'PLATFORM_ADMIN', label: 'Platform Admin', description: 'Full system access and administration' },
];

const ROLE_DASHBOARD: Record<string, string> = {
  APPLICANT: '/dashboard',
  PROGRAM_OFFICER: '/program-officer/dashboard',
  REVIEWER: '/reviewer/dashboard',
  FINANCE_OFFICER: '/finance/dashboard',
  PLATFORM_ADMIN: '/admin/dashboard',
};

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('APPLICANT');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:8086/api/auth/register', { name, email, password, role });
      login(data.token, data.user);
      navigate(ROLE_DASHBOARD[data.user.role] ?? '/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Registration failed';
      setError(typeof msg === 'string' ? msg : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary p-3 rounded-xl mb-4">
            <Leaf className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-heading">Create your account</h1>
          <p className="text-muted mt-1">Start managing your grants today</p>
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl p-8">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-body mb-1.5">Full name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Jane Smith"
                className="w-full px-4 py-2.5 rounded-lg bg-page border border-border-medium text-body placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-body mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-page border border-border-medium text-body placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-body mb-1.5">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-page border border-border-medium text-body focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                {ROLES.map(r => (
                  <option key={r.value} value={r.value}>{r.label} — {r.description}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-body mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-2.5 pr-11 rounded-lg bg-page border border-border-medium text-body placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-muted"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
