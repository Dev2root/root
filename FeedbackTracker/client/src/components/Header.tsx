import { Link } from "wouter";
import { MessageCircle } from "lucide-react";

interface HeaderProps {
  currentPath: string;
}

const Header = ({ currentPath }: HeaderProps) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MessageCircle className="text-primary text-2xl mr-2" />
            <h1 className="text-xl font-semibold text-neutral-dark">Feedback System</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link 
                  href="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPath === "/" 
                      ? "bg-primary text-white" 
                      : "text-neutral-dark hover:bg-neutral-light"
                  }`}
                >
                  Submit Feedback
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPath === "/admin" 
                      ? "bg-primary text-white" 
                      : "text-neutral-dark hover:bg-neutral-light"
                  }`}
                >
                  Admin View
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
