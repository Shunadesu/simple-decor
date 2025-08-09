import React, { useState } from 'react';
import PromoPopup from './PromoPopup';
import { Play, RotateCcw, Trash2 } from 'lucide-react';

const PromoPopupTest = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleTestSubmit = async (data) => {
    console.log('Test submission data:', data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('promoPopupShown');
    console.log('LocalStorage cleared');
  };

  const checkLocalStorage = () => {
    const stored = localStorage.getItem('promoPopupShown');
    console.log('Current localStorage:', stored);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-bold text-gray-800 mb-3">PromoPopup Test Controls</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => setShowPopup(true)}
          className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          <Play className="w-4 h-4" />
          <span>Show Popup</span>
        </button>
        
        <button
          onClick={clearLocalStorage}
          className="w-full flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Storage</span>
        </button>
        
        <button
          onClick={checkLocalStorage}
          className="w-full flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Check Storage</span>
        </button>
      </div>

      <PromoPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onSubmit={handleTestSubmit}
      />
    </div>
  );
};

export default PromoPopupTest;
