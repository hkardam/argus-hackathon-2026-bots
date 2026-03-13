import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import GrantCard from '../components/GrantCard';
import EligibilityCheck from '../components/EligibilityCheck';
import Footer from '../components/Footer';

const GRANTS = [
  {
    title: "Community Development Grant (CDG)",
    purpose: "Fund community-level infrastructure and social service projects.",
    fundingRange: "₹2,00,000 – ₹20,00,000",
    duration: "6 – 18 months",
    eligibleApplicants: ["NGOs", "Trusts", "Section 8 Companies"],
    tags: ["Community", "Rural Development", "Infrastructure"],
    image: "https://images.unsplash.com/photo-1593113563332-f14402886ab2?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Education Innovation Grant (EIG)",
    purpose: "Support technology-enabled or pedagogical innovations in education.",
    fundingRange: "₹5,00,000 – ₹50,00,000",
    duration: "12 – 24 months",
    eligibleApplicants: ["NGOs", "EdTech Nonprofits", "Universities", "Research Institutions"],
    tags: ["Education", "Innovation", "Learning Outcomes"],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Environment & Climate Action Grant (ECAG)",
    purpose: "Fund environmental conservation and climate resilience initiatives.",
    fundingRange: "₹3,00,000 – ₹30,00,000",
    duration: "6 – 24 months",
    eligibleApplicants: ["NGOs", "Farmer Producer Organisations", "Panchayat Bodies", "Research Institutions"],
    tags: ["Climate", "Environment", "Sustainability"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
  }
];

export default function PublicCatalogue() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900">
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
    </div>
  );
}
