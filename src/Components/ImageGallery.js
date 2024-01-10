import React, { useState, useEffect } from "react";

const SkeletonLoader = () => (
    <div className="relative grid h-56 mx-4 mt-4 overflow-hidden text-gray-700 bg-gray-300 bg-clip-border rounded-xl place-items-center animate-pulse">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-12 h-12 text-gray-500"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            ></path>
        </svg>
    </div>
);

export function ImageGallery({ images }) {
    const [active, setActive] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (images && images.length > 0) {
            setIsLoading(true);
            setActive(images[0]);
            // Simulating an image loading delay (you can remove this in a real application)
            const loadingTimeout = setTimeout(() => {
                setIsLoading(false);
            }, 500);

            return () => clearTimeout(loadingTimeout);
        }
    }, [images]);

    if (!images || images.length === 0) {
        return <div>No images available.</div>;
    }

    const data = images.map((image) => ({
        imgelink: image,
    }));

    return (
        <div className="grid gap-4">
            <div>
                {isLoading ? (
                    <SkeletonLoader />
                ) : (
                    <img
                        className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
                        src={active}
                        alt=""
                    />
                )}
            </div>
            <div className="grid grid-cols-5 gap-4">
                {data.map(({ imgelink }, index) => (
                    <div key={index}>
                        {isLoading ? (
                            <SkeletonLoader />
                        ) : (
                            <img
                                onClick={() => setActive(imgelink)}
                                src={imgelink}
                                className="h-20 max-w-full cursor-pointer rounded-lg object-cover object-center"
                                alt=""
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
