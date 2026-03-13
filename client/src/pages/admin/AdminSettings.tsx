import { useState } from 'react';
import { Save, Mail, Shield, Globe, Database, Bell, Lock, AlertTriangle } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-500 mt-1">Configure platform-wide settings and integrations.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeTab === 'general' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Globe className="h-5 w-5" /> General
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeTab === 'security' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Shield className="h-5 w-5" /> Security
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeTab === 'email' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Mail className="h-5 w-5" /> Email Templates
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeTab === 'notifications' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Bell className="h-5 w-5" /> Notifications
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                activeTab === 'database' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Database className="h-5 w-5" /> Database & Backups
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {activeTab === 'general' && (
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Platform Information</h2>
                  <div className="space-y-4 max-w-2xl">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Platform Name</label>
                      <input type="text" defaultValue="GrantFlow" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Support Email</label>
                      <input type="email" defaultValue="support@grantflow.org" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Default Currency</label>
                      <select className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none">
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Maintenance Mode</h2>
                  <div className="flex items-start gap-4 p-4 border border-amber-200 bg-amber-50 rounded-xl max-w-2xl">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-amber-900">Enable Maintenance Mode</h3>
                      <p className="text-sm text-amber-700 mt-1">When enabled, only Platform Admins can log in. All other users will see a maintenance page.</p>
                      <div className="mt-4 flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                        </label>
                        <span className="text-sm font-medium text-slate-700">Off</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Authentication Settings</h2>
                  <div className="space-y-6 max-w-2xl">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h3>
                        <p className="text-sm text-slate-500 mt-1">Require 2FA for all staff roles (Admin, Officer, Finance).</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-900">Password Policy</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Minimum Length</label>
                          <input type="number" defaultValue="12" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Password Expiry (Days)</label>
                          <input type="number" defaultValue="90" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="complex" defaultChecked className="rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                        <label htmlFor="complex" className="text-sm text-slate-700">Require numbers and special characters</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-slate-100 pt-8">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Session Management</h2>
                  <div className="space-y-4 max-w-2xl">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Idle Timeout (Minutes)</label>
                      <input type="number" defaultValue="30" className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none" />
                      <p className="text-xs text-slate-500">Users will be automatically logged out after this period of inactivity.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'general' && activeTab !== 'security' && (
              <div className="p-6 sm:p-8 text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Lock className="h-8 w-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Settings Section</h2>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">This configuration section is currently under development. Check back later for updates.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
