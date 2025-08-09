import React, { useState, useEffect } from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';

const CurrencySelector = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [supportedCurrencies, setSupportedCurrencies] = useState([
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' }
  ]);

  const selectedCurrency = supportedCurrencies.find(currency => currency.code === value) || supportedCurrencies[0];

  const handleCurrencySelect = (currencyCode) => {
    onChange(currencyCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Currency
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{selectedCurrency.symbol}</span>
              <span className="text-gray-700">{selectedCurrency.code}</span>
              <span className="text-gray-500 text-sm">- {selectedCurrency.name}</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="py-1">
              {supportedCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  type="button"
                  onClick={() => handleCurrencySelect(currency.code)}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 ${
                    currency.code === value ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                  }`}
                >
                  <span className="font-medium">{currency.symbol}</span>
                  <span className="font-medium">{currency.code}</span>
                  <span className="text-sm text-gray-500">- {currency.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CurrencySelector;
