import React, {useEffect, useState} from "react";
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

    const [selectedFileModal, setSelectedFileModal] = useState<File | null>(null);
    const [imagePreviewModal, setImagePreviewModal] = useState<string | null>(null);
    const [imageRemoved, setImageRemoved] = useState(false);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchTweet = async (id: number) => {
            const data = await getTweetById(id);
            setValue("tweet", data.tweet);
            if (data.image) {
                setImagePreviewModal(data.image);
                setOriginalImageUrl(data.image);
            }
        };

        if (id) {
            fetchTweet(Number(id));
        }
    }, [id, setValue]);

    const onSubmit = async (data: {tweet: string}) => {
        let imageUrl: string | null = null;

        if (imageRemoved) {
            imageUrl = null;
        } else if (selectedFileModal) {
            const storageRef = ref(storage, `tweets/${selectedFileModal.name}`);
            const snapshot = await uploadBytes(storageRef, selectedFileModal);
            imageUrl = await getDownloadURL(snapshot.ref);
        } else if (originalImageUrl) {
            imageUrl = originalImageUrl;
        }

        try {
            if (id) {
                await editTweet(Number(id), data.tweet, imageUrl);
            } else {
                await addTweet(data.tweet, imageUrl);
            }
            router.refresh();
            onClose();
        } catch (error) {
            console.error((error as Error).message);
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
                <textarea {...register("tweet")} className="w-full p-2 border rounded text-black" />
                {errors.tweet && <p className="text-red-500">{errors.tweet.message}</p>}
            </div>
            <div className="my-2">
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        id="imageFileModal"
                        name="imageFileModal"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChangeModal}
                    />
                    <label
                        htmlFor="imageFileModal"
                        className="cursor-pointer bg-gray-700 hover:bg-gray-800 text-gray-200 px-2 py-2 rounded-full flex items-center space-x-2"
                    >
                        <DocumentArrowUpIcon className="h-6 w-6 text-gray-400" />
                    </label>
                    {imagePreviewModal && (
                        <button
                            type="button"
                            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-2 rounded-full"
                            onClick={handleRemoveImageModal}
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    )}
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
            <SubmitButton
                onClick={handleSubmit(onSubmit)}
                idleText={`${id ? "Edit" : "Add"} Tweet`}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            />
        </form>
    );
};

export default TweetForm;
