import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  FaSearch, FaBan, FaCheck, FaPhoneAlt, FaMapMarkerAlt, 
  FaStar, FaShieldAlt, FaTrashAlt 
} from 'react-icons/fa';
import { api } from '../services/api';

export default function Users() {
  const [activeTab, setActiveTab] = useState('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data depending on active tab
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'customers') {
        const data = await api.getUsers();
        setCustomers(data);
      } else {
        const data = await api.getProviders();
        setProviders(data);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Fetching Accounts',
        text: error.message || 'Something went wrong.',
        confirmButtonColor: '#13264d'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleToggleStatus = async (user) => {
    // Check if currently active/suspended
    const isSuspended = activeTab === 'customers' ? user.isSuspended : user.isSuspended;
    const isBlocking = !isSuspended;
    
    Swal.fire({
      title: isBlocking ? 'Suspend Account?' : 'Reinstate Account?',
      text: `Are you sure you want to ${isBlocking ? 'suspend' : 'reinstate'} ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isBlocking ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: isBlocking ? 'Yes, Suspend!' : 'Yes, Reinstate!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (activeTab === 'customers') {
            if (isBlocking) {
              await api.suspendUser(user._id);
            } else {
              await api.reinstateUser(user._id);
            }
            // Update local state
            setCustomers(customers.map(c => 
              c._id === user._id ? { ...c, isSuspended: isBlocking } : c
            ));
          } else {
            if (isBlocking) {
              await api.suspendProvider(user._id);
            } else {
              await api.reinstateProvider(user._id);
            }
            // Update local state
            setProviders(providers.map(p => 
              p._id === user._id ? { ...p, isSuspended: isBlocking } : p
            ));
          }

          Swal.fire(
            isBlocking ? 'Suspended!' : 'Reinstated!',
            `${user.name} account has been ${isBlocking ? 'suspended' : 'reinstated'}.`,
            'success'
          );
        } catch (error) {
          Swal.fire('Error', error.message || 'Operation failed', 'error');
        }
      }
    });
  };

  const handleRemove = (user) => {
    Swal.fire({
      title: 'Delete Account Permanent?',
      text: `This will permanently delete the account of ${user.name}. This action cannot be undone.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Permanent!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Postman does not list a direct user delete endpoint under Admin panel,
        // so we will show a placeholder/alert or handle it if we want.
        Swal.fire('Info', 'Delete endpoint not registered in administrative routing.', 'info');
      }
    });
  };

  // Get active list to render
  const activeList = activeTab === 'customers' ? customers : providers;

  // Filter list
  const filteredList = activeList.filter(user => {
    const name = user.name || '';
    const phone = user.phone || user.phoneNumber || '';
    const email = user.email || '';
    const location = typeof user.location === 'object' ? (user.location?.text || '') : (user.location || '');
    
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           phone.includes(searchQuery) ||
           email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm">Manage customers and service providers on the platform</p>
        </div>

        {/* Tab Selector */}
        <div className="bg-white p-1.5 rounded-xl border flex shadow-sm">
          <button 
            onClick={() => { setActiveTab('customers'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeTab === 'customers' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Customers
          </button>
          <button 
            onClick={() => { setActiveTab('providers'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              activeTab === 'providers' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Service Providers
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-3.5 text-slate-400 text-sm" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold self-end md:self-auto">
          Showing {filteredList.length} of {activeList.length} entries
        </div>
      </div>

      {/* Data Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-slate-950"></div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Fetching Accounts...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p>No results match your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">ID & Name</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">
                    {activeTab === 'customers' ? 'Joined Date' : 'Category / Rating'}
                  </th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredList.map((user) => {
                  const locationText = typeof user.location === 'object' ? (user.location?.text || 'N/A') : (user.location || 'N/A');
                  const phone = user.phone || user.phoneNumber || 'N/A';
                  const isSuspended = user.isSuspended;
                  const displayStatus = isSuspended ? 'Suspended' : 'Active';

                  return (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition">
                      {/* Name */}
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-slate-800">{user.name || 'GKS User'}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {user._id}</p>
                        </div>
                      </td>

                      {/* Contacts */}
                      <td className="py-4 px-6 text-slate-600">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-1.5 text-xs">
                            <FaPhoneAlt className="text-slate-400" />
                            <span>{phone}</span>
                          </div>
                          {user.email && <p className="text-xs text-slate-400">{user.email}</p>}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6 text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <FaMapMarkerAlt className="text-slate-400" />
                          <span className="text-xs truncate max-w-xs">{locationText}</span>
                        </div>
                      </td>

                      {/* Details */}
                      <td className="py-4 px-6">
                        {activeTab === 'customers' ? (
                          <span className="text-xs text-slate-600 font-medium">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        ) : (
                          <div>
                            <p className="font-semibold text-slate-700 text-xs">
                              {user.categories && user.categories[0]?.name || 'Service Partner'}
                            </p>
                            <div className="flex items-center text-amber-500 text-xs font-bold space-x-1 mt-0.5">
                              <FaStar />
                              <span>{user.rating || '0.0'}</span>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          !isSuspended 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {displayStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-2">
                        <button 
                          onClick={() => handleToggleStatus(user)}
                          className={`p-2 rounded-lg border transition cursor-pointer ${
                            !isSuspended 
                              ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                          }`}
                          title={!isSuspended ? 'Suspend Account' : 'Reinstate Account'}
                        >
                          {!isSuspended ? <FaBan className="text-xs" /> : <FaCheck className="text-xs" />}
                        </button>
                        <button 
                          onClick={() => handleRemove(user)}
                          className="p-2 bg-slate-50 text-slate-500 border border-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-lg transition cursor-pointer"
                          title="Delete User"
                        >
                          <FaTrashAlt className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
