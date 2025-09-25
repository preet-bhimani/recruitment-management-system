import React from 'react';
import { CandidateProvider } from '../contexts/CandidateContext';
import { UIProvider } from '../contexts/UIContext';
import { FilterProvider } from '../contexts/FilterContext';
import CommonNavbar from '../components/CommonNavbar';
import RecruiterSidebar from './RecruiterSidebar';
import FilterSection from '../components/FilterSection';
import CandidateList from '../components/CandidateList';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';
import { useUI } from '../contexts/UIContext';

const RecruiterCandidateContent = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useUI();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950">
      {/* Navbar */}
      <CommonNavbar isLoggedIn={true} role="Recruiter" />

      <div className="flex flex-1">
        {/* Sidebar */}
        <RecruiterSidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />

        {/* Main Layout */}
        <main className="flex-1 transition-all duration-300 text-neutral-300">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Candidate Management</h1>
              <p className="text-neutral-400">Review and manage candidate applications</p>
            </div>
            <FilterSection />
            <CandidateList />
            <Pagination />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

const RecruiterCandidate = () => {
  return (
    <CandidateProvider>
      <UIProvider>
        <FilterProvider>
          <RecruiterCandidateContent />
        </FilterProvider>
      </UIProvider>
    </CandidateProvider>
  );
};

export default RecruiterCandidate;
