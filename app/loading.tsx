import Image from "next/image";
import React from "react";

const loading = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full">
            <div className="text-6xl animate-bounce">
                <Image width={134} height={134} src={"/logo0.png"} alt="logo0.png" />
            </div>
        </div>
    );
};

export default loading;
