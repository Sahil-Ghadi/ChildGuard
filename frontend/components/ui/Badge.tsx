import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "critical" | "high-risk" | "verified" | "official" | "default";
  icon?: boolean;
  className?: string;
};

export default function Badge({
  children,
  variant = "default",
  icon = false,
  className = "",
}: BadgeProps) {
  let baseClasses =
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider font-semibold";
  
  let variantClasses = "";
  let iconElement = null;

  switch (variant) {
    case "critical":
      variantClasses = "bg-[#FEF2F2] border border-[#DC2626] text-[#991B1B]";
      if (icon) {
        iconElement = <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse"></span>;
      }
      break;
    case "high-risk":
      variantClasses = "bg-[#FFFBEB] border border-[#D97706] text-[#92400E]";
      if (icon) {
        iconElement = <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>;
      }
      break;
    case "verified":
      variantClasses = "bg-[#ECFDF5] border border-[#10B981] text-[#065F46]";
      if (icon) {
        iconElement = <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>;
      }
      break;
    case "official":
      variantClasses = "bg-[#F1F5F9] border border-[#94A3B8] text-[#334155]";
      if (icon) {
        iconElement = <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"></span>;
      }
      break;
    default:
      variantClasses = "bg-surface-container-low text-on-surface-variant border border-outline-variant/30";
      break;
  }

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {iconElement}
      {children}
    </span>
  );
}
