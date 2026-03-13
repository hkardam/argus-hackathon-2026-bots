import { Search, Filter } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
          Explore Grant Programmes
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Browse available grants and check eligibility before applying. Discover funding opportunities to accelerate your impact.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm transition-shadow"
              placeholder="Search by keyword, sector, or location..."
            />
          </div>
          <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            Filters
          </button>
        </div>
      </div>
    </section>
  );
}
