import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CandidateProvider, useCandidates } from '../contexts/CandidateContext';
import { UIProvider } from '../contexts/UIContext';
import CommonNavbar from '../components/CommonNavbar';
import Footer from '../components/Footer';

// Find File Type
const getFileType = (url) => {
    if (!url || typeof url !== 'string' || url.trim() === '') return 'missing';
    const u = url.split('?')[0].toLowerCase();
    if (u.endsWith('.pdf')) return 'pdf';
    if (u.endsWith('.png') || u.includes('image/png')) return 'image';
    if (u.endsWith('.jpg') || u.endsWith('.jpeg') || u.includes('image/jpeg')) return 'image';
    return 'other';
};

// Document View UI
const DocCard = ({ label, url }) => {
    const type = getFileType(url);

    return (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs text-neutral-400">{type === 'missing' ? 'N/A' : type.toUpperCase()}</div>
            </div>

            <div className="flex-1 mb-3">

                {/* File Type Handling */}
                {type === 'missing' ? (
                    <div className="h-40 flex items-center justify-center rounded bg-neutral-800 text-neutral-500">Not provided</div>
                ) : type === 'pdf' ? (
                    <div className="w-full" style={{ minHeight: 220 }}>
                        <embed src={url} type="application/pdf" width="100%" height="220px" />
                    </div>
                ) : type === 'image' ? (
                    <div className="flex justify-center">
                        <img src={url} alt={label} className="max-h-56 object-contain rounded" />
                    </div>
                ) : (
                    <div className="text-sm text-neutral-300">
                        <a href={url} target="_blank" rel="noreferrer" className="underline text-indigo-300">Open file</a>
                    </div>
                )}
            </div>

            {/* Open Button */}
            <div className="flex gap-2">
                {type === 'missing' ? (
                    <div className="text-xs text-neutral-500 italic">No file</div>
                ) : (
                    <>
                        <a href={url} target="_blank" rel="noreferrer" className="px-3 py-1 text-sm bg-purple-800 rounded text-white border border-neutral-700">Open</a>
                    </>
                )}
            </div>
        </div>
    );
};

// Main Logic of UI 
const HRDocumentsCheckContent = () => {
    const { candidateId } = useParams();
    const navigate = useNavigate();
    const { candidates } = useCandidates();
    const candidate = useMemo(() => {
        if (!candidateId) return null;
        return candidates.find(c => String(c.id) === String(candidateId)) ?? null;
    }, [candidates, candidateId]);

    return (
        <div className="min-h-screen flex flex-col bg-neutral-950 text-white">
            {/* Navbar */}
            <CommonNavbar />

            {/* Main Layout */}
            <main className="flex-1 container mx-auto px-4 py-6">

                {/* If Candidate Not Found */}
                {!candidate ? (
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold">Documents</h2>
                            <p className="text-neutral-400 mt-2">Candidate not found. Please go back to the HR list and select a candidate.</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => navigate('/hr-feedback')} className="px-3 py-2 bg-purple-600 rounded text-sm text-white">Go Back</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* If Candidate Found */}
                        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 mb-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                {/* Candidate Details Name, Email, Phone and Status*/}
                                <div className="flex items-start gap-4">
                                    <img src={candidate.photo} alt={candidate.fullName} className="w-14 h-14 rounded-full border border-neutral-700 object-cover" />
                                    <div className="min-w-0">
                                        <h1 className="text-2xl font-semibold truncate">{candidate.fullName}</h1>
                                        <div className="text-sm text-neutral-400 mt-1">{candidate.email} • {candidate.phone}</div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs text-white ${(() => {
                                                const s = candidate.overallStatus;
                                                return ({
                                                    Selected: 'bg-green-600',
                                                }[s] || 'bg-neutral-700');
                                            })()}`}>{candidate.overallStatus}</span>

                                            {candidate.overallStatus === 'Selected' && (
                                                <span className="px-2 py-0.5 rounded-full text-xs bg-purple-600">{candidate.selectionStatus ?? 'Document Pending'}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Documents Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                            {/* Document Card View */}
                            <DocCard label="Aadhar Card" url={(candidate.documents && candidate.documents.aadhar) || null} />
                            <DocCard label="PAN Card" url={(candidate.documents && candidate.documents.pan) || null} />
                            <DocCard label="Experience Letter" url={(candidate.documents && candidate.documents.experienceLetter) || null} />
                        </div>

                        {/* Bank Details */}
                        <div className="mt-6 bg-neutral-900 border border-neutral-700 rounded-lg p-4">
                            <h3 className="text-sm text-xl font-semibold mb-3">Bank Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-neutral-300">

                                {/* Bank Name */}
                                <div>
                                    <div className="text-purple-300 text-xs">Bank Name</div>
                                    <div className="text-white text-2xl mt-1">{candidate.documents.bankName || <span className="text-neutral-500">Not provided</span>}</div>
                                </div>

                                {/* Account Number */}
                                <div>
                                    <div className="text-purple-300 text-xs">Account Number</div>
                                    <div className="text-white text-2xl mt-1">{candidate.documents.bankAccount || <span className="text-neutral-500">Not provided</span>}</div>
                                </div>

                                {/* IFSC Code */}
                                <div>
                                    <div className="text-purple-300 text-xs">IFSC Code</div>
                                    <div className="text-white text-2xl  mt-1">{candidate.documents.bankIFSC || <span className="text-neutral-500">Not provided</span>}</div>
                                </div>
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="mt-6 flex gap-3 items-center">
                            <button onClick={() => navigate('/hr-feedback')} className="px-3 py-2 rounded text-sm text-white bg-purple-600">Back to HR Dashboard</button>
                        </div>
                    </>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

const HRDocumentsCheck = () => (
    <CandidateProvider>
        <UIProvider>
            <HRDocumentsCheckContent />
        </UIProvider>
    </CandidateProvider>
);

export default HRDocumentsCheck;
