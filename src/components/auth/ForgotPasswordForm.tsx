import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ForgotPasswordStep = 'request' | 'reset';

interface ForgotPasswordFormValues {
  username: string;
  code: string;
  newPassword: string;
}

interface ForgotPasswordFormProps {
  step: ForgotPasswordStep;
  values: ForgotPasswordFormValues;
  loading: boolean;
  onChange: (field: keyof ForgotPasswordFormValues, value: string) => void;
  onRequestSubmit: React.FormEventHandler<HTMLFormElement>;
  onResetSubmit: React.FormEventHandler<HTMLFormElement>;
  onBackToSignIn: () => void;
}

export const ForgotPasswordForm = ({
  step,
  values,
  loading,
  onChange,
  onRequestSubmit,
  onResetSubmit,
  onBackToSignIn,
}: ForgotPasswordFormProps) => {
  if (step === 'request') {
    return (
      <form onSubmit={onRequestSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="forgot-username">Username</Label>
          <Input
            id="forgot-username"
            type="text"
            value={values.username}
            onChange={(e) => onChange('username', e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Code'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={onBackToSignIn}
        >
          Back to Sign In
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={onResetSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-code">Reset Code</Label>
        <Input
          id="reset-code"
          type="text"
          value={values.code}
          onChange={(e) => onChange('code', e.target.value)}
          placeholder="Enter code from email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input
          id="new-password"
          type="password"
          value={values.newPassword}
          onChange={(e) => onChange('newPassword', e.target.value)}
          placeholder="Enter new password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={onBackToSignIn}
      >
        Back to Sign In
      </Button>
    </form>
  );
};

