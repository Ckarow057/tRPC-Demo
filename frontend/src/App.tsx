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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Brew Studio</h1>
                <p className="text-sm text-gray-500">Coffee Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden md:block text-sm text-gray-600">
                Welcome, {user?.name || user?.email || 'User'}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z' },
              { id: 'coffee', label: 'Coffee Menu', icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7' },
              { id: 'customers', label: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' },
              { id: 'merchandise', label: 'Merchandise', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
              { id: 'auth', label: 'Auth Demo', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Coffee Items</p>
                    <p className="text-2xl font-bold text-gray-900">{coffee.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Merchandise</p>
                    <p className="text-2xl font-bold text-gray-900">{merch.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                    <p className="text-2xl font-bold text-gray-900">$2,847</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={fetchCoffee}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-400 hover:bg-amber-50"
                >
                  <div className="bg-amber-500 p-3 rounded-lg mb-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Load Coffee Menu</span>
                  <span className="text-sm text-gray-500">Refresh coffee inventory</span>
                </button>

                <button
                  onClick={fetchUsers}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50"
                >
                  <div className="bg-blue-500 p-3 rounded-lg mb-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Load Customers</span>
                  <span className="text-sm text-gray-500">Update customer database</span>
                </button>

                <button
                  onClick={fetchMerch}
                  className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50"
                >
                  <div className="bg-green-500 p-3 rounded-lg mb-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Load Merchandise</span>
                  <span className="text-sm text-gray-500">Check inventory status</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coffee' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Coffee Menu Management</h2>
                <p className="text-gray-600 mt-1">Manage your coffee collection</p>
              </div>
              <Button onClick={fetchCoffee} className="bg-amber-600 hover:bg-amber-700 text-white">
                Refresh Menu
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-amber-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Coffee Collection</h3>
              </div>

              <div className="divide-y divide-gray-200">
                {coffee.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Coffee Items</h4>
                    <p className="text-gray-500 mb-4">Start by loading your coffee menu</p>
                    <button onClick={fetchCoffee} className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md">
                      Load Coffee Menu
                    </button>
                  </div>
                ) : (
                  coffee.map((item, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-4">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words font-mono">
                              {JSON.stringify(item, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                            Edit
                          </button>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
                <p className="text-gray-600 mt-1">View and manage your customers</p>
              </div>
              <button
                onClick={fetchUsers}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Refresh Customers
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Customer Database</h3>
              </div>

              <div className="divide-y divide-gray-200">
                {users.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Customers Found</h4>
                    <p className="text-gray-500 mb-4">Load your customer database</p>
                    <button onClick={fetchUsers} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                      Load Customers
                    </button>
                  </div>
                ) : (
                  users.map((user, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-4">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words font-mono">
                              {JSON.stringify(user, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                            View
                          </button>
                          <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
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
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">🔐 Authentication Demo</h2>
              <p className="text-gray-600 mt-1">Test the bearer token middleware system</p>
            </div>
            <AuthDemo />
          </div>
        )}

        {activeTab === 'merchandise' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Merchandise Management</h2>
                <p className="text-gray-600 mt-1">Track and manage your inventory</p>
              </div>
              <button
                onClick={fetchMerch}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Refresh Inventory
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Inventory Stock</h3>
              </div>

              <div className="divide-y divide-gray-200">
                {merch.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Merchandise</h4>
                    <p className="text-gray-500 mb-4">Load your inventory to view all items</p>
                    <button onClick={fetchMerch} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                      Load Merchandise
                    </button>
                  </div>
                ) : (
                  merch.map((item, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-4">
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words font-mono">
                              {JSON.stringify(item, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                            Edit
                          </button>
                          <button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm">
                            Restock
                          </button>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">
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
