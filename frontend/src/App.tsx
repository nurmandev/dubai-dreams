import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageProperties from "./pages/admin/Properties";
import ManageInquiries from "./pages/admin/Inquiries";
import KYCManagement from "./pages/admin/KYC";
import AdminProfile from "./pages/admin/Profile";
import EditProperty from "./pages/admin/EditProperty";
import AddProperty from "./pages/admin/AddProperty";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/properties" element={<ManageProperties />} />
          <Route path="/admin/inquiries" element={<ManageInquiries />} />
          <Route path="/admin/kyc" element={<KYCManagement />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/properties/edit/:id" element={<EditProperty />} />
          <Route path="/admin/properties/add" element={<AddProperty />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
