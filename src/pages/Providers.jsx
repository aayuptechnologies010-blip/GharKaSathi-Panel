import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  FaSearch, FaCheckCircle, FaTimesCircle, FaStar, 
  FaUserShield, FaBan, FaCheck, FaWallet, FaTools, FaIdCard
} from 'react-icons/fa';
import { api } from '../services/api';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch providers list
  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await api.getProviders();
      setProviders(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Providers',
        text: error.message || 'Something went wrong.',
        confirmButtonColor: '#13264d'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const toggleBlockStatus = (provider) => {
    const isBlocking = !provider.isSuspended;
    Swal.fire({
      title: isBlocking ? 'Block Partner?' : 'Activate Partner?',
      text: `Are you sure you want to ${isBlocking ? 'block' : 'unblock'} ${provider.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isBlocking ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: isBlocking ? 'Yes, Block!' : 'Yes, Activate!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (isBlocking) {
            await api.suspendProvider(provider._id);
          } else {
            await api.reinstateProvider(provider._id);
          }
          setProviders(providers.map(p => 
            p._id === provider._id ? { ...p, isSuspended: isBlocking } : p
          ));
          Swal.fire(
            isBlocking ? 'Blocked!' : 'Activated!',
            `${provider.name} status updated.`,
            'success'
          );
        } catch (error) {
          Swal.fire('Error', error.message || 'Status update failed.', 'error');
        }
      }
    });
  };

  const viewKycDetails = (provider) => {
    const docList = provider.documents || [];
    const uploadsBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://gharkasathi-backend.onrender.com/api').replace('/api', '/uploads');
    
    let docsHtml = '';
    if (docList.length > 0) {
      docsHtml = docList.map((doc, idx) => `
        <div class="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mt-2">
          <img 
            src="${doc.startsWith('http') ? doc : `${uploadsBaseUrl}/${doc}`}" 
            alt="KYC Document ${idx + 1}"
            class="w-full h-auto max-h-40 object-cover"
            onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400';"
          />
        </div>
      `).join('');
    } else {
      docsHtml = `
        <div class="h-28 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 mt-2">
          <span class="text-xs">No documents uploaded</span>
        </div>
      `;
    }

    Swal.fire({
      title: 'KYC Document Verification',
      html: `
        <div class="text-left space-y-4 text-xs">
          <p><b>Name:</b> ${provider.name || 'GKS Partner'}</p>
          <p><b>Verification Status:</b> ${provider.approved ? 'Verified' : 'Pending Review'}</p>
          <p class="font-bold text-slate-500 uppercase mt-4">Uploaded Documents</p>
          ${docsHtml}
        </div>
      `,
      confirmButtonText: 'Close',
      confirmButtonColor: '#13264d'
    });
  };

  const filtered = providers.filter(p => {
    const name = p.name || '';
    const categoryName = p.categories && p.categories[0]?.name || 'Service Partner';
    const phone = p.phone || p.phoneNumber || '';
    
    return name.toLowerCase().includes(search.toLowerCase()) ||
           categoryName.toLowerCase().includes(search.toLowerCase()) ||
           phone.includes(search);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Provider Directory</h1>
        <p className="text-slate-500 text-sm">Manage partner profile status, KYC documents, and account activity</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-3.5 text-slate-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search provider name, category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-slate-950"></div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Fetching Providers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p>No providers found matching query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Partner Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Work Status</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Wallet Balance</th>
                  <th className="py-4 px-6">KYC Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map((p) => {
                  const categoryName = p.categories && p.categories[0]?.name || 'Service Partner';
                  const phoneText = p.phone || p.phoneNumber || 'N/A';
                  const isSuspended = p.isSuspended;
                  const displayStatus = isSuspended ? 'Suspended' : 'Active';

                  return (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-slate-800">{p.name || 'GKS Partner'}</p>
                          <p className="text-xs text-slate-400">{phoneText}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700">{categoryName}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          <span>{p.isAvailable ? 'Online' : 'Offline'}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-amber-500 text-xs font-bold space-x-1">
                          <FaStar />
                          <span>{p.rating || '0.0'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1 text-slate-700 font-bold">
                          <FaWallet className="text-slate-400 text-xs" />
                          <span>₹{p.walletBalance || 0}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span 
                          onClick={() => viewKycDetails(p)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer transition border ${
                            p.approved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {p.approved ? 'Verified' : 'Pending Review'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button 
                          onClick={() => toggleBlockStatus(p)}
                          className={`p-2 rounded-lg border transition cursor-pointer ${
                            !isSuspended 
                              ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                          }`}
                          title={!isSuspended ? 'Block Captain' : 'Unblock Captain'}
                        >
                          {!isSuspended ? <FaBan className="text-xs" /> : <FaCheck className="text-xs" />}
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
