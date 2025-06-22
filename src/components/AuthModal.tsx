import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
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
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/c4491739-e997-4ba2-8b03-ce1daa476a86.png" 
              alt="Pathwise Logo" 
              className="w-16 h-16"
            />
          </div>
          <DialogTitle className="text-2xl text-foreground">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSignUp 
              ? "Join thousands of users discovering their perfect career path" 
              : "Sign in to continue your career journey"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={cn(
                  "bg-input border-border text-foreground placeholder:text-muted-foreground",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200",
                  errors.fullName ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "",
                  fullName && !errors.fullName ? "border-green-500 focus:border-green-500 focus:ring-green-500/20" : ""
                )}
                required
              />
              {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName}</p>}
            </div>
          )}
          
          <div>
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "bg-input border-border text-foreground placeholder:text-muted-foreground",
                "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200",
                errors.email ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "",
                email && !errors.email ? "border-green-500 focus:border-green-500 focus:ring-green-500/20" : ""
              )}
              required
            />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "bg-input border-border text-foreground placeholder:text-muted-foreground",
                "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200",
                errors.password ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "",
                password && !errors.password ? "border-green-500 focus:border-green-500 focus:ring-green-500/20" : ""
              )}
              required
            />
            {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
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
                className="w-full border-border text-foreground hover:bg-muted active:scale-95 transition-all duration-200"
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
                className="w-full border-border text-foreground hover:bg-muted active:scale-95 transition-all duration-200"
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
