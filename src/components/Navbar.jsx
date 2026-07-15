import React from 'react';
import { FaBell, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Navbar({ isCollapsed, toggleSidebar }) {
  const showNotifications = () => {
    Swal.fire({
      title: 'Alert Notifications',
      html: `
        <div class="text-left space-y-2 text-xs">
          <div class="p-2 bg-slate-50 border rounded-xl">
            <p class="font-bold text-slate-700">New Registration Request</p>
            <p class="text-[11px] text-slate-500 mt-0.5">Karan Johar has requested electrician approval.</p>
          </div>
          <div class="p-2 bg-slate-50 border rounded-xl">
            <p class="font-bold text-slate-700">Complaint Ticket Opened</p>
            <p class="text-[11px] text-slate-500 mt-0.5">Ticket COMP-102 created by Priya Patel.</p>
          </div>
        </div>
      `,
      confirmButtonText: 'Clear All',
      confirmButtonColor: '#13264d'
    });
  };

  return (
    <header className="h-16 bg-white/80 border-b border-slate-100 sticky top-0 flex items-center justify-between px-6 z-20 backdrop-blur-md">
      {/* Sidebar Toggle & Search Bar */}
      <div className="flex items-center space-x-4">
        {/* Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition flex items-center justify-center border border-slate-100 shadow-sm"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <FaChevronRight className="text-xs" /> : <FaChevronLeft className="text-xs" />}
        </button>

        {/* Search Input */}
        <div className="relative w-72 hidden md:block">
          <FaSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
          <input 
            type="text" 
            placeholder="Global system search..."
            className="w-full pl-8 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Action controls */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Notifications */}
        <button 
          onClick={showNotifications}
          className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg relative transition"
        >
          <FaBell className="text-xs" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 border border-white rounded-full"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center space-x-3 border-l border-slate-100 pl-4">
          <div className="text-right hidden sm:block">
            <h4 className="font-bold text-slate-700 text-xs">Aayush Raj</h4>
            <p className="text-[9px] text-sky-500 font-bold uppercase tracking-wider">Super Admin</p>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120" 
            alt="Profile Avatar" 
            className="w-8 h-8 rounded-lg border border-slate-100 object-cover cursor-pointer hover:opacity-85 transition"
            onClick={() => Swal.fire('Profile Panel', 'Aayush Raj (Super Admin) settings.', 'info')}
          />
        </div>
      </div>
    </header>
  );
}
