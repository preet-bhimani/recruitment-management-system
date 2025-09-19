import React from "react";
import { Linkedin } from "lucide-react";
import logo from '../photos/company logo/ROIMA.jpeg';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-700 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Company Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
            <img 
              src={logo}
              alt="Company Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* All Links */}
        <div className="flex items-center gap-8">
          <a href="/about" className="text-neutral-400 hover:text-white text-sm transition">
            About
          </a>
          <a href="/life-at-company" className="text-neutral-400 hover:text-white text-sm transition">
            Life At Company
          </a>
          <a href="/jobs" className="text-neutral-400 hover:text-white text-sm transition">
            Jobs
          </a>
        </div>

        {/* LinkedIn & Address */}
        <div className="flex items-center gap-6">
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 bg-neutral-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition"
          >
            <Linkedin className="w-4 h-4 text-neutral-300 hover:text-white" />
          </a>
          
          <p className="text-neutral-400 text-sm">
            Säterinkatu 6, 02600 Espoo, Finland
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
