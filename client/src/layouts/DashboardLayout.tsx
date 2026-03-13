import { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Award, MessageSquare, Folder, Building, 
  LogOut, Bell, Leaf, Menu, CheckSquare, DollarSign, Settings, Users, Activity 
} from 'lucide-react';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  
  // Determine role based on URL path
  let role = 'applicant';
  if (path.startsWith('/officer')) role = 'officer';
  else if (path.startsWith('/reviewer')) role = 'reviewer';
  else if (path.startsWith('/finance')) role = 'finance';
  else if (path.startsWith('/admin')) role = 'admin';

  const navConfig = {
    applicant: [
      { name: 'Dashboard', path: '/applicant', icon: LayoutDashboard },
      { name: 'My Applications', path: '/applicant/applications', icon: FileText },
      { name: 'My Grants', path: '/applicant/grants', icon: Award },
      { name: 'Messages', path: '/applicant/messages', icon: MessageSquare },
      { name: 'Document Vault', path: '/applicant/documents', icon: Folder },
      { name: 'Organisation Profile', path: '/applicant/profile', icon: Building },
    ],
    officer: [
      { name: 'Dashboard', path: '/officer', icon: LayoutDashboard },
      { name: 'Applications', path: '/officer/applications', icon: FileText },
      { name: 'Active Grants', path: '/officer/grants', icon: Award },
      { name: 'Compliance Reports', path: '/officer/reports', icon: Activity },
      { name: 'Messages', path: '/officer/messages', icon: MessageSquare },
    ],
    reviewer: [
      { name: 'Dashboard', path: '/reviewer', icon: LayoutDashboard },
      { name: 'Assigned Reviews', path: '/reviewer/reviews', icon: CheckSquare },
    ],
    finance: [
      { name: 'Dashboard', path: '/finance', icon: LayoutDashboard },
      { name: 'Disbursements', path: '/finance/disbursements', icon: DollarSign },
      { name: 'Expenditures', path: '/finance/expenditures', icon: FileText },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'User Management', path: '/admin/users', icon: Users },
      { name: 'Audit Log', path: '/admin/audit', icon: Activity },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ]
  };

  const navItems = navConfig[role as keyof typeof navConfig];

  const roleColors = {
    applicant: 'bg-emerald-600',
    officer: 'bg-blue-600',
    reviewer: 'bg-purple-600',
    finance: 'bg-amber-600',
    admin: 'bg-slate-800'
  };

  const roleNames = {
    applicant: 'Applicant Portal',
    officer: 'Program Officer',
    reviewer: 'Grant Reviewer',
    finance: 'Finance Officer',
    admin: 'Platform Admin'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block flex flex-col`}>
        <div className="h-16 flex flex-col justify-center px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className={`${roleColors[role as keyof typeof roleColors]} p-1.5 rounded-lg`}>
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">GrantFlow</span>
          </Link>
          <span className="text-xs font-medium text-slate-500 mt-1 ml-9">{roleNames[role as keyof typeof roleNames]}</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === `/${role}`}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`
              }
            >
              <item.icon className={`h-5 w-5 ${path === item.path || (path === `/${role}` && item.path === `/${role}`) ? 'text-slate-900' : 'text-slate-400'}`} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors">
            <LogOut className="h-5 w-5" />
            Switch Role
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center text-sm font-medium text-slate-500">
              <span className="capitalize">{role} Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className={`h-8 w-8 ${roleColors[role as keyof typeof roleColors]} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer`}>
              {role.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
