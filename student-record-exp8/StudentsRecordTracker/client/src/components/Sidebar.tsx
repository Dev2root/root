import { Link, useLocation } from "wouter";
import { 
  Users, 
  GraduationCap, 
  ClipboardList, 
  Calendar, 
  BarChart3, 
  Settings 
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const [location] = useLocation();
  
  const navItems = [
    { 
      path: "/students", 
      label: "Students", 
      icon: <Users className="mr-3 h-5 w-5" /> 
    },
    { 
      path: "/courses", 
      label: "Courses", 
      icon: <GraduationCap className="mr-3 h-5 w-5" /> 
    },
    { 
      path: "/grades", 
      label: "Grades", 
      icon: <ClipboardList className="mr-3 h-5 w-5" /> 
    },
    { 
      path: "/attendance", 
      label: "Attendance", 
      icon: <Calendar className="mr-3 h-5 w-5" /> 
    },
    { 
      path: "/reports", 
      label: "Reports", 
      icon: <BarChart3 className="mr-3 h-5 w-5" /> 
    },
    { 
      path: "/settings", 
      label: "Settings", 
      icon: <Settings className="mr-3 h-5 w-5" /> 
    }
  ];

  return (
    <aside 
      className={`w-64 bg-card elevation-2 h-full fixed left-0 top-16 z-10 transition-transform duration-300 transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >
      <nav className="py-4 h-full custom-scrollbar overflow-y-auto">
        <ul>
          {navItems.map((item) => {
            const isActive = location === item.path || 
              (item.path === "/students" && location === "/");
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center px-6 py-3 text-foreground hover:bg-muted
                    ${isActive ? 'bg-muted text-primary font-medium' : 'text-foreground/80'}`}
                >
                  <span className={isActive ? "text-primary" : "text-foreground/60"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
