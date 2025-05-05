import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  onChange?: (value: number) => void;
  count?: number;
  disabled?: boolean;
  readOnly?: boolean;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ value = 0, onChange, count = 5, disabled = false, readOnly = false, className, ...props }, ref) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    const displayValue = hoverValue !== null ? hoverValue : value;

    const handleClick = (newValue: number) => {
      if (readOnly || disabled) return;
      onChange?.(newValue);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-1",
          { "opacity-50 cursor-not-allowed": disabled },
          { "cursor-default": readOnly },
          { "cursor-pointer": !disabled && !readOnly },
          className
        )}
        {...props}
      >
        {Array.from({ length: count }, (_, i) => i + 1).map((star) => (
          <Star
            key={star}
            className={cn(
              "transition-colors duration-150",
              star <= displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300"
            )}
            onMouseEnter={() => {
              if (!readOnly && !disabled) setHoverValue(star);
            }}
            onMouseLeave={() => {
              if (!readOnly && !disabled) setHoverValue(null);
            }}
            onClick={() => handleClick(star)}
          />
        ))}
      </div>
    );
  }
);

Rating.displayName = "Rating";
