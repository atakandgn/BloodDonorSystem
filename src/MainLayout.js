import React from "react";
import Navbar from "./Components/Navbar";
import {Footer} from "./Components/Footer";
import {Toaster} from "react-hot-toast";
import ScrollTop from "./Components/ScrollTop";
import {PopupProvider} from "./Helpers/PopupContext";

function MainLayout({children}) {
    return (

        <PopupProvider>
            <div className="relative">
                <Navbar/>
                <div className="container mx-auto min-h-[75vh] lg:px-0 px-2">{children}</div>
                <ScrollTop/>
                <Footer className="fixed bottom"/>
                <Toaster containerClassName="custom-toast-container"/>
            </div>
        </PopupProvider>

    )
}

export default MainLayout;