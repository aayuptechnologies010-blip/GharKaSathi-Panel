import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaChartBar, FaUserCheck, FaUsers, FaFolderOpen, 
  FaPercentage, FaFileInvoiceDollar, FaExclamationTriangle, FaBell,
  FaMapMarkedAlt, FaUserClock, FaHeart
} from 'react-icons/fa';
import Logo from './Logo';

export default function Sidebar({ isCollapsed }) {
  const menuItems = [
    { name: 'Analytics Dashboard', path: '/', icon: FaChartBar },
    { name: 'Booking Monitor', path: '/bookings', icon: FaMapMarkedAlt },
    { name: 'Partner Approvals', path: '/approvals', icon: FaUserCheck },
    { name: 'User Management', path: '/users', icon: FaUsers },
    { name: 'Provider Directory', path: '/providers', icon: FaUserClock },
    { name: 'Category Manager', path: '/categories', icon: FaFolderOpen },
    { name: 'Commission Rules', path: '/commission', icon: FaPercentage },
    { name: 'Payment Reports', path: '/payments', icon: FaFileInvoiceDollar },
    { name: 'Complaint Desk', path: '/complaints', icon: FaExclamationTriangle },
    { name: 'Push Notifications', path: '/notifications', icon: FaBell }
  ];

  return (
    <aside className={`bg-brand-navy text-slate-300 h-screen fixed top-0 left-0 flex flex-col justify-between border-r border-brand-navy-dark z-30 shadow-xl transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Brand Header */}
      <div>
        <div className="border-b border-brand-navy-light flex items-center justify-center bg-brand-navy-dark/30 h-16 overflow-hidden">
          <Logo className="h-9" light={true} showText={!isCollapsed} />
        </div>

        {/* Menu Nav Links */}
        <nav className="p-3 space-y-1 mt-3 max-h-[75vh] overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={index} 
                to={item.path}
                className={({ isActive }) => `
                  flex items-center rounded-lg text-xs font-semibold transition-all duration-150
                  ${isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5'}
                  ${isActive 
                    ? 'bg-brand-gold text-brand-navy shadow-md shadow-brand-gold/10 active-pulse' 
                    : 'text-slate-400 hover:bg-brand-navy-light hover:text-white'
                  }
                `}
                title={isCollapsed ? item.name : ''}
              >
                <Icon className="text-base shrink-0" />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding */}
      <div className="p-3 border-t border-brand-navy-light text-[9px] text-slate-400 text-center font-medium bg-brand-navy-dark/20 h-12 flex flex-col justify-center overflow-hidden">
        {isCollapsed ? (
          <p className="font-bold text-brand-gold text-[10px]">GS</p>
        ) : (
          <p className="text-slate-500">Prepared by Aayup Tech</p>
        )}
      </div>
    </aside>
  );
}
