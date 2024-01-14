import React from 'react';
import './index.css';
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import HomePage from "./Views/Home";
import NotFound from "./Views/NotFound";
import CreateDonor from "./Views/CreateDonor";
import AddBloodToBank from "./Views/AddBloodToBank";
import RequestBlood from "./Views/RequestBlood";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="*" element={<NotFound/>}/> {/* 404 */}
                <Route path="/create-donor" element={<CreateDonor/>}/>
                <Route path="/add-blood-to-bank" element={<AddBloodToBank/>}/>
                <Route path="/request-blood" element={<RequestBlood/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
