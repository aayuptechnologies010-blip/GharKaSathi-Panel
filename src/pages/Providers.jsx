import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { 
  FaSearch, FaCheckCircle, FaTimesCircle, FaStar, 
  FaUserShield, FaBan, FaCheck, FaWallet, FaTools 
} from 'react-icons/fa';

const initialProviders = [
  { id: 'PROV-501', name: 'Rajesh Kumar', category: 'Plumber', phone: '+91 94444 33333', email: 'rajesh.plumb@gmail.com', rating: 4.9, activeJobs: 1, online: true, wallet: '₹1,240', kycStatus: 'Verified', status: 'Active' },
  { id: 'PROV-502', name: 'Suresh Singh', category: 'Electrician', phone: '+91 92222 11111', email: 'suresh.spark@gmail.com', rating: 4.8, activeJobs: 0, online: true, wallet: '₹890', kycStatus: 'Verified', status: 'Active' },
  { id: 'PROV-503', name: 'Sunita Devi', category: 'House Help / Maid', phone: '+91 97777 66666', email: 'sunita.maid@yahoo.com', rating: 4.7, activeJobs: 0, online: false, wallet: '₹4,500', kycStatus: 'Verified', status: 'Blocked' },
  { id: 'PROV-504', name: 'Manoj Yadav', category: 'Painter', phone: '+91 96666 55555', email: 'manoj.paint@gmail.com', rating: 4.5, activeJobs: 2, online: true, wallet: '₹2,100', kycStatus: 'Pending Review', status: 'Active' },
  { id: 'PROV-505', name: 'Karan Johar', category: 'Electrician', phone: '+91 88888 99999', email: 'karan.elect@gmail.com', rating: 0.0, activeJobs: 0, online: false, wallet: '₹0', kycStatus: 'Pending Review', status: 'Active' }
];

export default function Providers() {
  const [providers, setProviders] = useState(initialProviders);
  const [search, setSearch] = useState('');

  const toggleBlockStatus = (provider) => {
    const isBlocking = provider.status === 'Active';
    Swal.fire({
      title: isBlocking ? 'Block Partner?' : 'Activate Partner?',
      text: `Are you sure you want to ${isBlocking ? 'block' : 'unblock'} ${provider.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isBlocking ? '#ef4444' : '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: isBlocking ? 'Yes, Block!' : 'Yes, Activate!',
    }).then((result) => {
      if (result.isConfirmed) {
        setProviders(providers.map(p => 
          p.id === provider.id ? { ...p, status: isBlocking ? 'Blocked' : 'Active' } : p
        ));
        Swal.fire(
          isBlocking ? 'Blocked!' : 'Activated!',
          `${provider.name} status updated.`,
          'success'
        );
      }
    });
  };

  const viewKycDetails = (provider) => {
    Swal.fire({
      title: 'KYC Document Verification',
      html: `
        <div class="text-left space-y-4 text-sm">
          <p><b>Name:</b> ${provider.name}</p>
          <p><b>Verification Status:</b> ${provider.kycStatus}</p>
          <p><b>ID Upload:</b> Aadhar Card / Pan Card</p>
          <div class="h-40 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center text-slate-400">
             [ Mock KYC ID Card Image ]
          </div>
        </div>
      `,
      confirmButtonText: provider.kycStatus === 'Verified' ? 'Close' : 'Approve KYC',
      confirmButtonColor: '#13264d',
      showCancelButton: provider.kycStatus !== 'Verified',
      cancelButtonText: 'Reject KYC',
      cancelButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed && provider.kycStatus !== 'Verified') {
        setProviders(providers.map(p => 
          p.id === provider.id ? { ...p, kycStatus: 'Verified' } : p
        ));
        Swal.fire('Approved!', 'KYC verified successfully.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        setProviders(providers.map(p => 
          p.id === provider.id ? { ...p, kycStatus: 'Rejected' } : p
        ));
        Swal.fire('Rejected!', 'KYC rejected.', 'error');
      }
    });
  };

  const filtered = providers.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search)
  );

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
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-700">{p.category}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      p.online ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.online ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      <span>{p.online ? 'Online' : 'Offline'}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-amber-500 text-xs font-bold space-x-1">
                      <FaStar />
                      <span>{p.rating > 0 ? p.rating : 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1 text-slate-700 font-bold">
                      <FaWallet className="text-slate-400 text-xs" />
                      <span>{p.wallet}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span 
                      onClick={() => viewKycDetails(p)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold cursor-pointer transition border ${
                        p.kycStatus === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        p.kycStatus === 'Pending Review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {p.kycStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button 
                      onClick={() => toggleBlockStatus(p)}
                      className={`p-2 rounded-lg border transition ${
                        p.status === 'Active' 
                          ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                      }`}
                      title={p.status === 'Active' ? 'Block Captain' : 'Unblock Captain'}
                    >
                      {p.status === 'Active' ? <FaBan className="text-xs" /> : <FaCheck className="text-xs" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
