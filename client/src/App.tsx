/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './features/grants/components/HeroSection';
import GrantCard from './features/grants/components/GrantCard';
import EligibilityCheck from './features/eligibility/components/EligibilityCheck';
import ApplicantLayout from './features/applicant-dashboard/components/ApplicantLayout';
import ApplicantDashboard from './features/applicant-dashboard/components/ApplicantDashboard';
import LoginPage from './features/auth/components/LoginPage';
import SignupPage from './features/auth/components/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import { grantService } from './features/grants/services/grantService';
import type { GrantProgramme } from './features/grants/types';

export default function App() {
  const [grants, setGrants] = useState<GrantProgramme[]>([]);
  const [selectedGrant, setSelectedGrant] = useState<GrantProgramme | null>(null);
  const eligibilityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    grantService.getAll().then(setGrants).catch(console.error);
  }, []);

  const handleCheckEligibility = (grant: GrantProgramme) => {
    setSelectedGrant(grant);
    setTimeout(() => {
      eligibilityRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-page font-sans selection:bg-primary-selection selection:text-primary-dark">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <main>
                <HeroSection />
                <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {grants.map((grant) => (
                      <GrantCard
                        key={grant.id}
                        grant={grant}
                        onCheckEligibility={handleCheckEligibility}
                      />
                    ))}
                  </div>
                </section>
                <div ref={eligibilityRef}>
                  <EligibilityCheck selectedGrant={selectedGrant} />
                </div>
              </main>
              <Footer />
            </>
          } />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <ApplicantLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ApplicantDashboard />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}
