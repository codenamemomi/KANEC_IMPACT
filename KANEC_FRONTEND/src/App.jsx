import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// ── Layout & Common ───────────────────────────────────────────────────────
import Navbar from './newcomponents/Navbar';
import Footer from './newcomponents/Footer';

// ── Landing sections ───────────────────────────────────────────────────────
import Hero from './newcomponents/Hero';
import Stats from './newcomponents/Stats';
import Partners from './newcomponents/Partners';
import WhyChoose from './newcomponents/WhyChoose';
import BlockchainSection from './newcomponents/BlockchainSection';
import CTASection from './newcomponents/CTASection';
import Vision from './newcomponents/Vision';

// ── Pages ───────────────────────────────────────────────────────────────────
import ProjectsPage from './pages/dashboard/ProjectsPage';
import SignInPage from './pages/SignInPage';
import VerificationPage from './pages/VerificationPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardProjects from './pages/dashboard/ProjectsPage';
import Donations from './pages/dashboard/Donations';
import AIInsights from './pages/dashboard/AIInsights';
import Reports from './pages/dashboard/Reports';
import Settings from './pages/dashboard/Settings.jsx';

// ── NEW: About – Same folder as Navbar, Hero, etc. ─────────────────────────
import About from './newcomponents/About';   // ← CORRECT PATH

// ── Context & Auth ────────────────────────────────────────────────────────
import { ThemeProvider } from './pages/dashboard/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// ── Helper ─────────────────────────────────────────────────────────────────
const PageWrapper = ({ children }) => (
  <div style={{ paddingTop: '80px' }}>{children}</div>
);

// ── Main routing logic ─────────────────────────────────────────────────────
const AppContent = () => {
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isAuthPage =
    location.pathname === '/signin' ||
    location.pathname === '/login' ||
    location.pathname === '/verify-email';

  const showLayout = !isDashboard && !isAuthPage;

  return (
    <>
      {showLayout && <Navbar />}

      <Routes>
        {/* ── Landing ── */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Stats />
              <Partners />
              <WhyChoose />
              <BlockchainSection />
              <CTASection />
              <Vision />
              <Footer />
            </>
          }
        />

        {/* ── Public pages ── */}
        <Route
          path="/projects"
          element={
            <PageWrapper>
              <ProjectsPage />
              <Footer />
            </PageWrapper>
          }
        />
        <Route
          path="/donors"
          element={
            <PageWrapper>
              <Donations />
              <Footer />
            </PageWrapper>
          }
        />

        {/* ── ABOUT PAGE – Now correctly imported ── */}
        <Route
          path="/About"
          element={
            <PageWrapper>
              <About />
              <Footer />
            </PageWrapper>
          }
        />

        {/* ── Auth pages ── */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/login" element={<div style={{textAlign:'center',marginTop:'100px'}}>Login Page</div>} />
        <Route path="/verify-email" element={<VerificationPage />} />

        {/* ── Dashboard (protected) ── */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ThemeProvider>
                <DashboardLayout />
              </ThemeProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<DashboardProjects />} />
          <Route path="donations" element={<Donations />} />
          <Route path="insights" element={<AIInsights />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

// ── Root ───────────────────────────────────────────────────────────────────
const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;