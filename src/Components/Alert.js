import React, { useState, useEffect } from "react";
import { Alert, Typography } from "@material-tailwind/react";
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

function getIcon(type) {
    switch (type) {
        case "black":
            return <InformationCircleIcon className="w-6 h-6 mr-2" aria-hidden="true" />;
        case "gray":
            return <ExclamationCircleIcon className="w-6 h-6 mr-2" aria-hidden="true" />;
        case "yellow":
            return <ExclamationTriangleIcon className="w-6 h-6 mr-2" aria-hidden="true" />;
        case "green":
            return <CheckCircleIcon className="w-6 h-6 mr-2" aria-hidden="true" />;
        case "red":
            return <ExclamationCircleIcon className="w-6 h-6 mr-2" aria-hidden="true" />;
        default:
            return <CheckCircleIcon className="w-6 h-6 mr-2" aria-hidden="true" />;
    }
}

export function CustomAlert({ type, message, closeable = false }) {
    const [open, setOpen] = useState(true);

    const alertClasses = {
        black: "border-l-4 border-black bg-black/10 font-medium text-black",
        gray: "border-l-4 border-gray-500 bg-gray-500/10 font-medium text-gray-500",
        yellow: "border-l-4 border-yellow-500 bg-yellow-400/30 font-medium text-yellow-600",
        green: "border-l-4 border-green-500 bg-green-500/10 font-medium text-green-500",
        red: "border-l-4 border-red-500 bg-red-500/10 font-medium text-red-500",
    };

    const selectedClass = alertClasses[type] || alertClasses.black; // Default to black if type is not found

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        let timeout;

        if (open && !closeable) {
            timeout = setTimeout(() => {
                setOpen(false);
            }, 5000);
        }

        return () => clearTimeout(timeout);
    }, [open, closeable]);

    return (
        <>
            {open && (
                <div className={`w-full flex justify-center items-center transition-opacity duration-500 ${closeable ? 'my-3' : 'h-[25vh]'}`}>
                    <Alert
                        icon={getIcon(type)}
                        className={`relative rounded-none ${selectedClass}`}
                        animate={{
                            mount: { y: 0 },
                            unmount: { y: 100 },
                        }}
                    >
                        {closeable && (
                            <XMarkIcon
                                className="w-4 h-4 absolute top-2 right-2 cursor-pointer"
                                onClick={handleClose}
                            />
                        )}
                        <Typography variant="h6">
                            {message}
                        </Typography>
                    </Alert>
                </div>
            )}
        </>
    );
}
