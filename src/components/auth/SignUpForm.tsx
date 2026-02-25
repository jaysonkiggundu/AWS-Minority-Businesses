import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpFormProps {
  values: SignUpFormValues;
  loading: boolean;
  onChange: (field: keyof SignUpFormValues, value: string) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export const SignUpForm = ({
  values,
  loading,
  onChange,
  onSubmit,
}: SignUpFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-username">Username</Label>
        <Input
          id="signup-username"
          type="text"
          value={values.username}
          onChange={(e) => onChange('username', e.target.value)}
          placeholder="Choose a username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={values.password}
          onChange={(e) => onChange('password', e.target.value)}
          placeholder="Create a password"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
        <Input
          id="signup-confirm-password"
          type="password"
          value={values.confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
          placeholder="Confirm your password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  );
};

