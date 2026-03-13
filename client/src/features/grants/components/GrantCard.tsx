import { IndianRupee, Users, ArrowRight, Clock } from 'lucide-react';

interface GrantCardProps {
  title: string;
  purpose: string;
  fundingRange: string;
  duration: string;
  eligibleApplicants: string[];
  tags: string[];
  image: string;
}

export default function GrantCard({ title, purpose, fundingRange, duration, eligibleApplicants, tags, image }: GrantCardProps) {
  return (
    <div className="flex flex-col bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-48 w-full relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface/90 text-strong backdrop-blur-sm shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-heading mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-muted mb-6 line-clamp-2 flex-1">{purpose}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <IndianRupee className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-subtle uppercase tracking-wider">Funding Range</p>
              <p className="text-sm font-semibold text-heading">{fundingRange}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-accent-blue shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-subtle uppercase tracking-wider">Project Duration</p>
              <p className="text-sm font-medium text-heading">{duration}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-accent-purple shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-subtle uppercase tracking-wider">Eligible Applicants</p>
              <p className="text-sm font-medium text-heading line-clamp-1" title={eligibleApplicants.join(', ')}>
                {eligibleApplicants.join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-border-subtle mt-auto">
          <button className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-border shadow-sm text-sm font-medium rounded-xl text-body bg-surface hover:bg-surface-hover transition-colors">
            View Details
          </button>
          <button className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary-hover transition-colors">
            Apply Now
            <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
