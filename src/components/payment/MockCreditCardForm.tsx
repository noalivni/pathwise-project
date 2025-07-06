
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";

interface MockCreditCardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const MockCreditCardForm = ({ onSuccess, onCancel, isLoading = false }: MockCreditCardFormProps) => {
  const { updateProfile } = useAuth();
  const { showSuccess } = useNotifications();
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [errors, setErrors] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCardNumber = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return 'Card number is required';
    if (cleanValue.length !== 4) return 'Enter last 4 digits only';
    return '';
  };

  const validateExpiryDate = (value: string) => {
    if (!value) return 'Expiry date is required';
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(value)) return 'Format: MM/YY';
    
    const [month, year] = value.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return 'Card has expired';
    }
    
    return '';
  };

  const validateCvv = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return 'CVV is required';
    if (cleanValue.length !== 3) return 'CVV must be 3 digits';
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      formattedValue = formattedValue.slice(0, 5);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      cardNumber: validateCardNumber(formData.cardNumber),
      expiryDate: validateExpiryDate(formData.expiryDate),
      cvv: validateCvv(formData.cvv)
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user's subscription status to premium
      await updateProfile({ subscription_status: 'premium' });
      
      showSuccess("Congratulations! You've upgraded to Pathwise Premium.");
      onSuccess();
    } catch (error) {
      console.error('Error upgrading to premium:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Upgrade to Premium</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your payment details to complete the upgrade
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Last 4 digits of card</Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              className={errors.cardNumber ? 'border-red-500' : ''}
              disabled={isSubmitting || isLoading}
            />
            {errors.cardNumber && (
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-3 h-3" />
                {errors.cardNumber}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className={errors.expiryDate ? 'border-red-500' : ''}
                disabled={isSubmitting || isLoading}
              />
              {errors.expiryDate && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-3 h-3" />
                  {errors.expiryDate}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                className={errors.cvv ? 'border-red-500' : ''}
                disabled={isSubmitting || isLoading}
              />
              {errors.cvv && (
                <div className="flex items-center gap-1 text-red-500 text-sm">
                  <AlertCircle className="w-3 h-3" />
                  {errors.cvv}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
            <Lock className="w-4 h-4" />
            <span>This is a demo. No real payment will be processed.</span>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
            >
              {isSubmitting ? 'Processing...' : 'Upgrade Now'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MockCreditCardForm;
