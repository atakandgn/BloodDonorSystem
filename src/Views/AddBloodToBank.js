import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import axios from 'axios';
import {getDecodedToken} from "../Components/auth";
import MainLayout from "../MainLayout";
import {Button, Input, Typography} from "@material-tailwind/react";

const AddBloodToBank = () => {
    const token = localStorage.getItem("token");
    const decodedToken = getDecodedToken();

    const [donors, setDonors] = useState([]);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [units, setUnits] = useState('');

    useEffect(() => {
        fetchDonors();
    }, []);

    const fetchDonors = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getAllDonors');
            setDonors(response.data);
        } catch (error) {
            console.error('Error fetching donors:', error);
        }
    };

    const handleDonorChange = (selectedOption) => {
        setSelectedDonor(selectedOption);
    };

    const handleUnitsChange = (e) => {
        const inputValue = e.target.value;

        if (!isNaN(inputValue) || inputValue === '') {
            setUnits(inputValue);
        }
    };


    const handleSubmit = async () => {
        if (!decodedToken) {
            console.error("Authentication required. Please log in.");
            return;
        }

        if (!selectedDonor || !units) {
            console.error("Please select a donor and enter the number of units.");
            return;
        }

        const donorId = selectedDonor.value;
        const donationDate = new Date().toISOString().slice(0, 10);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await axios.post('http://localhost:5000/addBloodToBank', {
                branch_id: decodedToken.branch_id,
                donor_id: donorId,
                units: parseInt(units),
            }, config);
            console.log("atakan: ", response)

            if (response.status === 200) {
                console.log("Blood added to the bank successfully:", response.data.message);
            } else {
                console.error("Error adding blood to the bank:", response.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {

    }, [donors]);

    return (
        <MainLayout>
                <Typography color="blue-gray" className="text-center font-normal text-3xl">
                    Add Blood to Bank Form
                </Typography>
                <Typography color="blue-gray" className="text-center font-normal text-lg">
                    Please fill out the form below to add blood to the bank.
                </Typography>

            <div className="mt-8">
                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-4">
                        <Typography color="blue-gray" variant="h3" className="">
                            Branch: <span className="underline underline-offset-8">{decodedToken.branch_name}</span>
                        </Typography>
                        <Select
                            value={selectedDonor}
                            onChange={handleDonorChange}
                            options={donors.map((donor) => ({
                                value: donor.donor_id,
                                label: `${donor.donor_name} ${donor.donor_surname} (${donor.blood_type.type_name})`,
                            }))}
                            isSearchable
                            placeholder="Search donors..."
                        />

                    </div>
                    <div className="flex sm:flex-row flex-col gap-4">
                        <Input
                            variant="outlined" label="Unit" placeholder="Specify number of units"
                            value={units} onChange={handleUnitsChange}/>
                        <Input variant="outlined" label="Date" value={new Date().toISOString().slice(0, 10)} disabled/>

                    </div>

                    <Button
                        className="mt-4 w-1/2 mx-auto"
                        onClick={handleSubmit}>Submit</Button>
                </div>

            </div>

        </MainLayout>
    )
        ;
};

export default AddBloodToBank;
