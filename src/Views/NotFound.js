import React from 'react';
import {Link} from "react-router-dom";
export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

            <img src="https://via.placeholder.com/150" alt="404 Illustration" className="w-64 mb-8"/>

                <h1 className="text-2xl font-bold text-gray-700 mb-2">404 Not Found</h1>

                <p className="text-gray-600 mb-6">The page you are looking for could not be found.</p>

                <Link to="/" className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded shadow">Go back
                    home</Link>

                <div className="flex items-center justify-center mt-8">

                    <Link to="https://twitter.com" target="_blank" className=" mr-4 hover:text-gray-800 cursor-pointer bg-red-400">

                        <i className="fab fa-twitter"></i>

                    </Link>

                    <Link to="https://facebook.com" target="_blank" className=" mr-4 hover:text-gray-800">

                        <i className="fab fa-facebook"></i>

                    </Link>

                    <Link to="https://instagram.com" target="_blank" className=" hover:text-gray-800">

                        <i className="fab fa-instagram"></i>

                    </Link>

                </div>

        </div>
)
}