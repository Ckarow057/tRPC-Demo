import { useState } from 'react';
import { trpc } from './lib/trpc';
import { Button } from './components/ui/button';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthDemo } from './components/auth/AuthDemo';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const [users, setUsers] = useState<any[]>([]);
  const [merch, setMerch] = useState<any[]>([]);
  const [coffee, setCoffee] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'coffee' | 'customers' | 'merchandise' | 'auth'>('dashboard');
  const { user, logout } = useAuth();

  const fetchUsers = async () => {
    try {
      const data = await trpc.public.getAllUsers.query();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchMerch = async () => {
    try {
      const data = await trpc.public.getAllMerch.query();
      setMerch(data);
    } catch (error) {
      console.error('Error fetching merch:', error);
    }
  };

  const fetchCoffee = async () => {
    try {
      const data = await trpc.public.getAllCoffee.query();
      setCoffee(data);
    } catch (error) {
      console.error('Error fetching coffee:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Brew Studio
                </h1>
                <p className="text-sm text-gray-500 font-medium">Premium Coffee Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">Live System</span>
              </div>
              <div className="hidden md:flex items-center space-x-3 bg-blue-50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">
                  Welcome, {user?.name || user?.email || 'User'}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700 hover:text-red-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
              <div className="relative">
                <div className="bg-gray-200 hover:bg-gray-300 transition-all duration-200 rounded-full p-3 shadow-lg cursor-pointer">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z', color: 'bg-indigo-500' },
              { id: 'coffee', label: 'Coffee Menu', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7', color: 'bg-amber-500' },
              { id: 'customers', label: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z', color: 'bg-emerald-500' },
              { id: 'merchandise', label: 'Merchandise', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'bg-violet-500' },
              { id: 'auth', label: 'Auth Demo', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', color: 'bg-red-500' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center px-6 py-4 text-sm font-semibold transition-all duration-300 rounded-t-xl ${activeTab === tab.id
                  ? `text-white shadow-lg transform -translate-y-1 ${tab.color}`
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-3 h-3 bg-white rotate-45 border-r border-b border-slate-200/50"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Customers</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{users.length}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">+12% this month</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Coffee Items</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{coffee.length}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">+3 new items</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Merchandise</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{merch.length}</p>
                    <p className="text-xs text-rose-600 font-medium mt-1">Low stock alert</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Revenue Today</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">$2,847</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">+28% vs yesterday</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 shadow-lg">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={fetchCoffee}
                  className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-2 border-dashed border-amber-300 hover:border-amber-400 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Load Coffee Menu</span>
                    <span className="text-slate-600 text-sm mt-2">Refresh coffee inventory</span>
                  </div>
                </button>

                <button
                  onClick={fetchUsers}
                  className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-2 border-dashed border-indigo-300 hover:border-indigo-400 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Load Customers</span>
                    <span className="text-slate-600 text-sm mt-2">Update customer database</span>
                  </div>
                </button>

                <button
                  onClick={fetchMerch}
                  className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-dashed border-emerald-300 hover:border-emerald-400 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <span className="font-bold text-slate-800 text-lg">Load Merchandise</span>
                    <span className="text-slate-600 text-sm mt-2">Check inventory status</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coffee' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Coffee Menu Management
                </h2>
                <p className="text-slate-600 mt-2">Manage your premium coffee collection</p>
              </div>
              <Button
                onClick={fetchCoffee}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Menu
              </Button>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-8 py-6 border-b border-slate-200/50">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Coffee Collection</h3>
                </div>
              </div>

              <div className="divide-y divide-slate-200/50">
                {coffee.length === 0 ? (
                  <div className="px-8 py-16 text-center">
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-2">No Coffee Items</h4>
                    <p className="text-slate-600 mb-6">Start by loading your coffee menu to see all available items</p>
                    <button
                      onClick={fetchCoffee}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Load Coffee Menu
                    </button>
                  </div>
                ) : (
                  coffee.map((item, index) => (
                    <div key={index} className="px-8 py-6 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-6">
                          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/50">
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap break-words font-mono leading-relaxed">
                              {JSON.stringify(item, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105">
                            Edit
                          </button>
                          <button className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Customer Management
                </h2>
                <p className="text-slate-600 mt-2">View and manage your valued customers</p>
              </div>
              <button
                onClick={fetchUsers}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Customers
              </button>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-8 py-6 border-b border-slate-200/50">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Customer Database</h3>
                </div>
              </div>

              <div className="divide-y divide-slate-200/50">
                {users.length === 0 ? (
                  <div className="px-8 py-16 text-center">
                    <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-2">No Customers Found</h4>
                    <p className="text-slate-600 mb-6">Load your customer database to view all registered users</p>
                    <button
                      onClick={fetchUsers}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Load Customers
                    </button>
                  </div>
                ) : (
                  users.map((user, index) => (
                    <div key={index} className="px-8 py-6 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-6">
                          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/50">
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap break-words font-mono leading-relaxed">
                              {JSON.stringify(user, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105">
                            View
                          </button>
                          <button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                🔐 Authentication Demo
              </h2>
              <p className="text-slate-600 mt-2">Test the bearer token middleware system</p>
            </div>
            <AuthDemo />
          </div>
        )}

        {activeTab === 'merchandise' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Merchandise Management
                </h2>
                <p className="text-slate-600 mt-2">Track and manage your inventory</p>
              </div>
              <button
                onClick={fetchMerch}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Inventory
              </button>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-8 py-6 border-b border-slate-200/50">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Inventory Stock</h3>
                </div>
              </div>

              <div className="divide-y divide-slate-200/50">
                {merch.length === 0 ? (
                  <div className="px-8 py-16 text-center">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold text-slate-800 mb-2">No Merchandise</h4>
                    <p className="text-slate-600 mb-6">Load your inventory to view all merchandise items</p>
                    <button
                      onClick={fetchMerch}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Load Merchandise
                    </button>
                  </div>
                ) : (
                  merch.map((item, index) => (
                    <div key={index} className="px-8 py-6 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-6">
                          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/50">
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap break-words font-mono leading-relaxed">
                              {JSON.stringify(item, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105">
                            Edit
                          </button>
                          <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105">
                            Restock
                          </button>
                          <button className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
