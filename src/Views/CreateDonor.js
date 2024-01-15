import React, { useState, useEffect } from 'react';
import MainLayout from "../MainLayout";
import { Typography, Input, Button } from "@material-tailwind/react";
import { getDecodedToken } from "../Components/auth";
import SelectBox from "../Components/SelectBox";
import axios from "axios";
import toast from "react-hot-toast";

const CreateDonor = () => {
    const decodedToken = getDecodedToken();

    // State for form fields
    const [donorName, setDonorName] = useState('');
    const [donorSurname, setDonorSurname] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [donorPhone, setDonorPhone] = useState('');
    const [donorImage, setDonorImage] = useState(null);
    const [donorBloodType, setDonorBloodType] = useState('');

    // State for city and districts options
    const [citiesData, setCitiesData] = useState([]);
    const [bloodTypes, setBloodTypes] = useState([]);

    // Selected city and district
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    useEffect(() => {
        getCountry();
        getBloodTypes();
    }, []);

    const getCountry = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getCountry');
            setCitiesData(response.data);
        } catch (error) {
            console.error('Error fetching city data:', error);
        }
    };

    const getBloodTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getBloodTypes');
            setBloodTypes(response.data);
        } catch (error) {
            console.error('Error fetching blood types:', error);
        }
    };

    const handleCityChange = (value) => {
        setSelectedCity(value);
    };

    const handleDistrictChange = (value) => {
        const selectedCityData = citiesData.find((city) => city.city_name === selectedCity);
        const selectedDistrictData = selectedCityData?.districts.find((district) => district.district_name === value);

        if (selectedDistrictData) {
            setSelectedDistrict(selectedDistrictData.district_id);
        }
    };


    const handleBloodTypeChange = (selectedBloodType) => {
        const selectedBloodTypeData = bloodTypes.find((type) => type.type_name === selectedBloodType);

        if (selectedBloodTypeData) {
            setDonorBloodType(selectedBloodTypeData.type_id);
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setDonorImage(file.name);
    };
    const handleInputChange = (e) => {
        // Use regex to allow only numeric characters
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        setDonorPhone(numericValue);
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        try {
            const token = localStorage.getItem("token");

            // Create FormData object to handle file upload
            const formData = new FormData();


            // Append other form data fields
            formData.append('donor_name', donorName);
            formData.append('donor_surname', donorSurname);
            formData.append('donor_email', donorEmail);
            formData.append('donor_img', donorImage);
            formData.append('donor_phone', donorPhone);
            formData.append('donor_address', selectedDistrict);
            formData.append('donor_blood_type', donorBloodType);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };

            const response = await axios.post("http://localhost:5000/createDonor", formData, config);

            if (response.status === 200) {
                console.log("Donor created successfully:", response.data);
                toast.success("Donor created successfully!");
            } else {
                console.error("Error creating donor:", response.data);
                toast.error("Can't create donor! Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    return (
        <MainLayout>
            <div className="my-4 container mx-auto">
                <Typography color="blue-gray" className="text-center font-normal text-3xl">
                    Create Donor Form
                </Typography>
                <Typography color="blue-gray" className="text-center font-normal text-lg">
                    Please fill out the form below to create a new donor.
                </Typography>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} >
                    <Typography color="blue-gray" className="text-center font-normal text-2xl">
                        Branch: {decodedToken.branch_name}
                    </Typography>
                    <div className="flex sm:flex-row flex-col gap-4">
                        <Input
                            variant="standard"
                            label="Donor Name"
                            placeholder="Enter Donor Name"
                            value={donorName}
                            onChange={(e) => setDonorName(e.target.value)}
                        />

                        <Input
                            variant="standard"
                            label="Donor Surname"
                            placeholder="Enter Donor Surname"
                            value={donorSurname}
                            onChange={(e) => setDonorSurname(e.target.value)}
                        />
                    </div>

                    <div className="flex sm:flex-row flex-col gap-4">
                        <Input
                            variant="standard"
                            label="Donor Email"
                            placeholder="Enter Donor Email"
                            type="email"
                            value={donorEmail}
                            onChange={(e) => setDonorEmail(e.target.value)}
                        />

                        <Input
                            variant="standard"
                            label="Donor Phone"
                            placeholder="Enter Donor Phone"
                            value={donorPhone}
                            onChange={handleInputChange}
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                    </div>

                    <div className="flex sm:flex-row flex-col gap-4">
                        <SelectBox
                            smallLabel={'City'}
                            value={selectedCity}
                            onChange={(value) => handleCityChange(value)}
                            label="Choose a city"
                            options={citiesData.map((city) => city.city_name)}
                        />

                        <SelectBox
                            smallLabel={'District'}
                            value={selectedDistrict}
                            onChange={(value) => handleDistrictChange(value)}
                            label="Choose a district"
                            options={
                                selectedCity
                                    ? citiesData
                                    .find((city) => city.city_name === selectedCity)
                                    ?.districts.map((district) => district.district_name) || []
                                    : []
                            }
                            disabled={!selectedCity}
                        />

                        <SelectBox
                            label="Blood Type"
                            value={donorBloodType}
                            onChange={(selectedBloodType) => handleBloodTypeChange(selectedBloodType)}
                            options={bloodTypes.map((type) => type.type_name)}
                            disabled={false}
                        />
                    </div>

                    <div className="flex sm:flex-row flex-col gap-4">
                        <Input
                            type="file"
                            label="Donor Image"
                            onChange={handleImageChange}
                        />
                        <Button className="w-1/2 mx-auto" color="black" type="button" ripple="light" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </div>

                </form>
            </div>
        </MainLayout>
    );
};

export default CreateDonor;
