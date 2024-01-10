import React, { createContext, useState, useContext } from "react";

// Creating the Popup context.
const PopupContext = createContext();

// Popup provider for the Popup component.
export const PopupProvider = ({ children }) => {
    // Creating state for Popup status and a function to close it.
    const [popupOpen, setPopupOpen] = useState(true);

    // Function to close the Popup.
    const handleClosePopup = () => {
        setPopupOpen(false);
        // Getting a timestamp for the closing moment and storing it in session storage.
        const timestamp = new Date().getTime();
        sessionStorage.setItem("popupClosedTimestamp", timestamp.toString());
    };

    // Providing the context with its values.
    return (
        <PopupContext.Provider value={{ popupOpen, handleClosePopup }}>
            {children}
        </PopupContext.Provider>
    );
};

// Creating a custom hook named usePopup.
export const usePopup = () => {
    // Accessing the values from the context created with createContext using useContext.
    const context = useContext(PopupContext);
    // Throwing an error if the context is not used within a PopupProvider.
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    // Returning the values of the context.
    return context;
};
