import { IndianRupee, Users, ArrowRight, Clock } from 'lucide-react';
import type { GrantProgramme } from '../types';

interface GrantCardProps {
  grant: GrantProgramme;
  onCheckEligibility: (grant: GrantProgramme) => void;
}

const GRANT_IMAGES: Record<string, string> = {
  CDG: "https://images.unsplash.com/photo-1593113563332-f14402886ab2?auto=format&fit=crop&q=80&w=800",
  EIG: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
  ECAG: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
  DEFAULT: "https://images.unsplash.com/photo-1454165833767-027eeef1596e?auto=format&fit=crop&q=80&w=800"
};

export default function GrantCard({ grant, onCheckEligibility }: GrantCardProps) {
  const getGrantCode = (name: string) => {
    if (name.includes('CDG')) return 'CDG';
    if (name.includes('EIG')) return 'EIG';
    if (name.includes('ECAG')) return 'ECAG';
    return 'DEFAULT';
  };

  const grantCode = getGrantCode(grant.name);
  const image = GRANT_IMAGES[grantCode] || GRANT_IMAGES.DEFAULT;

  return (
    <div className="flex flex-col bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-48 w-full relative overflow-hidden">
        <img src={image} alt={grant.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface/90 text-strong backdrop-blur-sm shadow-sm">
            {grant.grantType}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-heading mb-2 line-clamp-2">{grant.name}</h3>
        <p className="text-sm text-muted mb-6 line-clamp-2 flex-1">{grant.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <IndianRupee className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-subtle uppercase tracking-wider">Max Award Amount</p>
              <p className="text-sm font-semibold text-heading">₹{grant.maxAwardAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-accent-blue shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-subtle uppercase tracking-wider">Closes On</p>
              <p className="text-sm font-medium text-heading">{new Date(grant.applicationCloseDate).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-accent-purple shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-subtle uppercase tracking-wider">Current Stage</p>
              <p className="text-sm font-medium text-heading">{grant.currentStage}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border-subtle mt-auto">
          <button className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-border shadow-sm text-sm font-medium rounded-xl text-body bg-surface hover:bg-surface-hover transition-colors">
            View Details
          </button>
          <button
            onClick={() => onCheckEligibility(grant)}
            className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            Check Eligibility
            <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
