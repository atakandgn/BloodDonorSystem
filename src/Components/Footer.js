import {IconButton, Typography} from "@material-tailwind/react";
import React from "react";
import {Link} from "react-router-dom";

export function Footer() {
    return (
        <footer className="w-full bg-white mt-12 container mx-auto">
            <div
                className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-center md:justify-between">
                <img
                    src="https://miro.medium.com/v2/da:true/resize:fit:700/1*62NsO-zG2nNWW1xuuZEUzA.gif"
                    alt=""
                    className="object-contain lg:w-[300px] lg:h-[75px] w-[150px] h-[75px]"/>

                <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
                    <li className="flex items-center space-x-4">
                        <Link to="https://github.com/atakandgn" target="_blank">
                            <IconButton className="text-2xl p-2">
                                <i className="fab fa-github text-blue-gray-100" />
                            </IconButton>
                        </Link>

                        <Link to="https://www.linkedin.com/feed/" target="_blank">
                            <IconButton className="text-2xl">
                                <i className="fab fa-linkedin text-blue-gray-100" />
                            </IconButton>
                        </Link>

                        <Link to="mailto:atakandogan.info@gmail.com">
                            <IconButton className="text-2xl">
                                <i className="fas fa-envelope text-blue-gray-100" />
                            </IconButton>
                        </Link>
                    </li>




                </ul>
            </div>
            <hr className="my-8 border-blue-gray-50"/>
            <Typography color="blue-gray" className="text-center font-normal">
                &copy; 2024 <i>Atakan Doğan</i>
            </Typography>
        </footer>
    );
}