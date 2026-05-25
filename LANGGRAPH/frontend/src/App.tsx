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
import PlacementTimelinePage from "@/pages/PlacementTimelinePage";
import InterviewExperiencesPage from "@/pages/InterviewExperiencesPage";
import RejectionEnginePage from "@/pages/RejectionEnginePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/companies" element={<ExplorePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/company/:id" element={<CompanyDetailPage />} />
            <Route path="/company/:id/:section" element={<CompanyDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/skills" element={<SkillMappingPage />} />
            <Route path="/timeline" element={<PlacementTimelinePage />} />
            <Route path="/experiences" element={<InterviewExperiencesPage />} />
            <Route path="/rejection-engine" element={<RejectionEnginePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
