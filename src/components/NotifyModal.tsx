import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

const NotifyModal = ({isOpen, onClose, title, message,}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="dark:bg-[#0f172a] bg-stone-200 text-white rounded-lg shadow-lg p-6 w-80 border dark:border-teal-600 border-stone-600">
                <h2 className="text-lg font-semibold mb-4 dark:text-white text-stone-700">{title}</h2>
                <div className="mb-4 dark:text-white text-stone-700">{message}</div>
                <div className="flex justify-end">
                    <button
                        className="px-4 py-2 dark:bg-teal-600 rounded dark:hover:bg-teal-500 bg-stone-600 hover:bg-stone-500"
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotifyModal;