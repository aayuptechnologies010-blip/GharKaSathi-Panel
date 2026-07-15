import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaExclamationTriangle, FaCheck, FaInfoCircle, FaSearch, FaUser, FaTools } from 'react-icons/fa';

const initialComplaints = [
  {
    id: 'COMP-101',
    customer: 'Amit Sharma',
    provider: 'Rajesh Kumar (Plumber)',
    issue: 'Provider was late by 2 hours and charged extra ₹200.',
    category: 'Billing Issue',
    date: 'July 14, 2026',
    status: 'Pending'
  },
  {
    id: 'COMP-102',
    customer: 'Priya Patel',
    provider: 'Suresh Singh (Electrician)',
    issue: 'The wall socket switch works intermittently after repairs.',
    category: 'Bad Service Quality',
    date: 'July 15, 2026',
    status: 'Pending'
  },
  {
    id: 'COMP-103',
    customer: 'Rohan Verma',
    provider: 'Sunita Devi (House Help)',
    issue: 'Provider canceled the booking at the last minute.',
    category: 'Cancellation',
    date: 'July 12, 2026',
    status: 'Resolved',
    resolutionNotes: 'Refunded safety fee and warned provider.'
  }
];

export default function Complaints() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [filter, setFilter] = useState('All');

  const handleResolve = (complaint) => {
    Swal.fire({
      title: 'Resolve Support Ticket',
      input: 'textarea',
      inputPlaceholder: 'Enter resolution details and action taken...',
      inputLabel: `Investigation details for ${complaint.id}`,
      showCancelButton: true,
      confirmButtonText: 'Mark Resolved',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      inputValidator: (value) => {
        if (!value) {
          return 'Please provide resolution notes!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setComplaints(complaints.map(c => 
          c.id === complaint.id ? { ...c, status: 'Resolved', resolutionNotes: result.value } : c
        ));
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Ticket ${complaint.id} resolved successfully!`,
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  };

  const filteredComplaints = complaints.filter(c => {
    if (filter === 'All') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Complaint Management</h1>
        <p className="text-slate-500 text-sm">Resolve disputes, complaints, and billing issues from users</p>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex space-x-2">
          {['All', 'Pending', 'Resolved'].map((statusOption) => (
            <button 
              key={statusOption}
              onClick={() => setFilter(statusOption)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                filter === statusOption 
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/10' 
                  : 'text-slate-600 bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              {statusOption} Tickets ({complaints.filter(c => statusOption === 'All' || c.status === statusOption).length})
            </button>
          ))}
        </div>
      </div>

      {/* Ticket List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl py-16 border border-slate-100 text-center text-slate-400">
            <FaExclamationTriangle className="mx-auto text-4xl text-slate-300 mb-2" />
            <p>No complaints matched your filter criteria.</p>
          </div>
        ) : (
          filteredComplaints.map((ticket) => (
            <div 
              key={ticket.id} 
              className={`bg-white rounded-2xl p-6 border transition hover:shadow-md flex flex-col md:flex-row md:items-start justify-between gap-6 ${
                ticket.status === 'Resolved' ? 'border-emerald-100 bg-emerald-50/5' : 'border-rose-100 bg-rose-50/5'
              }`}
            >
              <div className="space-y-4 max-w-3xl">
                {/* Header info */}
                <div className="flex items-center space-x-3">
                  <span className="font-extrabold text-slate-700 text-base">{ticket.id}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                    {ticket.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-400">{ticket.date}</span>
                </div>

                {/* Complaint Text */}
                <p className="text-slate-700 font-semibold leading-relaxed">"{ticket.issue}"</p>

                {/* User Roles details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="bg-white border rounded-xl p-3 flex items-center space-x-2">
                    <FaUser className="text-slate-400" />
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase">Customer</p>
                      <p className="text-slate-700">{ticket.customer}</p>
                    </div>
                  </div>

                  <div className="bg-white border rounded-xl p-3 flex items-center space-x-2">
                    <FaTools className="text-slate-400" />
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase">Service Partner</p>
                      <p className="text-slate-700">{ticket.provider}</p>
                    </div>
                  </div>
                </div>

                {/* Resolution text */}
                {ticket.status === 'Resolved' && (
                  <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-100 space-y-1">
                    <p className="font-bold flex items-center space-x-1">
                      <FaCheck />
                      <span>Resolution Action:</span>
                    </p>
                    <p className="italic">{ticket.resolutionNotes}</p>
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end gap-3 self-stretch border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  ticket.status === 'Resolved' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {ticket.status}
                </span>

                {ticket.status === 'Pending' && (
                  <button 
                    onClick={() => handleResolve(ticket)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm shadow-emerald-500/10"
                  >
                    Resolve Ticket
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
