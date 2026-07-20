import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Logo from '../components/Logo';
import { FaEnvelope, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { api } from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!email) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter your administrator email ID.',
        confirmButtonColor: '#13264d'
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Password Too Short',
        text: 'Password must be at least 6 digits/characters long.',
        confirmButtonColor: '#13264d'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      
      // Save details to localStorage
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_account', JSON.stringify(response.account));

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Welcome! Signed in successfully.',
        showConfirmButton: false,
        timer: 2000
      });

      onLogin();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Sign In Failed',
        text: error.message || 'Unable to connect to the server. Please try again.',
        confirmButtonColor: '#13264d'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full bg-brand-navy-light/20 blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl" />

      {/* Login Container Card */}
      <div className="w-full max-w-md bg-slate-800/80 border border-slate-700/50 rounded-3xl p-8 shadow-2xl backdrop-blur-lg relative z-10 space-y-8">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-4">
          <Logo className="h-16" light={true} showText={true} />
          <div className="text-center">
            <h2 className="text-white text-lg font-bold">Admin Console Sign In</h2>
            <p className="text-slate-400 text-xs mt-1">Enter your console access keys below</p>
          </div>
        </div>


        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider">Email ID</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
              <input 
                type="email" 
                placeholder="admin@gharkasathi.com"
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-slate-950 transition disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-slate-400 text-[11px] font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="******"
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 focus:bg-slate-950 transition disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition disabled:opacity-50"
              >
                {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-brand-gold text-brand-navy hover:bg-brand-gold-light text-xs font-bold py-3 rounded-xl shadow-lg shadow-brand-gold/10 transition mt-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-brand-navy border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaSignInAlt className="text-xs" />
            )}
            <span>{isLoading ? 'Connecting...' : 'Access Console'}</span>
          </button>
        </form>
      </div>

      {/* Footer copyright */}
      <p className="mt-8 text-slate-600 text-[10px] text-center relative z-10 font-medium">
        &copy; 2026 Ghar Ka Sathi. Powered by Aayup Technologies. All rights reserved.
      </p>
    </div>
  );
}
