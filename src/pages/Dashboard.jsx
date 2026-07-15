import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { 
  FaUsers, FaMoneyBillWave, FaClock, FaCheckCircle, FaStar, 
  FaWrench, FaTools, FaBolt, FaPaintRoller, FaUserCheck 
} from 'react-icons/fa';

// Mock Data
const revenueData = [
  { name: 'Jan', bookings: 400, revenue: 2400 },
  { name: 'Feb', bookings: 500, revenue: 3500 },
  { name: 'Mar', bookings: 750, revenue: 5800 },
  { name: 'Apr', bookings: 900, revenue: 7200 },
  { name: 'May', bookings: 1200, revenue: 9500 },
  { name: 'Jun', bookings: 1500, revenue: 12000 },
];

const categoryData = [
  { name: 'Plumbing', value: 400, color: '#0ea5e9' },
  { name: 'Electrician', value: 300, color: '#f59e0b' },
  { name: 'Cleaning/Maid', value: 350, color: '#10b981' },
  { name: 'Painting', value: 200, color: '#8b5cf6' },
  { name: 'Appliance Repair', value: 250, color: '#ec4899' },
];

const recentBookings = [
  { id: 'GS-8921', user: 'Amit Sharma', provider: 'Rajesh Kumar (Plumber)', service: 'Pipe Leakage Repair', amount: '₹450', status: 'Completed', date: 'Just now' },
  { id: 'GS-8920', user: 'Priya Patel', provider: 'Suresh Singh (Electrician)', service: 'Short Circuit Fix', amount: '₹600', status: 'In Progress', date: '10 mins ago' },
  { id: 'GS-8919', user: 'Rohan Verma', provider: 'Sunita Devi (House Help)', service: 'Full House Cleaning', amount: '₹1,200', status: 'Pending Approval', date: '30 mins ago' },
  { id: 'GS-8918', user: 'Karan Malhotra', provider: 'Manoj Yadav (Painter)', service: 'Wall Touch Up', amount: '₹2,500', status: 'Completed', date: '2 hours ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Real-time statistics & analytics for Ghar Ka Sathi</p>
        </div>
        <div className="text-sm font-semibold bg-white border px-4 py-2 rounded-xl text-slate-700 shadow-sm">
          July 15, 2026
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-md shadow-emerald-500/10 transform transition hover:-translate-y-0.5 cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Total Earnings</p>
              <h3 className="text-xl font-extrabold mt-0.5">₹3,45,200</h3>
            </div>
            <div className="p-2 bg-white/10 rounded-lg">
              <FaMoneyBillWave className="text-lg text-white" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center text-emerald-100 text-[11px]">
            <span className="font-semibold bg-emerald-400/20 px-1.5 py-0.5 rounded mr-1.5">+18.2%</span>
            <span>from last month</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-md shadow-blue-500/10 transform transition hover:-translate-y-0.5 cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-[10px] font-bold uppercase tracking-wider">Total Bookings</p>
              <h3 className="text-xl font-extrabold mt-0.5">4,890</h3>
            </div>
            <div className="p-2 bg-white/10 rounded-lg">
              <FaTools className="text-lg text-white" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center text-blue-100 text-[11px]">
            <span className="font-semibold bg-blue-400/20 px-1.5 py-0.5 rounded mr-1.5">+12.4%</span>
            <span>from last month</span>
          </div>
        </div>

        {/* Active Providers */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white shadow-md shadow-amber-500/10 transform transition hover:-translate-y-0.5 cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-100 text-[10px] font-bold uppercase tracking-wider">Active Providers</p>
              <h3 className="text-xl font-extrabold mt-0.5">324</h3>
            </div>
            <div className="p-2 bg-white/10 rounded-lg">
              <FaUserCheck className="text-lg text-white" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center text-amber-100 text-[11px]">
            <span className="font-semibold bg-amber-400/20 px-1.5 py-0.5 rounded mr-1.5">+8.5%</span>
            <span>new approvals today</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl p-4 text-white shadow-md shadow-rose-500/10 transform transition hover:-translate-y-0.5 cursor-pointer">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-rose-100 text-[10px] font-bold uppercase tracking-wider">Pending Approvals</p>
              <h3 className="text-xl font-extrabold mt-0.5">18</h3>
            </div>
            <div className="p-2 bg-white/10 rounded-lg">
              <FaClock className="text-lg text-white" />
            </div>
          </div>
          <div className="mt-2.5 flex items-center text-rose-100 text-[11px]">
            <span className="font-semibold bg-rose-400/20 px-1.5 py-0.5 rounded mr-1.5">Action Required</span>
            <span>Verify profiles</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Booking Area Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-slate-800">Booking & Revenue Trends</h4>
              <p className="text-slate-400 text-xs">Growth and scale over the last 6 months</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">Monthly View</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cf9b2d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#cf9b2d" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#cf9b2d" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (₹)" />
                <Area type="monotone" dataKey="bookings" stroke="#13264d" strokeWidth={2.5} fill="none" name="Bookings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (Pie Chart) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-2">Popular Categories</h4>
          <p className="text-slate-400 text-xs mb-6">Distribution of bookings by category</p>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-4">
            {categoryData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 font-medium truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings & Providers */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-slate-800">Recent Bookings</h4>
              <p className="text-slate-400 text-xs">Live tracking of service orders</p>
            </div>
            <button className="text-xs text-sky-600 font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider pb-3">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Provider</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 font-semibold text-slate-700">{b.id}</td>
                    <td className="py-4 text-slate-600">{b.user}</td>
                    <td className="py-4 text-slate-600">{b.provider}</td>
                    <td className="py-4 font-bold text-slate-800">{b.amount}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        b.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        b.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Service Providers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-2">Top Rated Partners</h4>
          <p className="text-slate-400 text-xs mb-6">Our highest reviewed service providers</p>
          <div className="space-y-4">
            {[
              { name: 'Rajesh Kumar', role: 'Plumber', rating: '4.9', jobs: '243', img: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150' },
              { name: 'Sunita Devi', role: 'House Help', rating: '4.8', jobs: '412', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
              { name: 'Suresh Singh', role: 'Electrician', rating: '4.8', jobs: '189', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' }
            ].map((p, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                <div className="flex items-center space-x-3">
                  <img src={p.img} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-semibold text-slate-700 text-sm">{p.name}</h5>
                    <p className="text-xs text-slate-400">{p.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-amber-500 font-bold text-sm space-x-1">
                    <FaStar className="text-xs" />
                    <span>{p.rating}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{p.jobs} jobs completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
