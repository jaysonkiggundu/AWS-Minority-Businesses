import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignInFormValues {
  username: string;
  password: string;
}

interface SignInFormProps {
  values: SignInFormValues;
  loading: boolean;
  onChange: (field: keyof SignInFormValues, value: string) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onForgotPassword: () => void;
}

export const SignInForm = ({
  values,
  loading,
  onChange,
  onSubmit,
  onForgotPassword,
}: SignInFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signin-username">Username</Label>
        <Input
          id="signin-username"
          type="text"
          value={values.username}
          onChange={(e) => onChange('username', e.target.value)}
          placeholder="Enter your username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          value={values.password}
          onChange={(e) => onChange('password', e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      <Button
        type="button"
        variant="link"
        className="w-full text-sm"
        onClick={onForgotPassword}
      >
        Forgot password?
      </Button>
    </form>
  );
};

