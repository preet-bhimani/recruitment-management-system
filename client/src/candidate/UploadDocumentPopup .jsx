import React from "react";

const UploadDocumentPopup = ({ pendingList, onClose, onSelect }) => {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-neutral-900 w-full max-w-md p-6 rounded-lg shadow-lg border border-neutral-800">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
                Select Job to Upload Documents
            </h2>

            {/* Select Job From Below List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
                {pendingList.map((item) => (
                    <button
                        key={item.jaId}
                        onClick={() => onSelect(item)}
                        className="w-full text-left bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-lg border border-neutral-700 transition">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-neutral-400">
                            Applied On: {item.appliedDate?.split("T")[0] ?? ""}
                        </div>
                    </button>
                ))}
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="mt-5 w-full py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition">
                Cancel
            </button>
        </div>
    </div>;
};

export default UploadDocumentPopup;
