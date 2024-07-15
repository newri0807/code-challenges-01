import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import TweetList from "@/components/TweetList";
import AddTweet from "@/components/AddTweet";

interface TwitterPageProps {
    searchParams: {page?: string};
}

const TwitterPage: React.FC<TwitterPageProps> = ({searchParams}) => {
    const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;

    return (
        <div className="bg-black text-white min-h-screen w-full">
            <AddTweet />
            <TweetList initialPage={page} />
        </div>
    );
};

export default TwitterPage;
