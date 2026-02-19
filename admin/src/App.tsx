import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthGuard from './components/shared/AuthGuard';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import LeadsIndex from './pages/leads';
import ServicesIndex from './pages/services';
import SolutionsIndex from './pages/solutions';
import BlogIndex from './pages/blog';
import HeroesIndex from './pages/heroes';
import FAQsIndex from './pages/faqs';
import TeamIndex from './pages/team';
import TestimonialsIndex from './pages/testimonials';
import CommunesIndex from './pages/communes';
import PartnersIndex from './pages/partners';
import IndustriesIndex from './pages/industries';
import AuthorsIndex from './pages/authors';
import CompanyValuesIndex from './pages/company-values';
import ProcessStepsIndex from './pages/process-steps';
import StatsIndex from './pages/stats';
import CtasIndex from './pages/ctas';
import ConfigIndex from './pages/config';

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<LeadsIndex />} />
          <Route path="leads/:id" element={<LeadsIndex />} />
          <Route path="services" element={<ServicesIndex />} />
          <Route path="solutions" element={<SolutionsIndex />} />
          <Route path="blog" element={<BlogIndex />} />
          <Route path="heroes" element={<HeroesIndex />} />
          <Route path="faqs" element={<FAQsIndex />} />
          <Route path="team" element={<TeamIndex />} />
          <Route path="testimonials" element={<TestimonialsIndex />} />
          <Route path="communes" element={<CommunesIndex />} />
          <Route path="partners" element={<PartnersIndex />} />
          <Route path="industries" element={<IndustriesIndex />} />
          <Route path="authors" element={<AuthorsIndex />} />
          <Route path="company-values" element={<CompanyValuesIndex />} />
          <Route path="process-steps" element={<ProcessStepsIndex />} />
          <Route path="stats" element={<StatsIndex />} />
          <Route path="ctas" element={<CtasIndex />} />
          <Route path="config" element={<ConfigIndex />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
