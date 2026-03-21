import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { resendSignUpCode } from "aws-amplify/auth";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

/**
 * FR-16: Shows a dismissible banner when the authenticated user's email is unverified.
 */
export function EmailVerificationBanner() {
  const { user, isAuthenticated } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);

  // Only show for authenticated users with unverified email
  if (!isAuthenticated || !user || user.emailVerified !== false || dismissed) {
    return null;
  }

  const handleResend = async () => {
    if (!user.username) return;
    setSending(true);
    try {
      await resendSignUpCode({ username: user.username });
      logger.logUserAction("Resend Verification Email", { username: user.username });
      toast.success("Verification email sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend verification email");
    } finally {
      setSending(false);
    }
  };

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
      <Mail className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="flex items-center justify-between w-full">
        <span className="text-yellow-800 dark:text-yellow-200 text-sm">
          Please verify your email address <strong>{user.email}</strong> to unlock all features.
        </span>
        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-yellow-400 text-yellow-800 hover:bg-yellow-100 dark:text-yellow-200"
            onClick={handleResend}
            disabled={sending}
          >
            {sending ? "Sending..." : "Resend Email"}
          </Button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
