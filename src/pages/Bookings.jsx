import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { 
  FaMapMarkerAlt, FaUser, FaTools, FaCheckCircle, 
  FaSpinner, FaCircle, FaChevronRight, FaRegClock, FaRoute 
} from 'react-icons/fa';

const bookingLifecycle = [
  'Pending', 
  'Broadcasted', 
  'Accepted', 
  'On The Way', 
  'Reached', 
  'Work Started', 
  'Work Completed', 
  'Payment Completed', 
  'Closed'
];

const initialBookings = [
  {
    id: 'GS-B902',
    customer: 'Rahul Sinha',
    phone: '+91 90876 54321',
    address: 'A-402, Green Valley Apartments, Noida Sector 78',
    provider: 'Rajesh Kumar (Plumber)',
    service: 'Kitchen Basin Repair',
    date: 'July 15, 2026 15:10',
    amount: '₹350',
    status: 'Accepted'
  },
  {
    id: 'GS-B903',
    customer: 'Preeti Deshmukh',
    phone: '+91 91111 22222',
    address: 'B-109, Windsor Court, Indirapuram, Ghaziabad',
    provider: 'Suresh Singh (Electrician)',
    service: 'AC Socket Short Circuit Fix',
    date: 'July 15, 2026 15:25',
    amount: '₹500',
    status: 'Work Started'
  },
  {
    id: 'GS-B901',
    customer: 'Varun Dhawan',
    phone: '+91 97777 55555',
    address: 'Flat 501, Tower C, DLF Phase 3, Gurugram',
    provider: 'Sunita Devi (Maid / House Help)',
    service: 'Deep Cleaning',
    date: 'July 15, 2026 14:05',
    amount: '₹1,500',
    status: 'Closed'
  },
  {
    id: 'GS-B904',
    customer: 'Ishita Roy',
    phone: '+91 98888 77777',
    address: 'C-72, Block C, Rohini Sector 11, Delhi',
    provider: 'Pending Broadcast Acceptance',
    service: 'Baby Sitting / Nanny (3 hours)',
    date: 'July 15, 2026 15:30',
    amount: '₹600',
    status: 'Broadcasted'
  }
];

export default function Bookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState(initialBookings[0]);

  const advanceStatus = (booking) => {
    const currentIndex = bookingLifecycle.indexOf(booking.status);
    if (currentIndex === -1 || currentIndex === bookingLifecycle.length - 1) return;
    
    const nextStatus = bookingLifecycle[currentIndex + 1];
    const updatedBookings = bookings.map(b => {
      if (b.id === booking.id) {
        return { ...b, status: nextStatus };
      }
      return b;
    });
    
    setBookings(updatedBookings);
    const updatedSelected = updatedBookings.find(b => b.id === booking.id);
    setSelectedBooking(updatedSelected);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Booking ${booking.id} transitioned to: ${nextStatus}`,
      showConfirmButton: false,
      timer: 2000
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Booking Monitoring Desk</h1>
        <p className="text-slate-500 text-sm">Monitor live service transactions and Rapido-style booking lifecycles</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Booking Registry List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-2">
          <h4 className="font-bold text-slate-800 mb-6">Live Track Registry</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider pb-3">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Partner assigned</th>
                  <th className="pb-3">Stage</th>
                  <th className="pb-3">Fare</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bookings.map((b) => (
                  <tr 
                    key={b.id} 
                    onClick={() => setSelectedBooking(b)}
                    className={`hover:bg-slate-50/50 cursor-pointer transition ${
                      selectedBooking?.id === b.id ? 'bg-sky-50/40 border-l-2 border-brand-navy' : ''
                    }`}
                  >
                    <td className="py-4 font-bold text-slate-700">{b.id}</td>
                    <td className="py-4 font-semibold text-slate-800">{b.customer}</td>
                    <td className="py-4 text-slate-600">{b.provider}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        b.status === 'Closed' ? 'bg-slate-100 text-slate-600' :
                        b.status === 'Payment Completed' ? 'bg-emerald-50 text-emerald-700' :
                        b.status === 'Work Started' || b.status === 'Work Completed' ? 'bg-amber-50 text-amber-700' :
                        'bg-sky-50 text-sky-700'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-slate-800">{b.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Lifecycle Tracking (Rapido workflow diagram) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-2">Live Progress Monitor</h4>
          <p className="text-slate-400 text-xs mb-6">Rapido Flow Adaptation Engine</p>

          {selectedBooking ? (
            <div className="space-y-6">
              {/* Detail block */}
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-800">{selectedBooking.id}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-lg">
                    {selectedBooking.service}
                  </span>
                </div>
                <div className="text-xs space-y-1.5 text-slate-600">
                  <p className="flex items-center space-x-2"><FaUser className="text-slate-400 w-3" /> <span><b>Client:</b> {selectedBooking.customer} ({selectedBooking.phone})</span></p>
                  <p className="flex items-center space-x-2"><FaMapMarkerAlt className="text-slate-400 w-3" /> <span className="truncate"><b>Address:</b> {selectedBooking.address}</span></p>
                  <p className="flex items-center space-x-2"><FaTools className="text-slate-400 w-3" /> <span><b>Partner:</b> {selectedBooking.provider}</span></p>
                </div>
              </div>

              {/* Lifecycle Progress Line */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Lifecycle Timeline</p>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {bookingLifecycle.map((stage, idx) => {
                    const currentIdx = bookingLifecycle.indexOf(selectedBooking.status);
                    const isPassed = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={stage} className="relative flex items-center justify-between text-xs">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2 bg-white transition ${
                          isPassed ? 'border-emerald-500 bg-emerald-500' :
                          isCurrent ? 'border-brand-gold bg-brand-gold ring-4 ring-brand-gold/10' :
                          'border-slate-300'
                        }`} />

                        <span className={`font-semibold ${
                          isPassed ? 'text-slate-400 line-through' :
                          isCurrent ? 'text-brand-gold font-bold text-sm' :
                          'text-slate-500'
                        }`}>
                          {stage}
                        </span>

                        {isCurrent && stage !== 'Closed' && (
                          <button 
                            onClick={() => advanceStatus(selectedBooking)}
                            className="bg-brand-navy hover:bg-brand-navy-light text-white text-[10px] font-bold px-2 py-1 rounded transition"
                          >
                            Advance
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-400">
              <p>Select a live booking to track lifecycle changes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
