import React from 'react';

export default function Logo({ className = "h-10", showText = true, light = false }) {
  const primaryColor = light ? "#ffffff" : "#13264d";
  const textColorClass = light ? "text-white" : "text-brand-navy";

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* SVG Icon part representing the house with G and golden details */}
      <svg 
        viewBox="0 0 300 280" 
        className="h-full w-auto" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* House / G Outline (Dynamic based on light/dark mode) */}
        <path 
          d="M60 210 V120 L150 45 L215 98 V90 H235 V115 L245 123 V190 C245 200 237 208 227 208 H150 C125 208 105 188 105 163 C105 138 125 118 150 118 H200" 
          stroke={primaryColor} 
          strokeWidth="24" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* 4-pane Window (Gold) */}
        <rect x="135" y="85" width="16" height="16" fill="#cf9b2d" />
        <rect x="155" y="85" width="16" height="16" fill="#cf9b2d" />
        <rect x="135" y="105" width="16" height="16" fill="#cf9b2d" />
        <rect x="155" y="105" width="16" height="16" fill="#cf9b2d" />
        
        {/* Gold Accent / Door shape on right */}
        <path 
          d="M200 155 L240 155 V208 H200 L200 155 Z" 
          fill="#cf9b2d" 
        />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline font-bold leading-none">
            <span className={`${textColorClass} text-2xl font-extrabold tracking-tight`}>Ghar</span>
            <span className="text-brand-gold text-2xl font-extrabold tracking-tight">kasathi</span>
          </div>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Everything For Your Home
          </span>
        </div>
      )}
    </div>
  );
}
