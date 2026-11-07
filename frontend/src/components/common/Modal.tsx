import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal Box */}
        <div
          className={`relative w-full ${maxWidth} transform overflow-hidden bg-white text-left shadow-2xl transition-all border border-forme-border rounded-sm z-10`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-forme-border">
            <h3 className="font-heading font-semibold text-base text-forme-text-primary tracking-wide">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-forme-text-secondary hover:text-forme-text-primary transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
