"use client";
import {useState} from "react";
import Modal from "@/components/Modal";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {User} from "@/lib/type";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {storage} from "@/lib/firebase";
import {CheckBadgeIcon, DocumentArrowUpIcon} from "@heroicons/react/24/outline";
import {updateUser} from "@/app/(home)/profile/[id]/actions";

// Validation schema using Zod
const profileSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email"),
    bio: z.string().optional(),
    avatar: z.string().optional(),
});

interface EditProfileModalProps {
    user: User;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({user}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        setValue, // Add setValue to set field values manually
        formState: {errors},
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user.username,
            email: user.email,
            bio: user.bio || "",
            avatar: user.avatar || "",
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const storageRef = ref(storage, `avatars/${file.name}`);
            setUploading(true);
            setUploadSuccess(false);
            try {
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                setValue("avatar", downloadURL); // Set the avatar field to the download URL
                setUploadSuccess(true);
            } catch (error) {
                console.error("File upload failed:", error);
            } finally {
                setUploading(false);
            }
        }
    };

    const onSubmit = async (data: Partial<User>) => {
        console.log("Submitting form:", data);

        const result = await updateUser({id: user.id, ...data});

        if (result.success) {
            setIsModalOpen(false);
        } else {
            console.error("Profile update failed");
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="pixel-button bg-black text-white px-4 py-2 rounded-full border border-gray-600 font-bold"
            >
                profile edit
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="avatarUpload" className="block text-sm font-medium text-gray-200">
                            Upload Avatar
                        </label>
                        <div className="flex items-center space-x-2">
                            <input type="file" id="avatarUpload" onChange={handleFileChange} className="hidden" accept="image/*" />
                            <label
                                htmlFor="avatarUpload"
                                className="cursor-pointer bg-gray-800 mt-2 text-gray-200 px-4 py-2 rounded-full flex items-center space-x-2"
                            >
                                <DocumentArrowUpIcon className="h-6 w-6 text-gray-400" />
                                <span>{uploading ? "Uploading..." : "Choose File"}</span>
                            </label>
                            {uploadSuccess && <CheckBadgeIcon className="h-6 w-6 text-green-500 mt-2" />}
                        </div>
                        {uploading && <p className="text-gray-200 mt-1">Uploading...</p>}
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            {...register("username")}
                            className="text-black h-10 indent-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.username && <p className="text-red-600">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email")}
                            className="text-black h-10 indent-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.email && <p className="text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-200">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            {...register("bio")}
                            className="text-black h-28 indent-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.bio && <p className="text-red-600">{errors.bio.message}</p>}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default EditProfileModal;
