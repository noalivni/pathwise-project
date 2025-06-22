
import { AlertTriangle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ErrorNotificationProps {
  title?: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  variant?: 'toast' | 'modal';
}

const ErrorNotification = ({ 
  title = "Error", 
  message, 
  isOpen, 
  onClose, 
  variant = 'toast' 
}: ErrorNotificationProps) => {
  if (variant === 'modal') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle className="text-red-800">{title}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-slate-600">{message}</p>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[320px] max-w-md">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800">{title}</p>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-red-100 transition-colors"
        >
          <X className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;
