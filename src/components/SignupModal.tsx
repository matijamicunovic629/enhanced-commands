import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Loader2,
  Crown,
  User,
  Mail,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  Phone,
  Wallet,
  ToggleLeft as Google,
  Disc as Discord
} from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'beta-code' | 'username' | 'signup' | 'complete';

interface FormData {
  betaCode: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialFormData: FormData = {
  betaCode: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<Step>('beta-code');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('beta-code');
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  // Username availability check with debounce
  useEffect(() => {
    if (!formData.username || formData.username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsernameAvailable(Math.random() > 0.3); // 70% chance of being available
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  const validateBetaCode = () => {
    if (!formData.betaCode) {
      setErrors({ betaCode: 'Beta code is required' });
      return false;
    }
    if (formData.betaCode.length !== 8) {
      setErrors({ betaCode: 'Invalid beta code format' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateUsername = () => {
    if (!formData.username) {
      setErrors({ username: 'Username is required' });
      return false;
    }
    if (formData.username.length < 3) {
      setErrors({ username: 'Username must be at least 3 characters' });
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setErrors({ username: 'Username can only contain letters, numbers, and underscores' });
      return false;
    }
    if (!usernameAvailable) {
      setErrors({ username: 'Username is not available' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateSignup = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 'beta-code':
        isValid = validateBetaCode();
        if (isValid) {
          setLoading(true);
          try {
            // Simulate API call to verify beta code
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCurrentStep('username');
          } catch (error) {
            setErrors({ betaCode: 'Invalid beta code' });
          } finally {
            setLoading(false);
          }
        }
        break;

      case 'username':
        isValid = validateUsername();
        if (isValid) {
          setCurrentStep('signup');
        }
        break;

      case 'signup':
        isValid = validateSignup();
        if (isValid) {
          setLoading(true);
          try {
            // Simulate API call to create account
            await new Promise(resolve => setTimeout(resolve, 2000));
            setCurrentStep('complete');
            // Redirect to workspace after 2 seconds
            setTimeout(() => {
              window.location.href = '/workspace';
            }, 2000);
          } catch (error) {
            setErrors({ email: 'An error occurred. Please try again.' });
          } finally {
            setLoading(false);
          }
        }
        break;

      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'username':
        setCurrentStep('beta-code');
        break;
      case 'signup':
        setCurrentStep('username');
        break;
      default:
        break;
    }
  };

  const getPasswordStrength = (password: string): {
    strength: 'weak' | 'medium' | 'strong';
    color: string;
    width: string;
  } => {
    if (!password) return { strength: 'weak', color: 'bg-red-500', width: '0%' };

    const hasLength = password.length >= 8;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [hasLength, hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (score <= 2) return { strength: 'weak', color: 'bg-red-500', width: '33%' };
    if (score <= 4) return { strength: 'medium', color: 'bg-yellow-500', width: '66%' };
    return { strength: 'strong', color: 'bg-green-500', width: '100%' };
  };

  if (!isOpen) return null;

  const renderStepIndicator = () => (
    <div className="flex items-center gap-2 mb-6 md:mb-8">
      {['beta-code', 'username', 'signup'].map((step, index) => (
        <React.Fragment key={step}>
          <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors ${
            currentStep === step
              ? 'bg-blue-500'
              : index < ['beta-code', 'username', 'signup'].indexOf(currentStep)
              ? 'bg-green-500'
              : 'bg-white/10'
          }`} />
          {index < 2 && (
            <div className={`w-8 md:w-12 h-0.5 transition-colors ${
              index < ['beta-code', 'username', 'signup'].indexOf(currentStep)
                ? 'bg-green-500'
                : 'bg-white/10'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderBetaCodeStep = () => (
    <>
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Crown className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Exclusive Beta Access</h2>
          <p className="text-white/60">Welcome to our invite-only beta program</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-white/60 mb-2">
            Invitation Code
          </label>
          <input
            type="text"
            value={formData.betaCode}
            onChange={(e) => {
              const value = e.target.value.toUpperCase();
              if (/^[A-Z0-9]*$/.test(value) && value.length <= 8) {
                setFormData({ ...formData, betaCode: value });
                setErrors({ ...errors, betaCode: undefined });
              }
            }}
            placeholder="Enter your 8-character code"
            className={`w-full bg-white/5 border ${
              errors.betaCode ? 'border-red-500' : 'border-white/10'
            } rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors font-mono tracking-wider`}
          />
          {errors.betaCode && (
            <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.betaCode}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={loading || !formData.betaCode}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </>
  );

  const renderUsernameStep = () => (
    <>
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <User className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Choose Your Username</h2>
          <p className="text-white/60">Create a unique username that will identify you</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-white/60 mb-2">
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.username}
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                if (/^[a-z0-9_]*$/.test(value)) {
                  setFormData({ ...formData, username: value });
                  setErrors({ ...errors, username: undefined });
                }
              }}
              placeholder="Choose your username"
              className={`w-full bg-white/5 border ${
                errors.username ? 'border-red-500' :
                usernameAvailable === true ? 'border-green-500' :
                'border-white/10'
              } rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-colors`}
            />
            {formData.username && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingUsername ? (
                  <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
                ) : usernameAvailable ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : usernameAvailable === false ? (
                  <X className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            )}
          </div>
          {errors.username ? (
            <div className="flex items-center gap-1 mt-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.username}</span>
            </div>
          ) : (
            <div className="text-sm text-white/60 mt-1">
              Username must be at least 3 characters and can only contain letters, numbers, and underscores
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <button
            onClick={handleNext}
            disabled={loading || !formData.username || !usernameAvailable}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );

  const renderSignupStep = () => (
    <>
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
          <Mail className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Complete Your Profile</h2>
          <p className="text-white/60">Choose how you want to continue</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* OAuth Buttons */}
        <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
          <Google className="w-5 h-5" />
          <span className="flex-1 text-left">Continue with Google</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
          <Discord className="w-5 h-5" />
          <span className="flex-1 text-left">Continue with Discord</span>
        </button>

        <div className="relative">
          <div className="absolute inset-y-1/2 w-full border-t border-white/10" />
          <div className="relative text-center">
            <span className="glass px-2 text-sm text-white/40">or</span>
          </div>
        </div>

        {/* Email & Phone Options */}
        <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
          <Mail className="w-5 h-5" />
          <span className="flex-1 text-left">Continue with email</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
          <Phone className="w-5 h-5" />
          <span className="flex-1 text-left">Continue with phone</span>
        </button>

        {/* Web3 & Passkey Options */}
        <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
          <Wallet className="w-5 h-5" />
          <span className="flex-1 text-left">Connect your web3 wallet</span>
        </button>
        <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
          <Key className="w-5 h-5" />
          <span className="flex-1 text-left">Use a passkey</span>
        </button>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </>
  );

  const renderCompleteStep = () => (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Welcome to Kaaom!</h2>
      <p className="text-white/60 mb-8">
        Your account has been created successfully. You'll be redirected to the dashboard in a moment.
      </p>
      <div className="w-12 h-12 mx-auto">
        <Loader2 className="w-full h-full text-blue-500 animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-0">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass border border-white/10 rounded-xl p-4 md:p-6 w-full max-w-[400px] max-h-[90vh] overflow-y-auto">
        {currentStep !== 'complete' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {currentStep !== 'complete' && renderStepIndicator()}

        {currentStep === 'beta-code' && renderBetaCodeStep()}
        {currentStep === 'username' && renderUsernameStep()}
        {currentStep === 'signup' && renderSignupStep()}
        {currentStep === 'complete' && renderCompleteStep()}
      </div>
    </div>
  );
};