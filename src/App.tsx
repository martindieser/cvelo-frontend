import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import FreeBuilder from "./pages/FreeBuilder.tsx";
import NotFound from "./pages/NotFound.tsx";
import PersonalInfo from "@/components/dashboard/PersonalInfo";
import MyDocuments from "@/components/dashboard/MyDocuments";
import Settings from "@/components/dashboard/Settings";
import TailorSection from "@/components/dashboard/TailorSection";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useOnboardingState } from "@/hooks/useOnboardingState";
import LoadingScreen from "@/components/LoadingScreen";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isEmailUnconfirmed, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, isNewUser } = useUserProfile();
  const { hasResumeData } = useOnboardingState(isAuthenticated);

  if (authLoading || (isAuthenticated && profileLoading)) {
    return <LoadingScreen message="Verificando sesión..." />;
  }

  // 1. Si el email no está confirmado -> Al Onboarding (Paso 3: Auth/OTP)
  if (isEmailUnconfirmed) {
    return <Navigate to="/onboarding?step=3" replace />;
  }

  // 2. Si NO está autenticado -> Al Home (/)
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 3. Si está autenticado pero NO tiene perfil maestro procesado (404 confirmado)
  if (isNewUser) {
    // Si tiene datos locales para reanudar -> Al paso 4 del onboarding
    if (hasResumeData) {
      return <Navigate to="/onboarding?step=4" replace />;
    }
    // Si no tiene nada -> Al paso 1 del onboarding
    return <Navigate to="/onboarding?step=1" replace />;
  }

  // 3. Si todo está OK (hay perfil o hay error que no es 404) -> Renderizar Dashboard
  // Nota: Si hay un error que NO es 404, dejamos que el dashboard maneje su propio estado de error
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/free-builder" element={<FreeBuilder />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="tailor" replace />} />
              <Route path="tailor" element={<TailorSection />} />
              <Route path="tailor/:resumeId" element={<TailorSection />} />
              <Route path="info" element={<PersonalInfo />} />
              <Route path="docs" element={<MyDocuments />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
