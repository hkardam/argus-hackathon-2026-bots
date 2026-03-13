/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSection from './features/grants/components/HeroSection'
import GrantCard from './features/grants/components/GrantCard'
import EligibilityCheck from './features/eligibility/components/EligibilityCheck'
import ApplicantLayout from './features/applicant-dashboard/components/ApplicantLayout'
import ApplicantDashboard from './features/applicant-dashboard/components/ApplicantDashboard'
import LoginPage from './features/auth/components/LoginPage'
import SignupPage from './features/auth/components/SignupPage'
import ProtectedRoute from './components/ProtectedRoute'
import DocumentVaultPage from './features/document/DocumentVaultPage'

const GRANTS = [
  {
    title: 'Community Development Grant (CDG)',
    purpose: 'Fund community-level infrastructure and social service projects.',
    fundingRange: '₹2,00,000 – ₹20,00,000',
    duration: '6 – 18 months',
    eligibleApplicants: ['NGOs', 'Trusts', 'Section 8 Companies'],
    tags: ['Community', 'Rural Development', 'Infrastructure'],
    image:
      'https://images.unsplash.com/photo-1593113563332-f14402886ab2?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Education Innovation Grant (EIG)',
    purpose:
      'Support technology-enabled or pedagogical innovations in education.',
    fundingRange: '₹5,00,000 – ₹50,00,000',
    duration: '12 – 24 months',
    eligibleApplicants: [
      'NGOs',
      'EdTech Nonprofits',
      'Universities',
      'Research Institutions',
    ],
    tags: ['Education', 'Innovation', 'Learning Outcomes'],
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Environment & Climate Action Grant (ECAG)',
    purpose:
      'Fund environmental conservation and climate resilience initiatives.',
    fundingRange: '₹3,00,000 – ₹30,00,000',
    duration: '6 – 24 months',
    eligibleApplicants: [
      'NGOs',
      'Farmer Producer Organisations',
      'Panchayat Bodies',
      'Research Institutions',
    ],
    tags: ['Climate', 'Environment', 'Sustainability'],
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
  },
]

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-page font-sans selection:bg-primary-selection selection:text-primary-dark">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <main>
                  <HeroSection />
                  <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {GRANTS.map((grant, index) => (
                        <GrantCard key={index} {...grant} />
                      ))}
                    </div>
                  </section>
                  <EligibilityCheck />
                </main>
                <Footer />
              </>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ApplicantLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ApplicantDashboard />} />
            <Route path="documents" element={<DocumentVaultPage />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  )
}
