import React, {useEffect, useState, useCallback, useRef} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {addTweet, editTweet, getTweetById} from "@/app/(home)/tweets/[id]/actions";
import {useRouter} from "next/navigation";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import Image from "next/image";
import {DocumentArrowUpIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {storage} from "@/lib/firebase";
import SubmitButton from "./SubmitButton";

const schema = z.object({
    tweet: z.string().min(1, "Tweet content is required"),
});

interface TweetFormProps {
    onClose: () => void;
    id?: number;
    initialData?: {tweet: string; image: string | null};
}

const TweetForm: React.FC<TweetFormProps> = ({onClose, id, initialData}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(!initialData && !!id);
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: initialData || {tweet: ""},
    });

    const [selectedFileModal, setSelectedFileModal] = useState<File | null>(null);
    const [imagePreviewModal, setImagePreviewModal] = useState<string | null>(initialData?.image || null);
    const [imageRemoved, setImageRemoved] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    const fetchTweet = useCallback(
        async (tweetId: number) => {
            setIsLoading(true);
            try {
                const data = await getTweetById(tweetId);
                setValue("tweet", data.tweet);
                setImagePreviewModal(data.image);
            } catch (error) {
                console.error("Failed to fetch tweet:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [setValue]
    );

    useEffect(() => {
        if (id && !initialData) {
            fetchTweet(id);
        }
    }, [id, initialData, fetchTweet]);

    const onSubmit = async (data: {tweet: string}) => {
        let imageUrl: string | null = null;

        if (imageRemoved) {
            imageUrl = null;
        } else if (selectedFileModal) {
            const storageRef = ref(storage, `tweets/${selectedFileModal.name}`);
            const snapshot = await uploadBytes(storageRef, selectedFileModal);
            imageUrl = await getDownloadURL(snapshot.ref);
        } else if (imagePreviewModal) {
            imageUrl = imagePreviewModal;
        }

        try {
            if (id) {
                await editTweet(id, data.tweet, imageUrl);
            } else {
                await addTweet(data.tweet, imageUrl);
            }
            router.refresh();
            onClose();
        } catch (error) {
            console.error("Failed to submit tweet:", error);
        }
    };

    const handleFileChangeModal = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFileModal(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewModal(reader.result as string);
            };
            reader.readAsDataURL(file);
            setImageRemoved(false);
        }
    };

    const handleRemoveImageModal = () => {
        setSelectedFileModal(null);
        setImagePreviewModal(null);
        setImageRemoved(true);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Tweet</label>
                <textarea
                    {...register("tweet")}
                    className={`w-full p-2 border text-black ${isLoading ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    disabled={isLoading}
                    placeholder={isLoading ? "Loading..." : "What's happening?"}
                />
                {errors.tweet && <p className="text-red-500">{errors.tweet.message}</p>}
            </div>
            <div className="my-2">
                <div className="flex items-center justify-between space-x-2">
                    <div className="flex gap-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="imageFileModal"
                            name="imageFileModal"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChangeModal}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={handleImageButtonClick}
                            className={`pixel-button bg-gray-700 text-gray-200 px-2 py-2 rounded-full flex items-center space-x-2 
                                ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"}`}
                            disabled={isLoading}
                        >
                            <DocumentArrowUpIcon className="h-6 w-6 text-gray-400" />
                        </button>
                        {imagePreviewModal && (
                            <button
                                type="button"
                                className={`pixel-button bg-gray-700 text-white font-bold py-2 px-2 rounded-full 
                                             ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-900"}`}
                                onClick={handleRemoveImageModal}
                                disabled={isLoading}
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    <SubmitButton
                        onClick={handleSubmit(onSubmit)}
                        idleText={`${id ? "Edit" : "Add"} Tweet`}
                        className={`pixel-button bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    />
                </div>
                {imagePreviewModal && (
                    <div className="mt-4">
                        <Image
                            src={imagePreviewModal}
                            width={400}
                            height={300}
                            alt="Image preview"
                            className="rounded-lg max-h-60 w-full h-auto object-contain"
                        />
                    </div>
                )}
            </div>
        </form>
    );
};

export default TweetForm;
