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
import AddCompanyPage from "@/pages/AddCompanyPage";
import NotFound from "@/pages/NotFound";
import TodosPage from "@/pages/TodosPage";


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
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/company/:id" element={<CompanyDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/skills" element={<SkillMappingPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/add-company" element={<AddCompanyPage />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
