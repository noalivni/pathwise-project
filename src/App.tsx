
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NotificationProvider } from "@/hooks/useNotifications";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { trackPageView } from "@/utils/analytics";

const queryClient = new QueryClient();

// Component to track page views
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <PageViewTracker />
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
