import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

const SelectBox = ({ value, onChange, label, options, disabled, smallLabel }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const selectBoxRef = useRef(null);

    const toggleDropdown = () => {
        setIsAnimating(true);
        setIsOpen((prevIsOpen) => !prevIsOpen);
    };

    const closeDropdown = () => {
        setIsAnimating(true);
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = (event) => {
                if (selectBoxRef.current && !selectBoxRef.current.contains(event.target)) {
                    closeDropdown();
                }
            };

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen]);

    const handleTransitionEnd = () => {
        setIsAnimating(false);
    };

    return (
        <div className="relative inline-block text-left w-full" ref={selectBoxRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className={`relative inline-flex justify-between items-center w-full px-4 py-2 border-b focus:outline-none ${
                    isOpen ? 'border-black' : 'border-gray-200'
                } bg-white hover:bg-gray-50/10`}
                disabled={disabled}
            >
                {smallLabel && (
                    <div className="absolute -top-2 left-0 text-xs mb-1 text-gray-500">{smallLabel}</div>
                )}
                {value || label}
                <ChevronDownIcon
                    className={`h-5 w-5 ml-2 transition-transform transform ${isAnimating ? 'rotate-180' : isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                />
                <div
                    onTransitionEnd={handleTransitionEnd}
                    className={`absolute bottom-0 left-1/2 bg-black transition-transform transform ${
                        isOpen ? 'translate-x-[-50%] scale-x-100' : 'translate-x-[-50%] scale-x-0'
                    }`}
                    style={{ height: '1px', width: '100%', transformOrigin: '50% 0', transitionDuration: '0.3s' }}
                />
            </button>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-y-auto max-h-48"
                    style={{ width: 'calc(100% - 2px)' }}
                >
                    <div className="py-1">
                        {options.map((option) => (
                            <div
                                key={option}
                                className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 ${
                                    value === option ? 'bg-gray-100 text-black hover:bg-slate-100' : ''
                                }`}
                                onClick={() => {
                                    onChange(option); // Pass the option directly, not an object
                                    closeDropdown();
                                }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectBox;