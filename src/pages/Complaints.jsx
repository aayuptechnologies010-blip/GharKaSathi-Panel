import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaExclamationTriangle, FaCheck, FaInfoCircle, FaSearch, FaUser, FaTools } from 'react-icons/fa';
import { api } from '../services/api';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      // If filter is Pending, query status=open. If Resolved, query status=resolved
      let params = {};
      if (filter === 'Pending') {
        params.status = 'open';
      } else if (filter === 'Resolved') {
        params.status = 'resolved';
      }
      const data = await api.getComplaints(params);
      setComplaints(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Tickets',
        text: error.message || 'Something went wrong.',
        confirmButtonColor: '#13264d'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const handleResolve = (complaint) => {
    Swal.fire({
      title: 'Resolve Support Ticket',
      input: 'textarea',
      inputPlaceholder: 'Enter resolution details and action taken...',
      inputLabel: `Investigation details for COMP-${complaint._id.slice(-6).toUpperCase()}`,
      showCancelButton: true,
      confirmButtonText: 'Mark Resolved',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      inputValidator: (value) => {
        if (!value) {
          return 'Please provide resolution notes!';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const resolvedTicket = await api.resolveComplaint(complaint._id, {
            status: 'resolved',
            adminNote: result.value
          });

          // Update state locally
          setComplaints(complaints.map(c => 
            c._id === complaint._id ? { ...c, status: 'resolved', adminNote: result.value } : c
          ));

          Swal.fire({
            title: 'Resolved!',
            text: 'Support ticket has been marked as resolved.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          Swal.fire('Error', error.message || 'Failed to resolve ticket', 'error');
        }
      }
    });
  };

  // Local text search filter
  const filteredComplaints = complaints.filter(comp => {
    const customerName = comp.bookingId?.userId?.name || '';
    const providerName = comp.bookingId?.providerId?.name || '';
    const issueSubject = comp.subject || '';
    const issueDescription = comp.description || '';

    return customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           issueSubject.toLowerCase().includes(searchQuery.toLowerCase()) ||
           issueDescription.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Complaint Desk</h1>
          <p className="text-slate-500 text-sm">Monitor support tickets and resolve customer complaints</p>
        </div>

        {/* Tab Filter */}
        <div className="bg-white p-1.5 rounded-xl border flex shadow-sm">
          {['All', 'Pending', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setFilter(tab); setSearchQuery(''); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                filter === tab 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-3.5 text-slate-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search tickets by name or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold self-end md:self-auto">
          Showing {filteredComplaints.length} of {complaints.length} entries
        </div>
      </div>

      {/* Data Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-slate-950"></div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Fetching Tickets...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p>No complaints found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Ticket ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Assigned Provider</th>
                  <th className="py-4 px-6">Issue & Description</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredComplaints.map((comp) => {
                  const displayId = `COMP-${comp._id.slice(-6).toUpperCase()}`;
                  const customerName = comp.bookingId?.userId?.name || 'GKS User';
                  const providerName = comp.bookingId?.providerId?.name 
                    ? `${comp.bookingId.providerId.name} (${comp.bookingId.categoryId?.name || 'Partner'})`
                    : 'Unassigned';
                  const subject = comp.subject || 'GKS Complaint';
                  const description = comp.description || 'No detailed explanation provided.';
                  const isResolved = comp.status === 'resolved';

                  return (
                    <tr key={comp._id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-mono text-xs text-slate-500">{displayId}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <FaUser className="text-slate-400 text-xs" />
                          <span className="font-bold text-slate-800">{customerName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-700">
                        <div className="flex items-center space-x-2">
                          <FaTools className="text-slate-400 text-xs" />
                          <span>{providerName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 max-w-sm">
                        <div>
                          <p className="font-semibold text-slate-800 text-xs">{subject}</p>
                          <p className="text-xs text-slate-500 mt-1 italic">"{description}"</p>
                          {isResolved && comp.adminNote && (
                            <div className="mt-2 bg-emerald-50 text-emerald-800 p-2 rounded-xl text-[10px] border border-emerald-100 flex items-start space-x-1.5">
                              <FaInfoCircle className="mt-0.5" />
                              <span><b>Resolution:</b> {comp.adminNote}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          !isResolved 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {!isResolved ? 'Pending' : 'Resolved'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!isResolved ? (
                          <button 
                            onClick={() => handleResolve(comp)}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                          >
                            <FaCheck />
                            <span>Resolve</span>
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600">Complete</span>
                        )}
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
