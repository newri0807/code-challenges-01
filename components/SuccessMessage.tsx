import {CheckBadgeIcon} from "@heroicons/react/24/solid";

const SuccessMessage = () => (
    <div className="mt-4 p-2 bg-green-500 text-white font-bold rounded-2xl flex items-center justify-center">
        <CheckBadgeIcon className=" h-5 w-5 mr-3" />
        Welcome back!
    </div>
);

export default SuccessMessage;
