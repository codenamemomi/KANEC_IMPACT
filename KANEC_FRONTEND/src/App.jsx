import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Components
import Navbar from './newcomponents/Navbar';
import Hero from './newcomponents/Hero';
import Stats from './newcomponents/Stats';
import Partners from './newcomponents/Partners';
import WhyChoose from './newcomponents/WhyChoose';
import BlockchainSection from './newcomponents/BlockchainSection';
import CTASection from './newcomponents/CTASection';
import Vision from './newcomponents/Vision';
import Footer from './newcomponents/Footer';

// Pages
import ProjectsPage from './pages/dashboard/ProjectsPage';
import SignInPage from './pages/SignInPage';
import VerificationPage from './pages/VerificationPage'; // Add this import
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardProjects from './pages/dashboard/ProjectsPage';
import Donations from './pages/dashboard/Donations';
import AIInsights from './pages/dashboard/AIInsights';
import Reports from './pages/dashboard/Reports';
import Settings from './pages/dashboard/Settings.jsx';

// Context Providers
import { ThemeProvider } from './pages/dashboard/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder components
const Login = () => <h2 style={{ textAlign: 'center', marginTop: '100px' }}>Login Page</h2>;

// Wrapper component to add space for fixed navbar
const PageWrapper = ({ children }) => {
  return (
    <div style={{ paddingTop: '80px' }}>
      {children}
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isSignInRoute = location.pathname === '/signin' || location.pathname === '/login';
  const isVerificationRoute = location.pathname === '/verify-email'; // Add this

  // Show Navbar and Footer on all pages except SignIn/Login, Dashboard, and Verification
  const showLayout = !isDashboardRoute && !isSignInRoute && !isVerificationRoute;

  return (
    <>
      {showLayout && <Navbar />}

      <Routes>
        {/* ✅ New Landing Page Structure */}
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

        {/* Projects Page */}
        <Route
          path="/projects"
          element={
            <PageWrapper>
              <ProjectsPage />
              <Footer />
            </PageWrapper>
          }
        />

        {/* Donors Page - Now using the Donations component */}
        <Route
          path="/donors"
          element={
            <PageWrapper>
              <Donations />
              <Footer />
            </PageWrapper>
          }
        />

        {/* Sign In / Login Page */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/login" element={<Login />} />

        {/* Verification Page - Add this as a top-level route */}
        <Route path="/verify-email" element={<VerificationPage />} />

        {/* Dashboard Routes (no navbar/footer) - Protected with AuthProvider */}
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

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;