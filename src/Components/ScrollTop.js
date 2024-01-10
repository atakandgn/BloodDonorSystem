import {useEffect, useState} from "react";
import React from "react";
import {ChevronUpIcon} from "@heroicons/react/24/outline";

const ScrollTop = () => {
    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }, []);

    const [visible, setVisible] = useState(false)
    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true)
        } else if (scrolled <= 300) {
            setVisible(false)
        }
    };
    window.addEventListener('scroll', toggleVisible);
    return (
        <div className="block">
            <button
                onClick={() => {
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                }}
                style={{display: visible ? 'inline' : 'none'}}
                className=" rounded-md duration-300 transition hover:scale-110 fixed bottom-[60px] right-[30px] text-center z-50 shadow-xl border border-slate-300">
                <ChevronUpIcon className="m-2 w-[25px] h-[25px] "/>
            </button>
        </div>
    );
}
export default ScrollTop;