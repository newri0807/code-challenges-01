import React from "react";

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center align-middle max-h-60">
        <div className="animate-spin rounded-full h-12 w-12 !pixel-border-t  border-t-2 !pixel-border-b border-b-2 !pixel-border-b border-blue-500"></div>
    </div>
);

export default LoadingSpinner;
