import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { FaPercentage, FaSave, FaCoins, FaInfoCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function Commission() {
  const [globalCommission, setGlobalCommission] = useState(10);
  const [safetyFee, setSafetyFee] = useState(15);
  const [payoutThreshold, setPayoutThreshold] = useState(500);

  const [categoryOverrides, setCategoryOverrides] = useState([
    { id: '1', name: 'Plumber', overrideRate: 10, isOverridden: false },
    { id: '2', name: 'Electrician', overrideRate: 12, isOverridden: true },
    { id: '3', name: 'Painter', overrideRate: 15, isOverridden: true },
    { id: '4', name: 'House Help / Maid', overrideRate: 5, isOverridden: true },
    { id: '5', name: 'Baby Care / Nanny', overrideRate: 8, isOverridden: true },
    { id: '6', name: 'Cook', overrideRate: 8, isOverridden: false },
    { id: '7', name: 'Gardener', overrideRate: 10, isOverridden: false },
  ]);

  const handleToggleOverride = (id) => {
    setCategoryOverrides(categoryOverrides.map(item => 
      item.id === id ? { ...item, isOverridden: !item.isOverridden } : item
    ));
  };

  const handleRateChange = (id, newRate) => {
    setCategoryOverrides(categoryOverrides.map(item => 
      item.id === id ? { ...item, overrideRate: Number(newRate) } : item
    ));
  };

  const handleSaveConfig = () => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Commission settings saved successfully!',
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
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition font-semibold"
              />
              <span className="absolute right-4 top-3 text-slate-400 text-sm font-bold">%</span>
            </div>
            <p className="text-xs text-slate-400">Used as default rate for service providers if overrides are disabled.</p>
          </div>

          {/* Safety Fee */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase">Platform Safety Fee (₹)</label>
            <div className="relative">
              <input 
                type="number" 
                value={safetyFee}
                onChange={(e) => setSafetyFee(Number(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition font-semibold"
              />
              <span className="absolute left-4 top-3 text-slate-400 text-sm font-bold">₹</span>
            </div>
            <p className="text-xs text-slate-400">Flat convenience fee charged to customers per booking.</p>
          </div>

          {/* Payout Threshold */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase">Minimum Payout Limit (₹)</label>
            <div className="relative">
              <input 
                type="number" 
                value={payoutThreshold}
                onChange={(e) => setPayoutThreshold(Number(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition font-semibold"
              />
              <span className="absolute left-4 top-3 text-slate-400 text-sm font-bold">₹</span>
            </div>
            <p className="text-xs text-slate-400">Threshold balance for processing automatic weekly bank payouts.</p>
          </div>

          <button 
            onClick={handleSaveConfig}
            className="w-full flex items-center justify-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow-md shadow-sky-500/10 transition"
          >
            <FaSave className="text-sm" />
            <span>Save Configuration</span>
          </button>
        </div>

        {/* Category Overrides Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-slate-800">Category Overrides</h4>
              <p className="text-slate-400 text-xs">Set individual commission rules per service category</p>
            </div>
            <div className="flex items-center text-xs bg-slate-50 text-slate-500 border px-3 py-1 rounded-full space-x-1.5 font-medium">
              <FaInfoCircle />
              <span>Override overrides global default</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider pb-3">
                  <th className="pb-3">Category Name</th>
                  <th className="pb-3">Override Status</th>
                  <th className="pb-3 w-40">Commission Rate (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {categoryOverrides.map((override) => (
                  <tr key={override.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 font-semibold text-slate-700">{override.name}</td>
                    <td className="py-4">
                      <button 
                        onClick={() => handleToggleOverride(override.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition ${
                          override.isOverridden 
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {override.isOverridden ? 'Override Enabled' : 'Using Global Default'}
                      </button>
                    </td>
                    <td className="py-4">
                      {override.isOverridden ? (
                        <div className="relative">
                          <input 
                            type="number" 
                            value={override.overrideRate}
                            onChange={(e) => handleRateChange(override.id, e.target.value)}
                            className="w-full pr-8 pl-3 py-1 bg-amber-50/50 border border-amber-200 rounded-lg text-sm font-semibold text-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                          />
                          <span className="absolute right-3 top-1.5 text-amber-600 text-xs font-bold">%</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-semibold pl-3">{globalCommission}%</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
