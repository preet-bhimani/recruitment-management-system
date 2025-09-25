import React from 'react';
import { useFilters } from '../contexts/FilterContext';
import CandidateCard from './CandidateCard';

const CandidateList = () => {
  const { paginatedCandidates, filteredCandidates, clearAllFilters } = useFilters();

  return (
    <>
      {/* Show Message Accordings Filter */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-neutral-400">
          Showing <span className="text-white font-medium">{paginatedCandidates.length}</span> of <span className="text-white font-medium">{filteredCandidates.length}</span> candidates
        </p>
      </div>
      <div className="space-y-4">
        {paginatedCandidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>

      {/* If No Candidates Found */}
      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-400">No candidates match the current filters.</p>
          <button
            onClick={clearAllFilters}
            className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white text-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </>
  );
};

export default CandidateList;
