import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import ProviderApprovals from './pages/ProviderApprovals';
import Users from './pages/Users';
import Providers from './pages/Providers';
import Categories from './pages/Categories';
import Commission from './pages/Commission';
import Payments from './pages/Payments';
import Complaints from './pages/Complaints';
import Notifications from './pages/Notifications';
import Login from './pages/Login';

// Page Loader Spinner Component (Localized inside Main Content container)
function Loader() {
  return (
    <div className="absolute inset-0 bg-slate-50/70 backdrop-blur-sm flex flex-col items-center justify-center z-40 transition-opacity duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-brand-gold"></div>
        {/* Inner static label */}
        <div className="absolute font-black text-brand-navy text-[9px] tracking-wider">GS</div>
      </div>
      <p className="mt-3 text-brand-navy font-extrabold text-[9px] tracking-widest uppercase animate-pulse">
        Loading Content...
      </p>
    </div>
  );
}

// Router Inner Wrapper to enable useLocation
function DashboardLayout({ onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  // Trigger loader on route changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450); // Fast, aesthetic loader (450ms)
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Nav */}
      <Sidebar isCollapsed={isCollapsed} onLogout={onLogout} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        isCollapsed ? 'pl-16' : 'pl-64'
      }`}>
        {/* Header */}
        <Navbar 
          isCollapsed={isCollapsed} 
          toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
          onLogout={onLogout}
        />

        {/* Main Body */}
        <main className="p-6 flex-grow relative">
          {/* Route Loading Overlay inside Main Body */}
          {isLoading && <Loader />}

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/approvals" element={<ProviderApprovals />} />
            <Route path="/users" element={<Users />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/commission" element={<Commission />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_account');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <DashboardLayout onLogout={handleLogout} />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </Router>
  );
}
