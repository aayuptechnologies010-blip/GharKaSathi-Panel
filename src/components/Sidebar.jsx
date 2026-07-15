import React from 'react';
import { NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  FaChartBar, FaUserCheck, FaUsers, FaFolderOpen, 
  FaPercentage, FaFileInvoiceDollar, FaExclamationTriangle, FaBell,
  FaMapMarkedAlt, FaUserClock, FaKey, FaSignOutAlt 
} from 'react-icons/fa';
import Logo from './Logo';

export default function Sidebar({ isCollapsed, onLogout }) {
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

  const handleChangePassword = () => {
    Swal.fire({
      title: 'Change Admin Password',
      html: `
        <div class="space-y-3 text-left">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Current Password</label>
            <input type="password" id="old-pass" class="swal2-input w-full m-0 rounded-xl" placeholder="••••••">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">New Password (Min 6 chars)</label>
            <input type="password" id="new-pass" class="swal2-input w-full m-0 rounded-xl" placeholder="••••••">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm New Password</label>
            <input type="password" id="confirm-pass" class="swal2-input w-full m-0 rounded-xl" placeholder="••••••">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update Password',
      confirmButtonColor: '#13264d',
      cancelButtonColor: '#64748b',
      focusConfirm: false,
      preConfirm: () => {
        const oldPass = document.getElementById('old-pass').value;
        const newPass = document.getElementById('new-pass').value;
        const confirmPass = document.getElementById('confirm-pass').value;

        if (!oldPass || !newPass || !confirmPass) {
          Swal.showValidationMessage('Please fill in all fields');
          return false;
        }

        if (newPass.length < 6) {
          Swal.showValidationMessage('New password must be at least 6 characters long');
          return false;
        }

        if (newPass !== confirmPass) {
          Swal.showValidationMessage('Confirm password does not match new password');
          return false;
        }

        return { oldPass, newPass };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Success!',
          text: 'Admin console password has been updated successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: 'Log Out Console Session?',
      text: 'Do you want to log out from this admin console session?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Sign Out',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Logged out successfully!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  };

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
        <nav className="p-3 space-y-1 mt-3 max-h-[60vh] overflow-y-auto">
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

      {/* Footer Branding & Actions */}
      <div className="p-3 border-t border-brand-navy-light bg-brand-navy-dark/20 space-y-2">
        {/* Action Controls */}
        <div className="space-y-1">
          {/* Change Password */}
          <button
            onClick={handleChangePassword}
            className={`w-full flex items-center rounded-lg text-xs font-bold text-slate-400 hover:bg-brand-navy-light hover:text-white transition duration-150 ${
              isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5'
            }`}
            title="Change Password"
          >
            <FaKey className="text-sm text-brand-gold shrink-0" />
            {!isCollapsed && <span>Change Password</span>}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogoutClick}
            className={`w-full flex items-center rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition duration-150 ${
              isCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3.5 py-2.5'
            }`}
            title="Sign Out"
          >
            <FaSignOutAlt className="text-sm shrink-0" />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>

        {/* Branding */}
        {!isCollapsed && (
          <p className="text-[9px] text-slate-500 text-center font-medium">
            Prepared by Aayup Tech
          </p>
        )}
      </div>
    </aside>
  );
}
