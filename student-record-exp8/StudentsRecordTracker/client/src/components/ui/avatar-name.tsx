import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AvatarNameProps {
  name: string;
  subtitle?: string;
  fallbackColor?: string;
}

export function AvatarName({ name, subtitle, fallbackColor = "bg-primary-light" }: AvatarNameProps) {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="flex items-center">
      <Avatar className={`h-10 w-10 ${fallbackColor} text-white`}>
        <AvatarFallback className="text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4">
        <div className="text-sm font-medium text-foreground">{name}</div>
        {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
      </div>
    </div>
  );
}
