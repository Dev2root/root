import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import StudentsPage from "@/pages/students/StudentsPage";
import CoursesPage from "@/pages/courses/CoursesPage";
import GradesPage from "@/pages/grades/GradesPage";
import AttendancePage from "@/pages/attendance/AttendancePage";
import ReportsPage from "@/pages/reports/ReportsPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import AppHeader from "@/components/AppHeader";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

function Router() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <AppHeader toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className={`flex-1 p-4 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <Switch>
            <Route path="/" component={StudentsPage} />
            <Route path="/students" component={StudentsPage} />
            <Route path="/courses" component={CoursesPage} />
            <Route path="/grades" component={GradesPage} />
            <Route path="/attendance" component={AttendancePage} />
            <Route path="/reports" component={ReportsPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
