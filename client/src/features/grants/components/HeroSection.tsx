import { Search, Filter } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-heading tracking-tight mb-6">
          Explore Grant Programmes
        </h1>
        <p className="text-lg md:text-xl text-muted mb-10">
          Browse available grants and check eligibility before applying. Discover funding opportunities to accelerate your impact.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-faint" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl leading-5 bg-surface placeholder-subtle focus:outline-none focus:ring-2 focus:ring-primary-ring focus:border-primary-ring sm:text-sm shadow-sm transition-shadow"
              placeholder="Search by keyword, sector, or location..."
            />
          </div>
          <button className="inline-flex items-center justify-center px-6 py-3 border border-border shadow-sm text-sm font-medium rounded-xl text-body bg-surface hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-ring transition-colors">
            <Filter className="h-4 w-4 mr-2 text-subtle" />
            Filters
          </button>
        </div>
      </div>
    </section>
  );
}
