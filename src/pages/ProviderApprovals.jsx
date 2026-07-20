import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  FaUserCheck, FaUserTimes, FaIdCard, FaMapMarkerAlt, 
  FaPhoneAlt, FaEnvelope, FaExclamationCircle 
} from 'react-icons/fa';
import { api } from '../services/api';

export default function ProviderApprovals() {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch pending providers
  const fetchPendingProviders = async () => {
    setLoading(true);
    try {
      // Fetch only unapproved providers
      const data = await api.getProviders({ approved: false });
      setProviders(data);
      if (data.length > 0) {
        setSelectedProvider(data[0]);
      } else {
        setSelectedProvider(null);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Applications',
        text: error.message || 'Something went wrong.',
        confirmButtonColor: '#13264d'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const handleApprove = (provider) => {
    const categoryName = provider.categories && provider.categories[0]?.name || 'Service Partner';
    
    Swal.fire({
      title: 'Approve Service Provider?',
      text: `Are you sure you want to approve ${provider.name} as a verified ${categoryName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Approve!',
      cancelButtonText: 'Cancel'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.approveProvider(provider._id);
          setProviders(providers.filter(p => p._id !== provider._id));
          if (selectedProvider?._id === provider._id) {
            setSelectedProvider(null);
          }
          Swal.fire({
            title: 'Approved!',
            text: `${provider.name} is now an active partner on Ghar Ka Sathi.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Approval Failed',
            text: error.message || 'Something went wrong.',
            confirmButtonColor: '#13264d'
          });
        }
      }
    });
  };

  const handleReject = (provider) => {
    Swal.fire({
      title: 'Reject Registration?',
      text: 'Please enter the reason for rejecting this service provider:',
      input: 'text',
      inputPlaceholder: 'e.g., Invalid document photo, incomplete profile...',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Reject Request',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write a rejection reason!';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // In Postman there is no direct separate reject endpoint, 
          // usually rejection is suspending or deleting provider application.
          // Since suspend works on provider, we will suspend them or show warning.
          await api.suspendProvider(provider._id);
          setProviders(providers.filter(p => p._id !== provider._id));
          if (selectedProvider?._id === provider._id) {
            setSelectedProvider(null);
          }
          Swal.fire({
            title: 'Rejected!',
            text: `Application has been rejected. Reason: ${result.value}`,
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Rejection Failed',
            text: error.message || 'Something went wrong.',
            confirmButtonColor: '#13264d'
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Partner Approvals</h1>
        <p className="text-slate-500 text-sm">Review registration applications of incoming service providers</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-slate-950"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Loading Applications Queue...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Table of Applications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-800">Pending Requests ({providers.length})</h4>
            </div>
            {providers.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <FaExclamationCircle className="mx-auto text-4xl text-slate-300" />
                <p className="font-medium">No pending approvals found!</p>
                <p className="text-xs">All registration requests have been processed.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider pb-3">
                      <th className="pb-3">Applicant</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Date Applied</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {providers.map((p) => {
                      const categoryName = p.categories && p.categories[0]?.name || 'Service Partner';
                      const locationText = typeof p.location === 'object' ? (p.location?.text || 'N/A') : (p.location || 'N/A');
                      const appliedDate = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A';

                      return (
                        <tr 
                          key={p._id} 
                          className={`hover:bg-slate-50/50 cursor-pointer transition ${
                            selectedProvider?._id === p._id ? 'bg-sky-50/40 border-l-2 border-sky-500' : ''
                          }`}
                          onClick={() => setSelectedProvider(p)}
                        >
                          <td className="py-4 font-semibold text-slate-700">
                            <div>
                              <p>{p.name || 'GKS Partner'}</p>
                              <p className="text-[10px] font-mono text-slate-400 font-normal">ID: {p._id}</p>
                            </div>
                          </td>
                          <td className="py-4 text-slate-600">{categoryName}</td>
                          <td className="py-4 text-slate-500">{locationText}</td>
                          <td className="py-4 text-slate-500">{appliedDate}</td>
                          <td className="py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => handleApprove(p)}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                              title="Approve Profile"
                            >
                              <FaUserCheck className="text-sm" />
                            </button>
                            <button 
                              onClick={() => handleReject(p)}
                              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                              title="Reject Profile"
                            >
                              <FaUserTimes className="text-sm" />
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

          {/* Verification Detail Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4">Application Details</h4>
            {selectedProvider ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-2xl text-white flex items-center justify-center font-bold text-xl">
                    {(selectedProvider.name || 'G').charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">{selectedProvider.name || 'GKS Partner'}</h5>
                    <span className="inline-block bg-sky-50 text-sky-700 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                      {selectedProvider.categories && selectedProvider.categories[0]?.name || 'Service Partner'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex items-center space-x-2.5 text-xs text-slate-600">
                    <FaPhoneAlt className="text-slate-400" />
                    <span>{selectedProvider.phone || selectedProvider.phoneNumber || 'N/A'}</span>
                  </div>
                  {selectedProvider.email && (
                    <div className="flex items-center space-x-2.5 text-xs text-slate-600">
                      <FaEnvelope className="text-slate-400" />
                      <span>{selectedProvider.email}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2.5 text-xs text-slate-600">
                    <FaMapMarkerAlt className="text-slate-400" />
                    <span>{typeof selectedProvider.location === 'object' ? (selectedProvider.location?.text || 'N/A') : (selectedProvider.location || 'N/A')}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">KYC Document Uploaded</p>
                    <div className="flex items-center space-x-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <FaIdCard className="text-sky-500 text-lg" />
                      <div>
                        <p className="text-xs font-bold text-slate-700">KYC Documents</p>
                        <p className="text-[10px] text-slate-400">Review doc credentials below</p>
                      </div>
                    </div>
                  </div>

                  {selectedProvider.documents && selectedProvider.documents.length > 0 ? (
                    <div>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Uploaded Document Previews</p>
                      <div className="space-y-2">
                        {selectedProvider.documents.map((doc, idx) => {
                          const uploadsBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://gharkasathi-backend.onrender.com/api').replace('/api', '/uploads');
                          return (
                            <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                              <img 
                                src={doc.startsWith('http') ? doc : `${uploadsBaseUrl}/${doc}`} 
                                alt={`KYC Document ${idx + 1}`}
                                className="w-full h-auto max-h-40 object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400';
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                      <FaExclamationCircle className="text-2xl mb-1" />
                      <span className="text-xs">No documents uploaded</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => handleApprove(selectedProvider)}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/10 transition cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <FaUserCheck />
                    <span>Approve Application</span>
                  </button>
                  <button 
                    onClick={() => handleReject(selectedProvider)}
                    className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-500/10 transition cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <FaUserTimes />
                    <span>Reject Request</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">
                <p className="text-sm">Select an applicant to review details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
