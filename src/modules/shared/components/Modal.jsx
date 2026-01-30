'use client';

import { useEffect, useRef } from 'react';

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOutsideClick = true,
  className = ''
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleOutsideClick}
        />
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl border border-black w-full ${sizes[size]} transform transition-all duration-300 scale-100 ${className}`}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-black">
              <h2 className="text-xl font-semibold text-black">{title}</h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-black transition-colors p-1 hover:bg-gray-100 rounded"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ModalHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between p-6 border-b border-black ${className}`}>
      {children}
    </div>
  );
}

export function ModalBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-end gap-3 p-6 border-t border-black ${className}`}>
      {children}
    </div>
  );
}
