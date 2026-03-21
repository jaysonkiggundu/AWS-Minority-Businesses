import { Share2, Link, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface ShareMenuProps {
  title: string;
  url?: string;
  variant?: "icon" | "full";
}

export function ShareMenu({ title, url, variant = "icon" }: ShareMenuProps) {
  const shareUrl = url ?? window.location.href;
  const text = `Check out ${title} on AWS CAMP`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      logger.logUserAction("Share: Copy Link", { title });
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareTwitter = () => {
    logger.logUserAction("Share: Twitter", { title });
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareLinkedIn = () => {
    logger.logUserAction("Share: LinkedIn", { title });
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return false;
    try {
      await navigator.share({ title, text, url: shareUrl });
      logger.logUserAction("Share: Native", { title });
      toast.success("Shared successfully!");
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "full" ? (
          <Button variant="outline" className="w-full" size="lg">
            <Share2 className="mr-2 h-4 w-4" />
            Share Profile
          </Button>
        ) : (
          <Button variant="outline" size="icon" title="Share" onClick={async (e) => {
            // On mobile with native share, skip the dropdown
            if (navigator.share) {
              e.preventDefault();
              await handleNativeShare();
            }
          }}>
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyLink}>
          <Link className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareTwitter}>
          <Twitter className="mr-2 h-4 w-4" />
          Share on X / Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareLinkedIn}>
          <Linkedin className="mr-2 h-4 w-4" />
          Share on LinkedIn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
