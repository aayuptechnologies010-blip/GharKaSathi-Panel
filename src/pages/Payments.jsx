import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { 
  FaMoneyBillWave, FaArrowAltCircleUp, FaArrowAltCircleDown, 
  FaFilter, FaSearch, FaCheck, FaExclamationTriangle, FaDownload 
} from 'react-icons/fa';

const initialTransactions = [
  { id: 'TXN-9021', customer: 'Amit Sharma', provider: 'Rajesh Kumar', amount: 450, commission: 45, date: 'July 15, 2026', status: 'Completed', type: 'Credit' },
  { id: 'TXN-9020', customer: 'Priya Patel', provider: 'Suresh Singh', amount: 600, commission: 72, date: 'July 15, 2026', status: 'Completed', type: 'Credit' },
  { id: 'TXN-9019', customer: 'Rohan Verma', provider: 'Sunita Devi', amount: 1200, commission: 60, date: 'July 14, 2026', status: 'Pending Payout', type: 'Pending Payout' },
  { id: 'TXN-9018', customer: 'Karan Malhotra', provider: 'Manoj Yadav', amount: 2500, commission: 375, date: 'July 14, 2026', status: 'Completed', type: 'Credit' },
  { id: 'TXN-9017', customer: 'Ritu Sen', provider: 'Karan Johar', amount: 800, commission: 96, date: 'July 13, 2026', status: 'Pending Payout', type: 'Pending Payout' }
];

export default function Payments() {
  const [txns, setTxns] = useState(initialTransactions);
  const [filter, setFilter] = useState('All');

  const handleProcessPayout = (txn) => {
    Swal.fire({
      title: 'Process Partner Payout?',
      text: `Process payout of ₹${txn.amount - txn.commission} to ${txn.provider}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Transfer!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setTxns(txns.map(t => 
          t.id === txn.id ? { ...t, status: 'Completed', type: 'Credit' } : t
        ));
        Swal.fire('Transferred!', 'Payout processed and bank transfer initialized.', 'success');
      }
    });
  };

  const handlePayoutAll = () => {
    const pendings = txns.filter(t => t.status === 'Pending Payout');
    if (pendings.length === 0) {
      Swal.fire('No Pending Payouts', 'All partner payouts are currently up-to-date.', 'info');
      return;
    }

    Swal.fire({
      title: 'Payout All Partners?',
      text: `Are you sure you want to process ${pendings.length} pending payouts?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Payout All!',
    }).then((result) => {
      if (result.isConfirmed) {
        setTxns(txns.map(t => 
          t.status === 'Pending Payout' ? { ...t, status: 'Completed', type: 'Credit' } : t
        ));
        Swal.fire('Success!', 'All pending payouts have been processed successfully.', 'success');
      }
    });
  };

  const filteredTxns = txns.filter(t => {
    if (filter === 'All') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Payments & Payouts</h1>
          <p className="text-slate-500 text-sm">Monitor commission metrics, customer billing, and partner settlements</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handlePayoutAll}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-500/10 transition text-sm"
          >
            Process All Payouts
          </button>
          <button 
            onClick={() => Swal.fire('Downloaded!', 'Payment reports PDF export initiated.', 'success')}
            className="flex items-center space-x-2 bg-white hover:bg-slate-50 border text-slate-700 font-semibold px-4 py-2.5 rounded-xl shadow-sm transition text-sm"
          >
            <FaDownload className="text-xs" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Metrics Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl">
            <FaMoneyBillWave className="text-2xl" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Total Commission Earned</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">₹34,520</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <FaArrowAltCircleUp className="text-2xl" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Pending Partner Payouts</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">
              ₹{txns.filter(t => t.status === 'Pending Payout').reduce((acc, curr) => acc + (curr.amount - curr.commission), 0)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <FaArrowAltCircleDown className="text-2xl" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase">Settled payouts</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">₹2,85,600</h3>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h4 className="font-bold text-slate-800">Transaction Registry</h4>
          <div className="flex space-x-2">
            {['All', 'Completed', 'Pending Payout'].map((statusOption) => (
              <button 
                key={statusOption}
                onClick={() => setFilter(statusOption)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  filter === statusOption 
                    ? 'bg-sky-500 text-white border-sky-500 shadow-sm' 
                    : 'text-slate-600 bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                {statusOption}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Txn ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Partner</th>
                <th className="py-4 px-6">Order Total</th>
                <th className="py-4 px-6">Platform Fee</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Settlement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTxns.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-semibold text-slate-700">{t.id}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{t.customer}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{t.provider}</td>
                  <td className="py-4 px-6 font-bold text-slate-800">₹{t.amount}</td>
                  <td className="py-4 px-6 font-semibold text-sky-600">₹{t.commission}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      t.status === 'Completed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {t.status === 'Pending Payout' ? (
                      <button 
                        onClick={() => handleProcessPayout(t)}
                        className="text-xs bg-sky-50 text-sky-600 hover:bg-sky-100 px-3 py-1.5 rounded-lg font-bold border border-sky-200 transition"
                      >
                        Payout Partner
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold flex items-center justify-end space-x-1">
                        <FaCheck className="text-emerald-500" />
                        <span>Settled</span>
                      </span>
                    )}
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
