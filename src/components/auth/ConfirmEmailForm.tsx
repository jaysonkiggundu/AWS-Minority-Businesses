import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConfirmEmailFormProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onBack: () => void;
}

export const ConfirmEmailForm = ({
  value,
  loading,
  onChange,
  onSubmit,
  onBack,
}: ConfirmEmailFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Confirmation Code</Label>
        <Input
          id="code"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter 6-digit code"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Confirming...' : 'Confirm Email'}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={onBack}
      >
        Back to Sign Up
      </Button>
    </form>
  );
};

