import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeedbackForm from "@/pages/FeedbackForm";
import AdminView from "@/pages/AdminView";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header currentPath={location} />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Switch>
            <Route path="/" component={FeedbackForm} />
            <Route path="/admin" component={AdminView} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
