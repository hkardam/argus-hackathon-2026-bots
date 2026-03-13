import React from 'react';
import { IndianRupee, Users, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GrantCardProps {
  key?: number | string;
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
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-48 w-full relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6 line-clamp-2 flex-1">{purpose}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <IndianRupee className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Funding Range</p>
              <p className="text-sm font-semibold text-gray-900">{fundingRange}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Project Duration</p>
              <p className="text-sm font-medium text-gray-900">{duration}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Eligible Applicants</p>
              <p className="text-sm font-medium text-gray-900 line-clamp-1" title={eligibleApplicants.join(', ')}>
                {eligibleApplicants.join(', ')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
          <button className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            View Details
          </button>
          <Link to="/login" className="flex-1 inline-flex justify-center items-center px-4 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
            Apply Now
            <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
