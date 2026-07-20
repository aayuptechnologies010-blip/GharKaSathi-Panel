import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { 
  FaMapMarkerAlt, FaUser, FaTools, FaCheckCircle, 
  FaSpinner, FaCircle, FaChevronRight, FaRegClock, FaRoute, FaSearch
} from 'react-icons/fa';
import { api } from '../services/api';

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

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch Bookings from Analytics Endpoint
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const analyticsData = await api.getAnalytics();
      const rawBookings = analyticsData.recentBookings || analyticsData.bookings || [];
      setBookings(rawBookings);
      if (rawBookings.length > 0) {
        setSelectedBooking(rawBookings[0]);
      } else {
        setSelectedBooking(null);
      }
    } catch (error) {
      console.warn("Bookings listing failed, initializing empty logs.", error);
      setBookings([]);
      setSelectedBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter Bookings by Search
  const filteredBookings = bookings.filter(b => {
    const customer = b.userId?.name || 'GKS User';
    const provider = b.providerId?.name || 'Unassigned';
    const categoryName = b.categoryId?.name || '';
    const bookingId = b._id || '';

    return customer.toLowerCase().includes(search.toLowerCase()) ||
           provider.toLowerCase().includes(search.toLowerCase()) ||
           categoryName.toLowerCase().includes(search.toLowerCase()) ||
           bookingId.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Bookings Monitor</h1>
        <p className="text-slate-500 text-sm">Real-time status tracking and dispatch logs of ongoing services</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-slate-950"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Fetching Service Orders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Booking Directory Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-2 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h4 className="font-bold text-slate-800">Order Logs ({filteredBookings.length})</h4>
              <div className="relative w-full md:w-80">
                <FaSearch className="absolute left-3 top-3.5 text-slate-400 text-sm" />
                <input 
                  type="text" 
                  placeholder="Search by ID, user, provider..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
                />
              </div>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="text-center py-20 text-slate-400 text-xs">
                No active bookings found matching search query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider pb-3">
                      <th className="pb-3">Booking ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Provider</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                    {filteredBookings.map((b) => {
                      const displayId = b._id.startsWith('GS-') ? b._id : `GS-B${b._id?.slice(-4).toUpperCase()}`;
                      const customerName = b.userId?.name || 'GKS User';
                      const providerName = b.providerId?.name 
                        ? `${b.providerId.name} (${b.categoryId?.name || 'Partner'})` 
                        : 'Pending Acceptance';
                      const displayPrice = b.price ? `₹${b.price}` : 'N/A';
                      const statusText = b.status || 'pending';

                      return (
                        <tr 
                          key={b._id} 
                          className={`hover:bg-slate-50/50 cursor-pointer transition ${
                            selectedBooking?._id === b._id ? 'bg-sky-50/40 border-l-2 border-sky-500 font-semibold' : ''
                          }`}
                          onClick={() => setSelectedBooking(b)}
                        >
                          <td className="py-4 font-mono">{displayId}</td>
                          <td className="py-4 text-slate-800 font-bold">{customerName}</td>
                          <td className="py-4">{providerName}</td>
                          <td className="py-4 font-bold text-slate-800">{displayPrice}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              statusText.toLowerCase() === 'completed' || statusText.toLowerCase() === 'closed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : statusText.toLowerCase() === 'in-progress' || statusText.toLowerCase() === 'accepted' || statusText.toLowerCase() === 'work started'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {statusText.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Booking Tracking Panel */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4">Live Dispatch Status</h4>
            {selectedBooking ? (
              <div className="space-y-6">
                <div>
                  <h5 className="font-mono text-sm font-bold text-slate-800">
                    {selectedBooking._id.startsWith('GS-') ? selectedBooking._id : `GS-B${selectedBooking._id.slice(-6).toUpperCase()}`}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">Scheduled for: {selectedBooking.scheduledAt ? new Date(selectedBooking.scheduledAt).toLocaleString() : 'N/A'}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
                  <div className="flex items-start space-x-2.5">
                    <FaUser className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">{selectedBooking.userId?.name || 'GKS User'}</p>
                      <p className="text-[10px] text-slate-400">{selectedBooking.userId?.phone || 'No phone'}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <FaMapMarkerAlt className="text-slate-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-700">Service Location</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">{selectedBooking.address?.text || 'N/A'}</p>
                    </div>
                  </div>

                  {selectedBooking.providerId && (
                    <div className="flex items-start space-x-2.5 border-t border-slate-100 pt-3">
                      <FaTools className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800">{selectedBooking.providerId.name}</p>
                        <p className="text-[10px] text-slate-400">{selectedBooking.providerId.phone || 'No phone'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Service Workflow Tracker */}
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-4">Dispatch Lifecycle</p>
                  <div className="relative pl-6 space-y-4">
                    {/* Vertical connector line */}
                    <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>

                    {bookingLifecycle.map((stage, idx) => {
                      const statusText = (selectedBooking.status || 'pending').toLowerCase();
                      const currentIdx = bookingLifecycle.findIndex(x => x.toLowerCase() === statusText);
                      const isDone = idx <= (currentIdx === -1 ? 0 : currentIdx);

                      return (
                        <div key={idx} className="relative flex items-center space-x-3 text-xs">
                          <div className={`absolute -left-6 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center transition ${
                            isDone ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200'
                          }`}>
                            {isDone && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                          </div>
                          <span className={`font-semibold ${isDone ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs">
                Select a booking order to inspect live dispatch status.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
