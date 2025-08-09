import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-2xl',
  showCloseButton = true 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className={`relative top-4 mx-auto p-5 border w-full ${maxWidth} shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto`}>
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-2 pb-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 