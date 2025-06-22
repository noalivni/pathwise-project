
import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const SuccessToast = ({ 
  message, 
  isVisible, 
  onClose, 
  autoClose = true, 
  duration = 4000 
}: SuccessToastProps) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[320px] max-w-md">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-main">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-green-100 transition-colors"
        >
          <X className="h-4 w-4 text-green-600" />
        </button>
      </div>
    </div>
  );
};

export default SuccessToast;
