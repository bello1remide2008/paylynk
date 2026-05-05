import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Scanner = ({ onScanSuccess, onClose }) => {
  useEffect(() => {
    // Initialize the scanner
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 }, // The scanning square size
      aspectRatio: 1.0,
    });

    scanner.render(
      (decodedText) => {
        onScanSuccess(decodedText);
        scanner.clear(); // Stop camera after success
      },
      (error) => {
        // Silent error for constant scanning attempts
      }
    );

    // Cleanup: stop camera when component unmounts
    return () => scanner.clear();
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-[#0a0a1a] flex flex-col items-center text-white z-50">
      
      {/* 1. TOP HEADER */}
      <div className="w-full py-6 border-b border-gray-800 text-center">
        <h2 className="text-sm font-semibold tracking-widest text-red-500 uppercase">
          Send Money / QR Code
        </h2>
      </div>

      {/* 2. SUB-HEADER */}
      <div className="mt-8 mb-4">
        <h1 className="text-xl font-medium">Send Money</h1>
      </div>

      {/* 3. SCANNER BOX AREA */}
      <div className="relative w-full max-w-sm px-10">
        <div 
          id="reader" 
          className="overflow-hidden rounded-xl border-2 border-gray-700 bg-black"
          style={{ minHeight: '300px' }}
        >
          {/* The html5-qrcode library will inject the video feed here */}
        </div>
        
        {/* Decorative Viewfinder Corners (Optional, for that "App" look) */}
        <div className="absolute top-0 left-10 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
        <div className="absolute top-0 right-10 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-10 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-10 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>
      </div>

      {/* 4. BOTTOM ACTION BUTTON */}
      <div className="mt-12 w-full px-10">
        <button 
          onClick={onClose}
          className="w-full py-4 bg-[#e63946] hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg uppercase tracking-tight"
        >
          Scan QR Code
        </button>
        
        <p className="text-center text-gray-500 text-xs mt-4">
          Align the QR code within the frame to scan
        </p>
      </div>

    </div>
  );
};

export default Scanner;