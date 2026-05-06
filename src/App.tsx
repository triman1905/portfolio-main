import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "@/contexts/AudioContext";
import Index from "./pages/Index";
import ProofOfWork from "./pages/ProofOfWork";
import Publications from "./pages/Publications";
import Certifications from "./pages/Certifications";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Chatbot from "./components/Chatbot";
import CustomCursor from "./components/CustomCursor";
import PageViewTracker from "./components/PageViewTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AudioProvider>
        <Toaster />
        <Sonner />
        <CustomCursor />
        <BrowserRouter>
          <PageViewTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/proof-of-work" element={<ProofOfWork />} />
            <Route path="/publications" element={<Publications />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Chatbot />
      </AudioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
