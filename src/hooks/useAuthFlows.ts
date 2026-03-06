import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'signin' | 'signup' | 'confirm' | 'forgot';

interface UseAuthFlowsOptions {
  onClose: () => void;
}

interface SignInData {
  username: string;
  password: string;
}

interface SignUpData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const useAuthFlows = ({ onClose }: UseAuthFlowsOptions) => {
  const { signIn, signUp, confirmSignUp } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [loading, setLoading] = useState(false);
  const [pendingUsername, setPendingUsername] = useState('');

  const [signInData, setSignInData] = useState<SignInData>({
    username: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState<SignUpData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [confirmationCode, setConfirmationCode] = useState('');

  const handleSignIn: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(signInData.username, signInData.password);
      toast.success('Successfully signed in!');
      onClose();
      setSignInData({ username: '', password: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signUp(signUpData.username, signUpData.email, signUpData.password);
      setPendingUsername(signUpData.username);
      setMode('confirm');
      toast.success('Account created! Please check your email for confirmation code.');
      setSignUpData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmSignUp(pendingUsername, confirmationCode);
      toast.success('Email confirmed! You can now sign in.');
      setMode('signin');
      setConfirmationCode('');
      setPendingUsername('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to confirm email');
    } finally {
      setLoading(false);
    }
  };

  const goToSignIn = () => setMode('signin');
  const goToSignUp = () => setMode('signup');
  const goToConfirm = () => setMode('confirm');
  const goToForgotPassword = () => setMode('forgot');

  return {
    mode,
    loading,
    signInData,
    setSignInData,
    signUpData,
    setSignUpData,
    confirmationCode,
    setConfirmationCode,
    handleSignIn,
    handleSignUp,
    handleConfirmSignUp,
    goToSignIn,
    goToSignUp,
    goToConfirm,
    goToForgotPassword,
  };
};

