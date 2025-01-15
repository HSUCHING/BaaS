import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'lg' 
}: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  // 添加 useEffect 来控制 body 的 overflow
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // 清理函数
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setShouldRender(true);
    } else {
      // 添加这个 else 分支来处理 isOpen 变为 false 的情况
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    // 等待动画结束后再触发实际的关闭事件
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setShouldRender(false);
    }, 300);
  };

  if (!shouldRender && !isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    xxl: 'max-w-7xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with fade effect */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
        onClick={handleClose}
        style={{
          animation: isClosing 
            ? 'fadeOut 0.3s ease-in-out forwards'
            : 'fadeIn 0.3s ease-in-out'
        }}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={cn(
            "relative w-full rounded-lg bg-default-100 shadow-xl",
            "transform transition-all duration-300 ease-out",
            sizeClasses[size]
          )}
          style={{
            animation: isClosing 
              ? 'modalSlideOut 0.3s ease-in-out forwards'
              : 'modalSlideIn 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-default-200">
            <h3 className="text-xl font-semibold text-white">
              {title}
            </h3>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-default-200 text-default-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes modalSlideOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
        }
      `}</style>
    </div>
  );
} 