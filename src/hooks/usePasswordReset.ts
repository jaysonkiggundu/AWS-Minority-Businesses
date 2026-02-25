import { useState } from 'react';
import { toast } from 'sonner';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';

type ForgotPasswordStep = 'request' | 'reset';

interface UsePasswordResetOptions {
  onComplete?: () => void;
}

interface ForgotPasswordData {
  username: string;
  code: string;
  newPassword: string;
}

export const usePasswordReset = ({ onComplete }: UsePasswordResetOptions = {}) => {
  const [forgotPasswordData, setForgotPasswordData] = useState<ForgotPasswordData>({
    username: '',
    code: '',
    newPassword: '',
  });
  const [forgotPasswordStep, setForgotPasswordStep] = useState<ForgotPasswordStep>('request');
  const [loading, setLoading] = useState(false);

  const handleForgotPasswordRequest: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword({ username: forgotPasswordData.username });
      toast.success('Reset code sent to your email');
      setForgotPasswordStep('reset');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmResetPassword({
        username: forgotPasswordData.username,
        confirmationCode: forgotPasswordData.code,
        newPassword: forgotPasswordData.newPassword,
      });
      toast.success('Password reset successful! You can now sign in.');
      resetState();
      onComplete?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setForgotPasswordData({ username: '', code: '', newPassword: '' });
    setForgotPasswordStep('request');
  };

  return {
    forgotPasswordData,
    setForgotPasswordData,
    forgotPasswordStep,
    loading,
    handleForgotPasswordRequest,
    handlePasswordReset,
    resetState,
  };
};

