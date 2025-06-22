import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Brain } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AuthModal = ({ open, onClose, onLogin }: AuthModalProps) => {
  const { showSuccess, showError } = useNotifications();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', fullName: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '', fullName: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (isSignUp && !fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError("Please correct the errors in the form");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        showSuccess("Please check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        showSuccess("Welcome back! You have been signed in successfully.");
        onLogin();
      }
    } catch (error: any) {
      showError(error.message, 'modal', 'Authentication Error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setErrors({ email: '', password: '', fullName: '' });
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
    resetForm();
  };

  const switchToSignIn = () => {
    setIsSignUp(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription>
            {isSignUp 
              ? "Join thousands of users discovering their perfect career path" 
              : "Sign in to continue your career journey"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={cn(
                  "transition-colors focus-visible:ring-2 focus-visible:ring-teal-500",
                  errors.fullName ? "border-red-500 focus-visible:ring-red-500" : "",
                  fullName ? "border-green-500" : ""
                )}
                required
              />
              {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>}
            </div>
          )}
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "transition-colors focus-visible:ring-2 focus-visible:ring-teal-500",
                errors.email ? "border-red-500 focus-visible:ring-red-500" : "",
                email && !errors.email ? "border-green-500" : ""
              )}
              required
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "transition-colors focus-visible:ring-2 focus-visible:ring-teal-500",
                errors.password ? "border-red-500 focus-visible:ring-red-500" : "",
                password && !errors.password ? "border-green-500" : ""
              )}
              required
            />
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-teal-500 disabled:hover:to-blue-600"
            disabled={loading}
          >
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          {isSignUp ? (
            <>
              <p className="text-sm text-muted-foreground">
                Already have an account?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={switchToSignIn}
                className="w-full hover:bg-slate-50 active:scale-95 transition-all duration-200"
              >
                Sign In
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Don't have an account?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={switchToSignUp}
                className="w-full hover:bg-slate-50 active:scale-95 transition-all duration-200"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
