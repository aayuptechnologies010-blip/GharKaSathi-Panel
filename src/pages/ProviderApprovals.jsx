import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { 
  FaUserCheck, FaUserTimes, FaIdCard, FaMapMarkerAlt, 
  FaPhoneAlt, FaEnvelope, FaExclamationCircle 
} from 'react-icons/fa';

const initialPendingProviders = [
  {
    id: 'SP-1092',
    name: 'Vikram Singh',
    category: 'Plumber',
    phone: '+91 98765 43210',
    email: 'vikram.singh@gmail.com',
    experience: '5 Years',
    location: 'Sector 62, Noida',
    appliedDate: 'July 14, 2026',
    status: 'Pending Verification',
    docType: 'Aadhaar Card',
    docNumber: 'XXXX-XXXX-8912',
    docUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
  },
  {
    id: 'SP-1093',
    name: 'Sunita Sharma',
    category: 'Baby Care / Nanny',
    phone: '+91 91234 56789',
    email: 'sunita.care@yahoo.com',
    experience: '3 Years',
    location: 'Indirapuram, Ghaziabad',
    appliedDate: 'July 15, 2026',
    status: 'Pending Verification',
    docType: 'Pan Card',
    docNumber: 'XXXXX1234X',
    docUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
  },
  {
    id: 'SP-1094',
    name: 'Karan Johar',
    category: 'Electrician',
    phone: '+91 88888 99999',
    email: 'karan.spark@gmail.com',
    experience: '8 Years',
    location: 'Rohini, Delhi',
    appliedDate: 'July 15, 2026',
    status: 'Pending Verification',
    docType: 'Aadhaar Card',
    docNumber: 'XXXX-XXXX-4567',
    docUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400'
  }
];

export default function ProviderApprovals() {
  const [providers, setProviders] = useState(initialPendingProviders);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleApprove = (provider) => {
    Swal.fire({
      title: 'Approve Service Provider?',
      text: `Are you sure you want to approve ${provider.name} as a verified ${provider.category}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Approve!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setProviders(providers.filter(p => p.id !== provider.id));
        setSelectedProvider(null);
        Swal.fire({
          title: 'Approved!',
          text: `${provider.name} is now an active partner on Ghar Ka Sathi.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
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
    }).then((result) => {
      if (result.isConfirmed) {
        setProviders(providers.filter(p => p.id !== provider.id));
        setSelectedProvider(null);
        Swal.fire({
          title: 'Rejected!',
          text: `Application has been rejected. Reason: ${result.value}`,
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Partner Approvals</h1>
        <p className="text-slate-500 text-sm">Review registration applications of incoming service providers</p>
      </div>

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
                  {providers.map((p) => (
                    <tr 
                      key={p.id} 
                      className={`hover:bg-slate-50/50 cursor-pointer transition ${
                        selectedProvider?.id === p.id ? 'bg-sky-50/40 border-l-2 border-sky-500' : ''
                      }`}
                      onClick={() => setSelectedProvider(p)}
                    >
                      <td className="py-4 font-semibold text-slate-700">
                        <div>
                          <p>{p.name}</p>
                          <p className="text-xs font-normal text-slate-400">{p.id}</p>
                        </div>
                      </td>
                      <td className="py-4 text-slate-600">{p.category}</td>
                      <td className="py-4 text-slate-500">{p.location}</td>
                      <td className="py-4 text-slate-500">{p.appliedDate}</td>
                      <td className="py-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleApprove(p)}
                          className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition"
                          title="Approve Profile"
                        >
                          <FaUserCheck className="text-sm" />
                        </button>
                        <button 
                          onClick={() => handleReject(p)}
                          className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                          title="Reject Profile"
                        >
                          <FaUserTimes className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
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
                  {selectedProvider.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">{selectedProvider.name}</h5>
                  <span className="inline-block bg-sky-50 text-sky-700 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                    {selectedProvider.category}
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-y border-slate-100 py-4 text-sm text-slate-600">
                <div className="flex items-center space-x-3">
                  <FaPhoneAlt className="text-slate-400 w-4" />
                  <span>{selectedProvider.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-slate-400 w-4" />
                  <span className="truncate">{selectedProvider.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaMapMarkerAlt className="text-slate-400 w-4" />
                  <span>{selectedProvider.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaIdCard className="text-slate-400 w-4" />
                  <span>{selectedProvider.docType}: <b>{selectedProvider.docNumber}</b></span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Uploaded Document Proof</p>
                <div className="relative rounded-xl overflow-hidden group border border-slate-100 h-36">
                  <img 
                    src={selectedProvider.docUrl} 
                    alt="Document" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <span className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">View Large</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleReject(selectedProvider)}
                  className="py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-sm transition"
                >
                  Reject Application
                </button>
                <button 
                  onClick={() => handleApprove(selectedProvider)}
                  className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition shadow-sm shadow-emerald-500/20"
                >
                  Approve Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p>Select a provider from the list to view their verification details & document proof.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
