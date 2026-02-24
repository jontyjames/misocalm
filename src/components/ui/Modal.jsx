/**
 * MisoCalm Modal Component
 * Cosmic Serenity theme - dark overlay with glass-morphism modal
 */

'use client';

import { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '@/hooks';

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}) {
  const modalRef = useRef(null);
  const titleId = useId();

  useFocusTrap(modalRef, isOpen);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`
          relative w-[calc(100%-2rem)] ${sizes[size]}
          bg-slate-900 border border-slate-800
          rounded-2xl shadow-2xl shadow-black/50
          p-6 mx-4
          animate-in fade-in zoom-in-95 duration-[233ms]
        `}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h2 id={titleId} className="text-xl font-light text-white">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="
                  p-2 rounded-lg text-slate-500
                  hover:text-white hover:bg-slate-800
                  transition-colors
                "
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

// Modal subcomponents
Modal.Body = function ModalBody({ children, className = '' }) {
  return (
    <div className={`text-slate-300 font-light ${className}`}>
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ children, className = '' }) {
  return (
    <div className={`mt-6 flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
};
