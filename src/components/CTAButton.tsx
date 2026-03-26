import { Button, ButtonProps } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CTAButtonProps extends ButtonProps {
  children: ReactNode;
  to?: string;
}

const CTAButton = ({ children, to = "/onboarding", className, ...props }: CTAButtonProps) => {
  const isFullWidth = className?.includes("w-full");
  
  return (
    <Link 
      to={to} 
      className={cn(
        "inline-block",
        isFullWidth ? "w-full" : "sm:w-auto",
        className?.includes("rounded-full") ? "rounded-full" : ""
      )}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </Link>
  );
};

export default CTAButton;
