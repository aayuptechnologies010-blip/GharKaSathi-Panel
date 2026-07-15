import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { 
  FaSearch, FaBan, FaCheck, FaPhoneAlt, FaMapMarkerAlt, 
  FaStar, FaShieldAlt, FaTrashAlt 
} from 'react-icons/fa';

const initialUsers = {
  customers: [
    { id: 'CUST-301', name: 'Amit Sharma', phone: '+91 98765 43210', email: 'amit@gmail.com', location: 'Noida, UP', bookings: 12, joinedDate: 'May 12, 2026', status: 'Active' },
    { id: 'CUST-302', name: 'Neha Gupta', phone: '+91 99999 88888', email: 'neha@gmail.com', location: 'South Delhi, DL', bookings: 8, joinedDate: 'June 01, 2026', status: 'Blocked' },
    { id: 'CUST-303', name: 'Rohan Verma', phone: '+91 98111 22222', email: 'rohan@yahoo.com', location: 'Gurugram, HR', bookings: 24, joinedDate: 'Jan 15, 2026', status: 'Active' },
    { id: 'CUST-304', name: 'Kirti Sen', phone: '+91 95555 44444', email: 'kirti@outlook.com', location: 'Noida, UP', bookings: 3, joinedDate: 'July 10, 2026', status: 'Active' }
  ],
  providers: [
    { id: 'PROV-501', name: 'Rajesh Kumar', category: 'Plumber', phone: '+91 94444 33333', rating: 4.9, location: 'Ghaziabad, UP', status: 'Active' },
    { id: 'PROV-502', name: 'Suresh Singh', category: 'Electrician', phone: '+91 92222 11111', rating: 4.8, location: 'Dwarka, DL', status: 'Active' },
    { id: 'PROV-503', name: 'Sunita Devi', category: 'House Help / Maid', phone: '+91 97777 66666', rating: 4.7, location: 'Noida, UP', status: 'Blocked' },
    { id: 'PROV-504', name: 'Manoj Yadav', category: 'Painter', phone: '+91 96666 55555', rating: 4.5, location: 'Faridabad, HR', status: 'Active' }
  ]
};

export default function Users() {
  const [activeTab, setActiveTab] = useState('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [usersList, setUsersList] = useState(initialUsers);

  const handleToggleStatus = (user, type) => {
    const isBlocking = user.status === 'Active';
    Swal.fire({
      title: isBlocking ? 'Block Account?' : 'Unblock Account?',
      text: `Are you sure you want to ${isBlocking ? 'block' : 'unblock'} ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isBlocking ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: isBlocking ? 'Yes, Block!' : 'Yes, Unblock!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedList = { ...usersList };
        updatedList[type] = updatedList[type].map(u => {
          if (u.id === user.id) {
            return { ...u, status: isBlocking ? 'Blocked' : 'Active' };
          }
          return u;
        });
        setUsersList(updatedList);
        Swal.fire(
          isBlocking ? 'Blocked!' : 'Activated!',
          `${user.name} has been ${isBlocking ? 'blocked' : 'unblocked'}.`,
          'success'
        );
      }
    });
  };

  const handleRemove = (user, type) => {
    Swal.fire({
      title: 'Delete Account Permanent?',
      text: `This will permanently delete the account of ${user.name}. This action cannot be undone.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Permanent!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedList = { ...usersList };
        updatedList[type] = updatedList[type].filter(u => u.id !== user.id);
        setUsersList(updatedList);
        Swal.fire(
          'Deleted!',
          `${user.name}'s account has been successfully deleted.`,
          'success'
        );
      }
    });
  };

  // Filter list
  const filteredList = usersList[activeTab].filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery) ||
    user.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'customers' 
                ? 'bg-sky-500 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Customers
          </button>
          <button 
            onClick={() => { setActiveTab('providers'); setSearchQuery(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'providers' 
                ? 'bg-sky-500 text-white shadow-sm' 
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
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold self-end md:self-auto">
          Showing {filteredList.length} of {usersList[activeTab].length} entries
        </div>
      </div>

      {/* Data Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredList.length === 0 ? (
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
                    {activeTab === 'customers' ? 'Bookings Completed' : 'Category / Rating'}
                  </th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredList.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition">
                    {/* Name */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.id}</p>
                      </div>
                    </td>

                    {/* Contacts */}
                    <td className="py-4 px-6 text-slate-600">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5 text-xs">
                          <FaPhoneAlt className="text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                        {user.email && <p className="text-xs text-slate-400">{user.email}</p>}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-slate-600">
                      <div className="flex items-center space-x-1.5">
                        <FaMapMarkerAlt className="text-slate-400" />
                        <span>{user.location}</span>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-4 px-6">
                      {activeTab === 'customers' ? (
                        <span className="font-semibold text-slate-800">{user.bookings} bookings</span>
                      ) : (
                        <div>
                          <p className="font-semibold text-slate-700">{user.category}</p>
                          <div className="flex items-center text-amber-500 text-xs font-bold space-x-1 mt-0.5">
                            <FaStar />
                            <span>{user.rating}</span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {user.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <button 
                        onClick={() => handleToggleStatus(user, activeTab)}
                        className={`p-2 rounded-lg border transition ${
                          user.status === 'Active' 
                            ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                        }`}
                        title={user.status === 'Active' ? 'Block Account' : 'Unblock Account'}
                      >
                        {user.status === 'Active' ? <FaBan className="text-xs" /> : <FaCheck className="text-xs" />}
                      </button>
                      <button 
                        onClick={() => handleRemove(user, activeTab)}
                        className="p-2 bg-slate-50 text-slate-500 border border-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-lg transition"
                        title="Delete User"
                      >
                        <FaTrashAlt className="text-xs" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
