
import { Dialog, DialogContent } from "@/components/ui/dialog";
import MockCreditCardForm from "./MockCreditCardForm";

interface CreditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreditCardModal = ({ isOpen, onClose, onSuccess }: CreditCardModalProps) => {
  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <MockCreditCardForm 
          onSuccess={handleSuccess}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreditCardModal;
