import React, { useEffect } from 'react';
import { VscClose } from 'react-icons/vsc';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-3xl'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal Card */}
      <div
        className={`relative w-full ${maxWidth} bg-paper border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 z-10 max-h-[90vh] flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-black">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-black">{title}</h3>
            {subtitle && <p className="text-xs font-mono text-gray-600 mt-1 uppercase tracking-wider">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-black hover:bg-black hover:text-white transition-colors cursor-pointer border border-black"
            aria-label="Tutup"
            title="Tutup (Esc)"
          >
            <VscClose size={20} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto mt-4 pr-1 font-sans">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
