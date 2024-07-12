import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {addTweet, editTweet, getTweetById} from "@/app/(home)/tweets/actions";
import {useRouter} from "next/navigation";

const schema = z.object({
    tweet: z.string().min(1, "Tweet content is required"),
});

interface TweetFormProps {
    onClose: () => void;
    id?: number;
}

const TweetForm: React.FC<TweetFormProps> = ({onClose, id}) => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {tweet: ""},
    });

    useEffect(() => {
        const fetchTweet = async (id: number) => {
            const data = await getTweetById(id);
            console.log(data, "data----------");
            setValue("tweet", data.tweet);
        };

        if (id) {
            fetchTweet(Number(id));
        }
    }, [id, setValue]);

    const onSubmit = async (data: {tweet: string}) => {
        try {
            if (id) {
                await editTweet(Number(id), data.tweet);
            } else {
                await addTweet(data.tweet);
            }
            router.refresh();
            onClose();
        } catch (error) {
            console.error((error as Error).message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Tweet</label>
                <textarea {...register("tweet")} className="w-full p-2 border rounded text-black" />
                {errors.tweet && <p className="text-red-500">{errors.tweet.message}</p>}
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                {id ? "Edit" : "Add"} Tweet
            </button>
        </form>
    );
};

export default TweetForm;
