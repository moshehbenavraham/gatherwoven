import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import Index from "./pages/Index";
import Discover from "./pages/Discover";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import MyEvents from "./pages/MyEvents";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    {/* Keyboard accessibility: skip link visible on focus, jumps past the
        fixed Navbar to the main content of each page. */}
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[5000] focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded-sm focus:text-sm focus:outline-2 focus:outline-white"
    >
      Skip to main content
    </a>
    <SiteJsonLd />
    <Toaster />
    <Sonner />
    <Routes>
      <Route path="/" element={<Discover />} />
      <Route path="/event/:id" element={<Index />} />
      <Route path="/event/:id/edit" element={<EditEvent />} />
      <Route path="/my-events" element={<MyEvents />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Admin />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
