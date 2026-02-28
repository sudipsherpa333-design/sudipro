import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ProjectsManager from "./pages/ProjectsManager";
import TechStackManager from "./pages/TechStackManager";
import BlogsManager from "./pages/BlogsManager";
import ContactsManager from "./pages/ContactsManager";
import SettingsManager from "./pages/SettingsManager";
import DemoResultsManager from "./pages/DemoResultsManager";
import PricingQuotesManager from "./pages/PricingQuotesManager";
import CaseStudiesManager from "./pages/CaseStudiesManager";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
        Loading...
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}

export default function AdminApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="demo-results" element={<DemoResultsManager />} />
            <Route path="pricing-quotes" element={<PricingQuotesManager />} />
            <Route path="case-studies" element={<CaseStudiesManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="techstack" element={<TechStackManager />} />
            <Route path="blogs" element={<BlogsManager />} />
            <Route path="contacts" element={<ContactsManager />} />
            <Route path="settings" element={<SettingsManager />} />
          </Route>
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  );
}
