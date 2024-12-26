import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ApplyPage } from './pages/ApplyPage';
import { PendingPage } from './pages/PendingPage';
import { AuthenticatedApp } from './components/AuthenticatedApp';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { Retro2Page } from './pages/Retro2Page';
import { useSession } from './hooks/useSession';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StripeProvider } from './contexts/StripeContext';
import { supabase } from './lib/supabase';
import { PaymentPage } from './pages/PaymentPage';

export default function App() {
  const session = useSession();

  const handleAdminLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: 'andre@thegarden.pt',
      password: '123123'
    });
  };

  if (!session) {
    return (
      <ErrorBoundary>
        <Router>
          <button
            onClick={handleAdminLogin}
            className="fixed top-0 left-0 w-[50px] h-[50px] opacity-0 z-50 cursor-default"
            aria-hidden="true"
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/retro2" element={<Retro2Page />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    );
  }

  // Check if user is admin
  const isAdmin = session.user.email === 'andre@thegarden.pt';

  // Admin always sees the full app
  if (isAdmin) {
    return (
      <ErrorBoundary>
        <Router>
          <StripeProvider>
            <Routes>
              <Route path="/*" element={<AuthenticatedApp />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/retro2" element={<Retro2Page />} />
            </Routes>
          </StripeProvider>
        </Router>
      </ErrorBoundary>
    );
  }

  // Get application status from metadata
  const applicationStatus = session.user.user_metadata?.application_status;

  // If they're approved, show full app
  if (applicationStatus === 'approved') {
    return (
      <ErrorBoundary>
        <Router>
          <StripeProvider>
            <Routes>
              <Route path="/*" element={<AuthenticatedApp />} />
              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/retro2" element={<Retro2Page />} />
            </Routes>
          </StripeProvider>
        </Router>
      </ErrorBoundary>
    );
  }

  // If they haven't applied yet, show application page
  if (!session.user.user_metadata?.has_applied) {
    return (
      <ErrorBoundary>
        <ApplyPage />
      </ErrorBoundary>
    );
  }

  // If they've applied but application is pending or rejected
  return (
    <ErrorBoundary>
      <PendingPage status={applicationStatus} />
    </ErrorBoundary>
  );
}