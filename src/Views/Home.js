import React from 'react';
import MainLayout from "../MainLayout";
import { Card, List, ListItem } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { getDecodedToken } from "../Components/auth";
import toast from "react-hot-toast";

export default function Home() {
    const decodedToken = getDecodedToken();

    const handleLinkClick = (path) => {
        if (!decodedToken) {
            toast.error("Authentication required. Please log in.");
        }
    };

    return (
        <MainLayout>
            <div className="flex justify-center items-center w-full">
                <Card className="w-full justify-center items-center p-10">
                    <List className="bg-slate-300/10 rounded-lg shadow-2xl hover:scale-110 transition duration-200 hover:duration-200 ">
                        {decodedToken && (
                            <>
                                <ListItem>
                                    <Link className="!w-full !text-center"to="/create-donor" onClick={() => handleLinkClick("/create-donor")}>
                                        Create Donor
                                    </Link>
                                </ListItem>
                                <ListItem >
                                    <Link className="!w-full !text-center" to="/add-blood-to-bank" onClick={() => handleLinkClick("/add-blood-to-bank")}>
                                        Add Blood to Bank
                                    </Link>
                                </ListItem>
                            </>
                        )}
                        <ListItem >
                            <Link className="!w-full !text-center" to="/request-blood" onClick={() => handleLinkClick("/request-blood")}>
                                Request Blood
                            </Link>
                        </ListItem>
                    </List>
                </Card>
            </div>
        </MainLayout>
    );
}
