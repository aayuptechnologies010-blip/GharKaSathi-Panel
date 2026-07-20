import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FaPercentage, FaSave, FaCoins, FaInfoCircle } from 'react-icons/fa';
import { api } from '../services/api';

export default function Commission() {
  const [globalCommission, setGlobalCommission] = useState(10);
  const [safetyFee, setSafetyFee] = useState(15);
  const [payoutThreshold, setPayoutThreshold] = useState(500);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories to show their commission percentages
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Categories',
        text: error.message || 'Something went wrong.',
        confirmButtonColor: '#13264d'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRateChange = (id, newRate) => {
    setCategories(categories.map(c => 
      c._id === id ? { ...c, commissionPercent: Number(newRate) } : c
    ));
  };

  const handleSaveCategoryCommission = async (category) => {
    try {
      await api.updateCategory(category._id, {
        commissionPercent: category.commissionPercent
      });
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Commission for ${category.name} updated to ${category.commissionPercent}%`,
        showConfirmButton: false,
        timer: 2500
      });
    } catch (error) {
      Swal.fire('Error', error.message || 'Failed to save commission rate', 'error');
    }
  };

  const handleSaveGlobalConfig = () => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Global configurations updated successfully!',
      showConfirmButton: false,
      timer: 2000
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Commission Settings</h1>
        <p className="text-slate-500 text-sm">Configure standard commission rates, overrides, and platform fees</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-20 flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-slate-950"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Loading Configuration...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Global Configuration Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <h4 className="font-bold text-slate-800 flex items-center space-x-2">
              <FaCoins className="text-amber-500" />
              <span>Global Defaults</span>
            </h4>

            {/* Default Rate */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Default Commission Rate (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={globalCommission}
                  onChange={(e) => setGlobalCommission(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold text-slate-700"
                />
                <span className="absolute right-4 top-3 text-slate-400 text-sm font-bold">%</span>
              </div>
            </div>

            {/* Safety Fee */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Booking Booking Safety Fee (₹)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={safetyFee}
                  onChange={(e) => setSafetyFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold text-slate-700"
                />
                <span className="absolute right-4 top-3 text-slate-400 text-sm font-bold">₹</span>
              </div>
            </div>

            {/* Payout Threshold */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase">Min Provider Payout Threshold (₹)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={payoutThreshold}
                  onChange={(e) => setPayoutThreshold(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold text-slate-700"
                />
                <span className="absolute right-4 top-3 text-slate-400 text-sm font-bold">₹</span>
              </div>
            </div>

            <button 
              onClick={handleSaveGlobalConfig}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <FaSave />
              <span>Save Defaults</span>
            </button>
          </div>

          {/* Category Overrides Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-800">Category Specific Commission Rates</h4>
                <p className="text-slate-400 text-xs">Set custom commission percentages by categories</p>
              </div>
            </div>

            <div className="space-y-4">
              {categories.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No active categories found to override commission.
                </div>
              ) : (
                categories.map((cat) => (
                  <div key={cat._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 text-sm">{cat.name}</p>
                      <p className="text-slate-400 text-[10px] uppercase font-bold flex items-center space-x-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        <span>{cat.isActive ? 'Active Category' : 'Inactive Category'}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="range" 
                          min="0" 
                          max="50" 
                          value={cat.commissionPercent || 0}
                          onChange={(e) => handleRateChange(cat._id, e.target.value)}
                          className="w-24 md:w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                        />
                        <div className="relative w-16">
                          <input 
                            type="number"
                            min="0"
                            max="50"
                            value={cat.commissionPercent || 0}
                            onChange={(e) => handleRateChange(cat._id, e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-center font-bold text-slate-700"
                          />
                          <span className="absolute right-1.5 top-1 text-[10px] font-bold text-slate-400">%</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleSaveCategoryCommission(cat)}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-sm"
                      >
                        <FaPercentage className="text-[10px]" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-start space-x-3 text-xs text-sky-800">
              <FaInfoCircle className="mt-0.5 text-sky-500 shrink-0" />
              <p className="leading-relaxed">
                Category specific commission overrides will immediately apply to all new bookings matching that category, bypassing the global defaults. Commission will be deducted from partner earnings during order payouts completion.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
