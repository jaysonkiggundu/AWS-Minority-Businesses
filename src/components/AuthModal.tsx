import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthFlows } from '@/hooks/useAuthFlows';
import { usePasswordReset } from '@/hooks/usePasswordReset';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ConfirmEmailForm } from '@/components/auth/ConfirmEmailForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const authFlows = useAuthFlows({
    onClose: () => onOpenChange(false),
  });

  const passwordReset = usePasswordReset({
    onComplete: () => {
      authFlows.goToSignIn();
    },
  });

  const handleForgotPassword = () => {
    passwordReset.resetState();
    authFlows.goToForgotPassword();
  };

  const handleBackToSignInFromForgotPassword = () => {
    passwordReset.resetState();
    authFlows.goToSignIn();
  };

  if (authFlows.mode === 'confirm') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Email</DialogTitle>
            <DialogDescription>
              Enter the confirmation code sent to your email
            </DialogDescription>
          </DialogHeader>
          <ConfirmEmailForm
            value={authFlows.confirmationCode}
            loading={authFlows.loading}
            onChange={authFlows.setConfirmationCode}
            onSubmit={authFlows.handleConfirmSignUp}
            onBack={authFlows.goToSignUp}
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (authFlows.mode === 'forgot') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {passwordReset.forgotPasswordStep === 'request'
                ? 'Enter your username to receive a reset code'
                : 'Enter the code from your email and your new password'}
            </DialogDescription>
          </DialogHeader>
          <ForgotPasswordForm
            step={passwordReset.forgotPasswordStep}
            values={passwordReset.forgotPasswordData}
            loading={passwordReset.loading}
            onChange={(field, value) =>
              passwordReset.setForgotPasswordData({
                ...passwordReset.forgotPasswordData,
                [field]: value,
              })
            }
            onRequestSubmit={passwordReset.handleForgotPasswordRequest}
            onResetSubmit={passwordReset.handlePasswordReset}
            onBackToSignIn={handleBackToSignInFromForgotPassword}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to AWS CAMP</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={authFlows.mode === 'signup' ? 'signup' : 'signin'}
          onValueChange={(value) => {
            if (value === 'signup') {
              authFlows.goToSignUp();
            } else {
              authFlows.goToSignIn();
            }
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignInForm
              values={authFlows.signInData}
              loading={authFlows.loading}
              onChange={(field, value) =>
                authFlows.setSignInData({
                  ...authFlows.signInData,
                  [field]: value,
                })
              }
              onSubmit={authFlows.handleSignIn}
              onForgotPassword={handleForgotPassword}
            />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm
              values={authFlows.signUpData}
              loading={authFlows.loading}
              onChange={(field, value) =>
                authFlows.setSignUpData({
                  ...authFlows.signUpData,
                  [field]: value,
                })
              }
              onSubmit={authFlows.handleSignUp}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
