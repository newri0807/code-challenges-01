import React from "react";
import LeftSidebar from "@/components/LeftSidebar";
import TweetList from "@/components/TweetList";

interface TwitterPageProps {
    searchParams: {page?: string};
}

const TwitterPage: React.FC<TwitterPageProps> = ({searchParams}) => {
    const page = typeof searchParams.page === "string" ? Number(searchParams.page) : 1;

    return <TweetList initialPage={page} />;
};

export default TwitterPage;
