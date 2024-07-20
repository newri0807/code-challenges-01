import {XMarkIcon} from "@heroicons/react/24/outline";
import React, {ReactNode} from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 !pixel-border border-gray-700">
            <div className="bg-black overflow-hidden w-11/12 max-w-lg !pixel-border border-gray-700 border">
                <div className="p-4">
                    <button onClick={onClose} className="float-right text-white cursor-pointer">
                        <XMarkIcon className="text-white size-6" />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
