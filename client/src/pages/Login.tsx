import { Link } from 'react-router-dom';
import { User, Briefcase, CheckSquare, DollarSign, Settings, ArrowRight, Leaf } from 'lucide-react';

export default function Login() {
  const roles = [
    {
      id: 'applicant',
      title: 'Applicant',
      description: 'NGOs, Trusts, and Institutions applying for grants.',
      icon: User,
      path: '/applicant',
      color: 'bg-emerald-100 text-emerald-700',
      hover: 'hover:border-emerald-500 hover:shadow-emerald-100',
    },
    {
      id: 'officer',
      title: 'Program Officer',
      description: 'Manage grant lifecycle, screening, and awards.',
      icon: Briefcase,
      path: '/officer',
      color: 'bg-blue-100 text-blue-700',
      hover: 'hover:border-blue-500 hover:shadow-blue-100',
    },
    {
      id: 'reviewer',
      title: 'Grant Reviewer',
      description: 'Evaluate and score assigned applications.',
      icon: CheckSquare,
      path: '/reviewer',
      color: 'bg-purple-100 text-purple-700',
      hover: 'hover:border-purple-500 hover:shadow-purple-100',
    },
    {
      id: 'finance',
      title: 'Finance Officer',
      description: 'Manage disbursements and track fund utilisation.',
      icon: DollarSign,
      path: '/finance',
      color: 'bg-amber-100 text-amber-700',
      hover: 'hover:border-amber-500 hover:shadow-amber-100',
    },
    {
      id: 'admin',
      title: 'Platform Admin',
      description: 'System configuration and audit logging.',
      icon: Settings,
      path: '/admin',
      color: 'bg-slate-100 text-slate-700',
      hover: 'hover:border-slate-500 hover:shadow-slate-100',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-600 rounded-2xl mb-6 shadow-lg shadow-emerald-200">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Welcome to GrantFlow
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select your role to log in to the Grant Lifecycle Management Platform. This demo environment allows you to explore all perspectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Link
              key={role.id}
              to={role.path}
              className={`group bg-white p-8 rounded-3xl border-2 border-transparent shadow-sm transition-all duration-300 ${role.hover} hover:shadow-xl flex flex-col h-full`}
            >
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${role.color} transition-transform group-hover:scale-110`}>
                <role.icon className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h2>
              <p className="text-slate-500 mb-8 flex-1">{role.description}</p>
              <div className="flex items-center text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors mt-auto">
                Log in as {role.title}
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            &larr; Back to Public Catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
