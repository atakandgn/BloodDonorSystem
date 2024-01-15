import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../MainLayout';
import { Button, Input, Typography } from '@material-tailwind/react';
import SelectBox from "../Components/SelectBox";
import Select from 'react-select';

const RequestBlood = () => {
    const [units, setUnits] = useState('');
    const [city, setCity] = useState(null);
    const [district, setDistrict] = useState(null);
    const [expireDay, setExpireDay] = useState('');
    const [reason, setReason] = useState('');
    const [selectedBloodTypeId, setSelectedBloodTypeId] = useState('');
    const [selectedBranch, setSelectedBranch] = useState(null);

    const [bloodTypes, setBloodTypes] = useState([]);
    const [citiesData, setCitiesData] = useState([]);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        getBloodTypes();
        getCountry();
        getAllBranches();
    }, []);

    const getBloodTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getBloodTypes');
            setBloodTypes(response.data);
        } catch (error) {
            console.error('Error fetching blood types:', error);
        }
    };

    const getCountry = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getCountry');
            setCitiesData(response.data);
        } catch (error) {
            console.error('Error fetching city data:', error);
        }
    };

    const getAllBranches = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getAllBranches');
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const handleCityChange = (value) => {
        setCity(value);
    };

    const handleDistrictChange = (value) => {
        setDistrict(value);
    };

    const handleExpireDayChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setExpireDay(value);
    };

    const handleUnitsChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setUnits(value);
    };

    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const handleBloodTypeChange = (selectedBloodType) => {
        const selectedBloodTypeData = bloodTypes.find((type) => type.type_name === selectedBloodType);

        if (selectedBloodTypeData) {
            setSelectedBloodTypeId(selectedBloodTypeData.type_id);
        }
    };

    const handleBranchChange = (selectedBranch) => {
        setSelectedBranch(selectedBranch);
    };
    // console.log("selectedBranch",selectedBranch);
    // console.log("selectedBloodTypeId",selectedBloodTypeId);
    // console.log("units",units);

    // console.log("expireDay",expireDay);
    // console.log("reason",reason)
    const handleSubmit = async () => {
        try {
            const selectedCity = citiesData.find((cityData) => cityData.city_name === city);
            const city_id = selectedCity ? selectedCity.city_id : null;

            // Find the district_id based on the selected district name within the selected city
            const selectedDistrict = city
                ? citiesData.find((cityData) => cityData.city_name === city)?.districts.find((districtData) => districtData.district_name === district)
                : null;
            const district_id = selectedDistrict ? selectedDistrict.district_id : null;
            console.log("city",city_id);
            console.log("district",district_id);

            const response = await axios.post('http://localhost:5000/requestBlood', {
                branch_id: selectedBranch?.value,
                blood_type: selectedBloodTypeId,
                units: parseInt(units, 10),
                city_id: city_id,
                district_id: district_id,
                expire_day: parseInt(expireDay, 10),
                reason: reason,
            });


            if (response.status === 200) {
                console.log('Blood request successful:', response.data.message);
            } else {
                console.error('Error making blood request:', response.data.message);
            }
        } catch (error) {
            console.error('Error making blood request:', error);
        }
    };

    return (
        <MainLayout>
            <div className="my-4">
                <Typography color="blue-gray" className="text-center font-normal text-3xl">
                    Request Blood Form
                </Typography>
                <div className="flex flex-col gap-8">
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 items-center">
                        <Select
                            value={selectedBranch}
                            onChange={handleBranchChange}
                            options={branches.map((branch) => ({
                                value: branch.branch_id,
                                label: branch.branch_name,
                            }))}
                            isSearchable
                            placeholder="Select branch..."
                        />
                        <SelectBox
                            smallLabel={'City'}
                            value={city}
                            onChange={(value) => handleCityChange(value)}
                            label="Choose a city"
                            options={citiesData.map((cityData) => cityData.city_name)}
                        />
                        <SelectBox
                            smallLabel={'District'}
                            value={district}
                            onChange={(value) => handleDistrictChange(value)}
                            label="Choose a district"
                            options={
                                city
                                    ? citiesData
                                    .find((cityData) => cityData.city_name === city)
                                    ?.districts.map((districtData) => districtData.district_name) || []
                                    : []
                            }
                            disabled={!city}
                        />
                    </div>
                    <div className="flex sm:flex-row flex-col gap-4">
                        <SelectBox
                            smallLabel={'Blood Type'}
                            label="Blood Type"
                            value={selectedBloodTypeId}
                            onChange={(selectedBloodType) => handleBloodTypeChange(selectedBloodType)}
                            options={bloodTypes.map((type) => type.type_name)}
                            disabled={false}
                        />
                        <Input
                            variant="static"
                            label="Expiration Days"
                            placeholder="Enter expiration days (default: 7)"
                            value={expireDay}
                            onChange={handleExpireDayChange}
                            type="text"
                            pattern="\d*"
                        />
                        <Input
                            variant="static"
                            label="Reason"
                            placeholder="Enter reason (optional)"
                            value={reason}
                            onChange={handleReasonChange}
                        />
                    </div>
                    <div className="flex sm:flex-row flex-col gap-4">
                        <Input
                            variant="static"
                            label="Number of Units"
                            placeholder="Enter units required"
                            value={units}
                            onChange={handleUnitsChange}
                            type="text"
                            pattern="\d*"
                        />
                        <Button
                            className="mt-4 w-1/2 mx-auto"
                            onClick={handleSubmit}
                        >
                            Submit Request
                        </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default RequestBlood;
