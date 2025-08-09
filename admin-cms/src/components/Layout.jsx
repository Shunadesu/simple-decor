import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  User,
  Bell,
  Search,
  UserPlus,
  Home,
  Info,
  Folder,
  ShoppingCart,
  Headphones
} from 'lucide-react';
import useAuthStore from '../stores/authStore';
import SessionInfo from './SessionInfo';
import toast from 'react-hot-toast';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    { 
      name: 'Products', 
      href: '/products', 
      icon: Package,
      description: 'Manage product catalog'
    },
    { 
      name: 'Categories', 
      href: '/categories', 
      icon: Folder,
      description: 'Manage product categories'
    },
    { 
      name: 'Services', 
      href: '/services', 
      icon: Headphones,
      description: 'Manage company services'
    },
    { 
      name: 'Users', 
      href: '/users', 
      icon: Users,
      description: 'Manage user accounts'
    },
    { 
      name: 'About', 
      href: '/about', 
      icon: Info,
      description: 'About page content'
    },
    { 
      name: 'Blog', 
      href: '/blog', 
      icon: FileText,
      description: 'Blog posts management'
    },
    { 
      name: 'Contact', 
      href: '/contact', 
      icon: MessageSquare,
      description: 'Messages and quotes'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings,
      description: 'System configuration'
    },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-blue-600 font-bold text-lg">Z</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg">Zuna Admin</span>
              <p className="text-blue-100 text-xs">Simple Decor</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon 
                      size={20} 
                      className={`mr-3 flex-shrink-0 ${
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`} 
                    />
                    <div className="flex-1">
                      <span className="block">{item.name}</span>
                      <span className={`text-xs ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                        {item.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* User section */}
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@zuna.com'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} />
              </button>
              
              <div className="ml-4 lg:ml-0">
                <h1 className="text-xl font-semibold text-gray-900">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  {navigation.find(item => item.href === location.pathname)?.description || 'Welcome to admin panel'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'admin@zuna.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Session Info */}
      <SessionInfo />
    </div>
  );
};

export default Layout; 