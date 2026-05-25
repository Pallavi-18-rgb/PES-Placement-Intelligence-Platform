import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import ExplorePage from "@/pages/ExplorePage";
import CategoriesPage from "@/pages/CategoriesPage";
import CompanyDetailPage from "@/pages/CompanyDetailPage";
import ComparePage from "@/pages/ComparePage";
import SkillMappingPage from "@/pages/SkillMappingPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import TimelineOverviewPage from "@/pages/TimelineOverviewPage";
import InterviewsOverviewPage from "@/pages/InterviewsOverviewPage";
import RiskEngineOverviewPage from "@/pages/RiskEngineOverviewPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Inject mock token for microservices authentication
if (!localStorage.getItem('authToken')) {
  localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1vY2stdXNlci0xMjMiLCJyb2xlIjoiU1RVREVOVCIsImlhdCI6MTc3OTcwMTM1Mn0.SXISupoSRLdZJG88VJwsob6YDQianV-WWGChIHPNUEk');
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/company/:id" element={<CompanyDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/skills" element={<SkillMappingPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/timeline" element={<TimelineOverviewPage />} />
            <Route path="/interviews" element={<InterviewsOverviewPage />} />
            <Route path="/risk-engine" element={<RiskEngineOverviewPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
