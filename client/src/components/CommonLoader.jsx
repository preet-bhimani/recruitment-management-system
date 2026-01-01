import React from "react";

function CommonLoader() {
    return <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 border-4 border-neutral-700 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-neutral-400">Loading...</p>
        </div>
    </div>;
}

export default CommonLoader;
