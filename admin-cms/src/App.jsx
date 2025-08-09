import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Settings from './pages/Settings';
import AdminCreator from './pages/AdminCreator';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Services from './pages/Services';
import Login from './pages/Login';
import ActivityTracker from './components/ActivityTracker';
import useAuthStore from './stores/authStore';
import useAutoRefresh from './hooks/useAutoRefresh';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isHydrated } = useAuthStore();
  
  // Show loading while state is being hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const { isHydrated, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth if not already hydrated
    if (!isHydrated) {
      initializeAuth();
    }
  }, [isHydrated, initializeAuth]);

  // Auto refresh token
  useAutoRefresh();

  // Show loading while state is being hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <ActivityTracker />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="settings" element={<Settings />} />
          <Route path="zuna" element={<AdminCreator />} />
          <Route path="categories" element={<Categories />} />
          <Route path="users" element={<Users />} />
          <Route path="services" element={<Services />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App; 