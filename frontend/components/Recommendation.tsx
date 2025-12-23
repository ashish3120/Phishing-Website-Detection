import React from "react";

const Recommendation: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="rounded-lg bg-red-500/10 border border-red-400/20 p-4 text-sm text-red-300">
            <strong className="block mb-1">Recommended Action</strong>
            {text}
        </div>
    );
};

export default Recommendation;
