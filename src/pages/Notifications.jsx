import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaPaperPlane, FaBell, FaUsers, FaTools, FaHistory, FaBullhorn } from 'react-icons/fa';

const initialHistory = [
  { id: 1, title: 'Monsoon Safety Guidelines', body: 'Please wear protective gear during rains.', target: 'Providers', date: 'July 14, 2026' },
  { id: 2, title: 'Flat 10% Off on House Cleaning', body: 'Use coupon code HOUSE10 for professional cleaning services.', target: 'Customers', date: 'July 13, 2026' },
  { id: 3, title: 'Server Maintenance Notice', body: 'Platform will be offline on Sunday midnight.', target: 'All', date: 'July 10, 2026' }
];

export default function Notifications() {
  const [history, setHistory] = useState(initialHistory);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('All');

  const handleSend = (e) => {
    e.preventDefault();
    if (!title || !body) {
      Swal.fire('Error', 'Please fill in both title and message body!', 'error');
      return;
    }

    Swal.fire({
      title: 'Broadcast Notification?',
      text: `Send push alert to target: ${target}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send Now!',
      confirmButtonColor: '#13264d',
      cancelButtonColor: '#64748b'
    }).then((result) => {
      if (result.isConfirmed) {
        const newNotification = {
          id: history.length + 1,
          title,
          body,
          target,
          date: 'Just now'
        };
        setHistory([newNotification, ...history]);
        setTitle('');
        setBody('');
        Swal.fire('Broadcast Sent!', 'Notification has been pushed to devices successfully.', 'success');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Notification Desk</h1>
        <p className="text-slate-500 text-sm">Send broadcast system alerts and push notifications to users and partners</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form composer */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h4 className="font-bold text-slate-800 flex items-center space-x-2">
            <FaBullhorn className="text-brand-gold" />
            <span>Compose Broadcast</span>
          </h4>

          <form onSubmit={handleSend} className="space-y-4">
            {/* Target Audience */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase">Target Audience</label>
              <div className="grid grid-cols-3 gap-2">
                {['All', 'Customers', 'Providers'].map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setTarget(aud)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      target === aud 
                        ? 'bg-brand-navy text-white border-brand-navy' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase">Alert Title</label>
              <input 
                type="text" 
                placeholder="e.g. System Update / Special Discount"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase">Message Body</label>
              <textarea 
                rows="4"
                placeholder="Enter description detail for notification push..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition resize-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-brand-gold text-brand-navy font-bold py-3 rounded-xl shadow-md shadow-brand-gold/15 hover:bg-brand-gold-light transition"
            >
              <FaPaperPlane className="text-xs" />
              <span>Broadcast Now</span>
            </button>
          </form>
        </div>

        {/* History Log */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 space-y-4">
          <h4 className="font-bold text-slate-800 flex items-center space-x-2">
            <FaHistory className="text-slate-400" />
            <span>Broadcast History Log</span>
          </h4>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {history.map((n) => (
              <div key={n.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-4">
                <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                  <FaBell />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-slate-800 text-sm">{n.title}</h5>
                    <span className="text-[10px] text-slate-400 font-semibold">{n.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.body}</p>
                  <div className="pt-2 flex items-center space-x-2">
                    <span className="inline-block bg-brand-navy/10 text-brand-navy text-[10px] font-bold px-2 py-0.5 rounded">
                      Audience: {n.target}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
