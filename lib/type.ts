export type Tweet = {
    id: number;
    tweet: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
    user: {
        id: number;
        username: string;
        password: string;
        email: string;
        bio: string | null;
        created_at: Date;
        updated_at: Date;
    };
    responses?: Response_[];
    likes?: Like[];
};

export type Response_ = {
    id: number;
    content: string;
    userId: number;
    created_at: Date;
    updated_at?: Date;
    tweetId: number;
    user: {
        id: number;
        username: string;
        avatar: string | null;
    };
};

export type Like = {
    id: number;
    created_at: Date;
    userId: number;
    tweetId: number;
};

export type User = {
    id: number;
    username: string;
    email: string;
    bio?: string | null;
    avatar?: string | null;
};
