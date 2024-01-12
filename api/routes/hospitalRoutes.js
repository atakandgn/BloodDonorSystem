// hospitalRoutes.js
const express = require("express");
const router = express.Router();
const {initializeSequelize} = require("../helpers/sequelize");
const Joi = require("joi");
const Redis = require('ioredis');
const {
    donors,
    blood_types,
    blood_bank,
    district,
    city,
    blood_requests,
    branch,
    req_queue,
} = require("../helpers/sequelizemodels");
const authenticateToken = require("../middlewares/authentication");
const {Op} = require("sequelize");

router.post("/createDonor", authenticateToken, async (req, res) => {
    try {
        const {error, value} = Joi.object({
            donor_name: Joi.string().required(),
            donor_surname: Joi.string().required(),
            donor_phone: Joi.string().required(),
            donor_address: Joi.number().min(1).max(972).required(),
            donor_blood_type: Joi.number().required(),
            donor_img: Joi.string().required(),
        }).validate(req.body);

        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {
            donor_name,
            donor_surname,
            donor_phone,
            donor_address,
            donor_blood_type,
            donor_img,
        } = value;

        const sequelize = await initializeSequelize();
        const donorsModel = sequelize.define("donors", donors, {
            timestamps: false,
            freezeTableName: true,
        });

        const bloodTypesModel = sequelize.define("blood_types", blood_types, {
            timestamps: false,
            freezeTableName: true,
        });

        const districtModel = sequelize.define("district", district, {
            timestamps: false,
            freezeTableName: true,
        });

        const cityModel = sequelize.define("city", city, {
            timestamps: false,
            freezeTableName: true,
        });

        donorsModel.belongsTo(districtModel, {
            foreignKey: "donor_district",
            targetKey: "district_id",
        });
        districtModel.belongsTo(cityModel, {
            foreignKey: "city_id",
            targetKey: "city_id",
        });
        donorsModel.belongsTo(bloodTypesModel, {
            foreignKey: "donor_blood_type",
            targetKey: "type_id",
        });

        if (donor_blood_type < 1 || donor_blood_type > 8) {
            return res.status(400).send(`Validation Error: Blood type must be between 1 and 8.`);
        }

        const existingDonor = await donorsModel.findOne({
            where: {
                donor_phone: donor_phone,
            },
        });

        if (existingDonor) {
            return res.status(400).send("Can not add this donor is already exist.");
        }

        // Create a new donor
        const newDonor = await donorsModel.create({
            donor_name: donor_name,
            donor_surname: donor_surname,
            donor_phone: donor_phone,
            donor_district: donor_address,
            donor_blood_type: donor_blood_type,
            donor_img: donor_img,
        });

        const bloodType = await bloodTypesModel.findOne({
            attributes: ["type_name"],
            where: {
                type_id: donor_blood_type,
            },
        });

        await newDonor.reload({
            include: [
                {
                    model: districtModel,
                    attributes: ["district_name"],
                    include: [
                        {
                            model: cityModel,
                            attributes: ["city_name"],
                        },
                    ],
                },
            ],
        });

        const response = {
            message: "New donor created successfully.",
            newDonor: {
                donor_id: newDonor?.donor_id,
                donor_name: newDonor?.donor_name,
                donor_surname: newDonor?.donor_surname,
                donor_phone: newDonor?.donor_phone,
                donor_address: {
                    district_name: newDonor?.district?.district_name,
                    city_name: newDonor?.district.city?.city_name,
                },
                donor_blood_type: bloodType?.type_name,
                donor_img: newDonor?.donor_img,
            },
        };

        if (!newDonor) {
            return res
                .status(500)
                .send("Donor creation error occurred. Please try again.");
        }

        return res.status(200).send(response);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send(error.message);
    }
});

router.put("/updateDonor/:donor_id", authenticateToken, async (req, res) => {
    try {
        const donor_id = req.params.donor_id;
        const {error, value} = Joi.object({
            donor_name: Joi.string(),
            donor_surname: Joi.string(),
            donor_phone: Joi.string(),
            donor_address: Joi.number().min(1).max(972).required(),
            donor_blood_type: Joi.number().min(1).max(8),
            donor_img: Joi.string(),
        }).validate(req.body);

        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {
            donor_name,
            donor_surname,
            donor_phone,
            donor_address,
            donor_blood_type,
            donor_img,
        } = value;
        const sequelize = await initializeSequelize();

        const donorsModel = sequelize.define("donors", donors, {
            timestamps: false,
            freezeTableName: true,
        });
        const bloodTypesModel = sequelize.define("blood_types", blood_types, {
            timestamps: false,
            freezeTableName: true,
        });
        const districtModel = sequelize.define("district", district, {
            timestamps: false,
            freezeTableName: true,
        });

        const cityModel = sequelize.define("city", city, {
            timestamps: false,
            freezeTableName: true,
        });

        donorsModel.belongsTo(districtModel, {
            foreignKey: "donor_district",
            targetKey: "district_id",
        });
        districtModel.belongsTo(cityModel, {
            foreignKey: "city_id",
            targetKey: "city_id",
        });
        donorsModel.belongsTo(bloodTypesModel, {
            foreignKey: "donor_blood_type",
            targetKey: "type_id",
        });

        if (donor_blood_type < 1 || donor_blood_type > 8) {
            return res.status(400).send(`Validation Error: Blood type must be between 1 and 8.`);
        }

        const existingDonor = await donorsModel.findOne({
            where: {
                donor_id: donor_id,
            },
            include: [
                {
                    model: districtModel,
                    attributes: ["district_name"],
                    include: [
                        {
                            model: cityModel,
                            attributes: ["city_name"],
                        },
                    ],
                },
            ],
        });

        if (!existingDonor) {
            return res.status(400).send("Donor not found.");
        }

        const rowsUpdated = await donorsModel.update(
            {
                donor_name: donor_name || existingDonor?.donor_name,
                donor_surname: donor_surname || existingDonor?.donor_surname,
                donor_phone: donor_phone || existingDonor?.donor_phone,
                donor_district: donor_address || existingDonor?.donor_district,
                donor_blood_type: donor_blood_type || existingDonor?.donor_blood_type,
                donor_img: donor_img || existingDonor?.donor_img,
            },
            {
                where: {
                    donor_id: donor_id,
                },
            }
        );

        if (rowsUpdated === 0) {
            return res.status(400).json({error: "No changes were made to the donor data."});
        }

        const updatedDonor = await donorsModel.findOne({
            where: {
                donor_id: donor_id,
            },
            include: [
                {
                    model: districtModel,
                    attributes: ["district_name"],
                    include: [
                        {
                            model: cityModel,
                            attributes: ["city_name"],
                        },
                    ],
                },
            ],
        });

        const bloodType = await bloodTypesModel.findOne({
            attributes: ["type_name"],
            where: {
                type_id: updatedDonor?.donor_blood_type,
            },
        });
        const response = {
            message: "Donor information updated successfully",
            updatedDonor: {
                donor_id: updatedDonor.donor_id,
                donor_name: updatedDonor?.donor_name,
                donor_surname: updatedDonor?.donor_surname,
                donor_phone: updatedDonor?.donor_phone,
                donor_address: {
                    district_name: updatedDonor?.district?.district_name,
                    city_name: updatedDonor?.district?.city.city_name,
                },
                donor_blood_type: bloodType?.type_name,
                donor_img: updatedDonor?.donor_img,
            },
        };
        res.status(200).json(response);
    } catch (error) {
        // Handle validation errors or database errors
        console.error(error);
        res.status(400).json({error: "Invalid donor data or database error"});
    }
});

router.post("/addBloodToBank", authenticateToken, async (req, res) => {
    try {
        const {error, value} = Joi.object({
            branch_id: Joi.number().required(),
            donor_id: Joi.number().required(),
            units: Joi.number().required(),
        }).validate(req.body);
        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {branch_id, donor_id, units} = value;
        const donation_date = new Date().toISOString().slice(0, 10);
        const sequelize = await initializeSequelize();

        const bloodBankModel = sequelize.define("blood_bank", blood_bank, {
            timestamps: false,
            freezeTableName: true,
        });

        const checkDonationDate = await bloodBankModel.findOne({
            where: {
                [Op.and]: [
                    {branch_id: branch_id},
                    {donor_id: donor_id},
                    {donation_date: donation_date},
                ],
            },
        });

        if (checkDonationDate) {
            const rowsUpdated = await bloodBankModel.update(
                {
                    units: checkDonationDate.units + units,
                },
                {
                    where: {
                        donor_id: donor_id,
                        donation_date: donation_date,
                    },
                }
            );
            res.status(200).send({message: "Blood units updated successfully."});
        } else {
            const addBlood = await bloodBankModel.create({
                branch_id: branch_id,
                donor_id: donor_id,
                donation_date: donation_date,
                units: units,
            });
            res.status(200).send({message: "New blood record created successfully."});
        }

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send(error.message);
    }
});


router.post("/requestBlood", async (req, res) => {
    // Access the Redis client from the request object
    const redisClient = req.redisClient;
    try {
        const {error, value} = Joi.object({
            branch_id: Joi.number().required(),
            blood_type: Joi.number().min(1).max(8).required(),
            units: Joi.number().required(),
            city: Joi.number().required(),
            district: Joi.number().required(),
            expire_day: Joi.number().optional().default(7),
            reason: Joi.string().optional(),
        }).validate(req.body);
        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }
        const {branch_id, blood_type, units, expire_day, reason} = value;
        const sequelize = await initializeSequelize();

        const donorsModel = sequelize.define("donors", donors, {
            timestamps: false,
            freezeTableName: true,
        });
        const cityModel = sequelize.define("city", city, {
            timestamps: false,
            freezeTableName: true,
        });
        const districtModel = sequelize.define("district", district, {
            timestamps: false,
            freezeTableName: true,
        });
        const bloodRequestModel = sequelize.define("blood_requests", blood_requests, {
            timestamps: false,
            freezeTableName: true,
        });
        const bloodTypesModel = sequelize.define("blood_types", blood_types, {
            timestamps: false,
            freezeTableName: true,
        });
        const branchModel = sequelize.define("branch", branch, {
            timestamps: false,
            freezeTableName: true,
        });
        const reqQueModel = sequelize.define("req_queue", req_queue, {
            timestamps: false,
            freezeTableName: true,
        });
        const bloodBankModel = sequelize.define("blood_bank", blood_bank, {
            timestamps: false,
            freezeTableName: true,
        });
        bloodRequestModel.belongsTo(bloodTypesModel, {
            foreignKey: "blood_type",
            targetKey: "type_id",
        });
        bloodRequestModel.belongsTo(branchModel, {
            foreignKey: "branch_id",
            targetKey: "branch_id",
        });

        if (blood_type < 1 || blood_type > 8) {
            return res.status(400).send(`Validation Error: Blood type must be between 1 and 8.`);
        }
        const bloodBank = await bloodBankModel.findOne({
            where: {
                branch_id,
                blood_type,
            },
        });
        if (bloodBank && bloodBank.units >= units) {
            // Blood is available in the blood bank, process the request
            await processBloodRequest(branch_id, blood_type, units, expire_day, reason);
            res.status(200).json({ message: 'Blood request fulfilled from blood bank.' });
        } else {
            // Blood not available in blood bank, check in the city
            const cityBloodBank = await bloodBankModel.findOne({
                where: {
                    city_id: city,
                    blood_type,
                },
            });

            if (cityBloodBank && cityBloodBank.units >= units) {
                // Blood is available in the city's blood bank, process the request
                await processBloodRequest(branch_id, blood_type, units, expire_day, reason);
                res.status(200).json({ message: 'Blood request fulfilled from city blood bank.' });
            } else {
                // Blood not available in city blood bank, add to the Redis queue
                await addBloodRequestToQueue(branch_id, blood_type, units, expire_day, reason);
                res.status(200).json({ message: 'Blood request added to the queue.' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Functions for processing and queuing blood requests
// processBloodRequest and addBloodRequestToQueue functions

// Close the Redis connection when the application is closing
process.on('beforeExit', () => {
    redisClient.quit();
});


module.exports = router;
