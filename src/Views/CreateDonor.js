import React, { useState, useEffect } from 'react';
import MainLayout from "../MainLayout";
import { Typography, Input, Button } from "@material-tailwind/react";
import { getDecodedToken } from "../Components/auth";
import SelectBox from "../Components/SelectBox";
import axios from "axios";

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
        fetchData();
        getBloodTypes();
    }, []);

    const fetchData = async () => {
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setDonorImage(file);
    };

    const handleBloodTypeChange = (selectedBloodType) => {
        const selectedBloodTypeData = bloodTypes.find((type) => type.type_name === selectedBloodType);

        if (selectedBloodTypeData) {
            setDonorBloodType(selectedBloodTypeData.type_id);
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token");

            const requestData = {
                donor_img: donorImage ? donorImage.name : "image",
                donor_name: donorName,
                donor_surname: donorSurname,
                donor_email: donorEmail,
                donor_phone: donorPhone,
                donor_address: selectedDistrict, // Assuming selectedDistrict is the ID
                donor_blood_type: donorBloodType,
            };
            console.log("Request data:", requestData);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };

            const response = await axios.post("http://localhost:5000/createDonor", requestData, config);

            if (response.status === 200) {
                console.log("Donor created successfully:", response.data);
            } else {
                console.error("Error creating donor:", response.data);
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
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                            onChange={(e) => setDonorPhone(e.target.value)}
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
                    </div>

                    <Button color="indigo" type="button" ripple="light" onClick={handleSubmit}>
                        Submit
                    </Button>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateDonor;
