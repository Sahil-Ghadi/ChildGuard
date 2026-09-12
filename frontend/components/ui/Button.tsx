import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "emergency" | "primary" | "secondary" | "destructive" | "default";
  icon?: ReactNode;
  fullWidth?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  icon,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  let baseClasses =
    "inline-flex items-center justify-center gap-2 font-label-md text-label-md transition-all rounded-md px-4 py-2 min-h-[48px]";
  
  let variantClasses = "";

  switch (variant) {
    case "emergency":
      variantClasses = "bg-[#E74C3C] text-white hover:bg-[#C0392B] border border-transparent focus:ring-2 focus:ring-white focus:outline-[#E74C3C]";
      break;
    case "primary":
      variantClasses = "bg-primary-container text-on-primary hover:opacity-90 border border-transparent";
      break;
    case "secondary":
      variantClasses = "bg-white text-[#0F172A] border-[1.5px] border-[#CBD5E1] hover:border-primary-container";
      break;
    case "destructive":
      variantClasses = "bg-transparent text-[#E74C3C] border border-[#E74C3C] hover:bg-[#FEF2F2]";
      break;
    default:
      variantClasses = "bg-surface-container text-on-surface hover:bg-surface-container-high";
      break;
  }

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${widthClass} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
