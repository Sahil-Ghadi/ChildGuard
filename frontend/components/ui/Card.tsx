import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  severity?: "critical" | "high" | "verified" | "none";
};

export default function Card({ children, className = "", severity = "none" }: CardProps) {
  let severityAccent = null;

  switch (severity) {
    case "critical":
      severityAccent = <div className="absolute top-0 left-0 w-full h-[3px] bg-[#E74C3C]"></div>;
      break;
    case "high":
      severityAccent = <div className="absolute top-0 left-0 w-full h-[3px] bg-[#F39C12]"></div>;
      break;
    case "verified":
      severityAccent = <div className="absolute top-0 left-0 w-full h-[3px] bg-[#10B981]"></div>;
      break;
    case "none":
    default:
      break;
  }

  return (
    <div className={`relative bg-white border border-[#E2E8F0] rounded-sm p-4 shadow-sm overflow-hidden ${className}`}>
      {severityAccent}
      {children}
    </div>
  );
}
