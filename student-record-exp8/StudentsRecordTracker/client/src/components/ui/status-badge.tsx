import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "Active" | "Inactive" | "Graduated" | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "Graduated":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "px-2 py-1 rounded-full text-xs font-semibold", 
        getStatusStyles(),
        className
      )}
    >
      {status}
    </Badge>
  );
}
