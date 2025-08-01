import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PostProject from "@/pages/post-project";
import ContractorProfile from "@/pages/contractor-profile";
import Dashboard from "@/pages/dashboard";
import Messages from "@/pages/messages";
import BrowseContractors from "@/pages/browse-contractors";
import Auth from "@/pages/auth";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/auth-context";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/post-project" component={PostProject} />
          <Route path="/contractor-profile" component={ContractorProfile} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/messages" component={Messages} />
          <Route path="/browse-contractors" component={BrowseContractors} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
