import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import useCartStore from '../stores/cartStore';
import { settingsApi } from '../services';
import { getCurrencySymbol } from '../utils/currency';

const CurrencySelector = ({ className = '' }) => {
  const { currency, setCurrency } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [supportedCurrencies, setSupportedCurrencies] = useState(['VND', 'USD', 'EUR']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Re-enable when settings API is implemented
    // For now, use default currencies
    setSupportedCurrencies(['VND', 'USD', 'EUR']);
    
    // Fetch supported currencies from settings (disabled temporarily)
    // const fetchSupportedCurrencies = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await settingsApi.getSettings();
    //     if (response.success && response.settings.supportedCurrencies) {
    //       setSupportedCurrencies(response.settings.supportedCurrencies);
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch supported currencies:', error);
    //     // Use default currencies on error
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchSupportedCurrencies();
  }, []);

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
    
    // You could add analytics tracking here
    console.log(`Currency changed to: ${newCurrency}`);
  };

  const getCurrencyDisplay = (currencyCode) => {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol} ${currencyCode}`;
  };

  if (loading) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        disabled={supportedCurrencies.length <= 1}
      >
        <span className="font-medium">{getCurrencyDisplay(currency)}</span>
        {supportedCurrencies.length > 1 && (
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && supportedCurrencies.length > 1 && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {supportedCurrencies.map((currencyCode) => (
                <button
                  key={currencyCode}
                  onClick={() => handleCurrencyChange(currencyCode)}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                    currency === currencyCode 
                      ? 'bg-primary-50 text-primary-600 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  {getCurrencyDisplay(currencyCode)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencySelector;
