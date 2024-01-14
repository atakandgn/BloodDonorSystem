// hospitalRoutes.js
const express = require("express");
const router = express.Router();
const {initializeSequelize} = require("../helpers/sequelize");
const Joi = require("joi");
const geolib = require("geolib");
const redisClient = require("../helpers/redis");

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
const EmailSender = require("../helpers/email");
const emailSender = new EmailSender();
router.post("/createDonor", authenticateToken, async (req, res) => {
    try {
        const {error, value} = Joi.object({
            donor_name: Joi.string().required(),
            donor_surname: Joi.string().required(),
            donor_phone: Joi.string().required(),
            donor_email: Joi.string().email().required(),
            donor_address: Joi.number().min(1).max(957).required(),
            donor_blood_type: Joi.number().required(),
            donor_img: Joi.string().required(),
        }).validate(req.body);

        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {donor_name, donor_surname, donor_phone, donor_address, donor_blood_type, donor_img,donor_email} = value;
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
            donor_email: donor_email,
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
            return res.status(500).send("Donor creation error occurred. Please try again.");
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
            donor_address: Joi.number().min(1).max(957).required(),
            donor_blood_type: Joi.number().min(1).max(8),
            donor_img: Joi.string(),
        }).validate(req.body);

        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {donor_name, donor_surname, donor_phone, donor_address, donor_blood_type, donor_img,} = value;
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
    try {
        const {error, value} = Joi.object({
            branch_id: Joi.number().required(),
            blood_type: Joi.number().min(1).max(8).required(),
            units: Joi.number().required(),
            city_id: Joi.number().min(1).max(81).required(),
            district_id: Joi.number().min(1).max(957).required(),
            expire_day: Joi.number().optional().default(7),
            reason: Joi.string().optional(),
        }).validate(req.body);

        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {branch_id, blood_type, units, expire_day, reason, city_id, district_id,} = value;
        const sequelize = await initializeSequelize();

        const bloodRequestModel = sequelize.define(
            "blood_requests",
            blood_requests,
            {
                timestamps: false,
                freezeTableName: true,
            }
        );
        const branchModel = sequelize.define("branch", branch, {
            timestamps: false,
            freezeTableName: true,
        });
        const bloodBankModel = sequelize.define("blood_bank", blood_bank, {
            timestamps: false,
            freezeTableName: true,
        });
        const donorsModel = sequelize.define("donors", donors, {
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
        const bloodTypesModel = sequelize.define("blood_types", blood_types, {
            timestamps: false,
            freezeTableName: true,
        });

        bloodRequestModel.belongsTo(branchModel, {
            foreignKey: "branch_id",
            targetKey: "branch_id",
        });
        bloodBankModel.belongsTo(donorsModel, {
            foreignKey: "donor_id",
            targetKey: "donor_id",
        });
        bloodBankModel.belongsTo(branchModel, {
            foreignKey: "branch_id",
            targetKey: "branch_id",
        });

        districtModel.belongsTo(cityModel, {
            foreignKey: "city_id",
            targetKey: "city_id",
        });
        const bloodTypesData = await bloodTypesModel.findAll({
            attributes: ["type_id", "type_name"],
        });
        const bloodTypes = bloodTypesData.map((bloodType) => bloodType.type_name);

        const requestedDistrict = await districtModel.findOne({
            where: {
                district_id: district_id,
            },
            attributes: ["district_name", "latitude", "longitude"],
            include: {
                model: cityModel,
                where: {
                    city_id: city_id,
                },
            },
        });
        const requestedDistrictLatitude = requestedDistrict.dataValues.latitude;
        const requestedDistrictLongitude = requestedDistrict.dataValues.longitude;
        if (blood_type < 1 || blood_type > 8) {
            return res.status(400).send(`Validation Error: Blood type must be between 1 and 8.`);
        }
        // Get all districts and filter by distance
        const allDistricts = await districtModel.findAll({
            attributes: ["district_id", "district_name", "latitude", "longitude"],
            include: {
                model: cityModel,
                where: {
                    city_id: city_id,
                },
            },
        });

        const nearDistricts = allDistricts.filter((district) => {
            const districtLatitude = district.dataValues.latitude;
            const districtLongitude = district.dataValues.longitude;

            const distance = geolib.getDistance(
                {
                    latitude: requestedDistrictLatitude,
                    longitude: requestedDistrictLongitude,
                },
                {latitude: districtLatitude, longitude: districtLongitude}
            );

            // Check if the distance is less than or equal to 50km
            return distance <= 50000; // 50km in meters
        });

        const nearDistrictIds = nearDistricts.map(
            (district) => district.dataValues.district_id
        );
        const branchIn50km = await bloodBankModel.findAll({
            include: [
                {
                    model: branchModel,
                    as: "branch",
                    where: {
                        branch_district: {
                            [Op.in]: nearDistrictIds,
                        },
                    },
                },
                {
                    model: donorsModel,
                    as: "donor",
                    where: {
                        donor_blood_type: blood_type,
                    },
                },
            ],
            where: {
                units: {
                    [Op.gte]: 0,
                },
            },
        });

        let nearBlood = branchIn50km.find((item) => {
            if (nearDistrictIds && item.dataValues.donor.dataValues.donor_blood_type == blood_type) {
                return item;
            }
        });
        if (nearBlood) {
            const decreasedUnit = Math.min(nearBlood.dataValues.units, units);
            console.log("azaltılan", decreasedUnit);
            console.log("olan", nearBlood.dataValues.units);
            console.log("istenen", units);

            if (decreasedUnit === units) {
                // If available units are equal to requested units, decrease and send email
                await bloodBankModel.decrement("units", {
                    by: decreasedUnit,
                    where: {donate_id: nearBlood.dataValues.donate_id},
                });

                emailSender.sendEmail({
                    to: nearBlood.dataValues.donor.donor_email,
                    subject: "Blood Request Information",
                    text: 'Your blood request used. Thank you for your help.',
                })
                    .then(() => {
                        console.log('Email sent successfully.');
                    })
                    .catch((error) => {
                        console.error('Error sending email:', error);
                    });

                return res.status(200).send({message: "Blood request fully completed successfully."});
            } else {
                const updatedRequest = {
                    branch_id: branch_id,
                    blood_type: blood_type,
                    units: units - decreasedUnit,
                    expire_day: expire_day,
                    reason: reason,
                    date: new Date().toISOString().slice(0, 10),
                    near50km: nearDistrictIds,
                };

                // Push the updated request to the Redis queue
                await redisClient.rpush(`bloodRequestQueue_${blood_type}`, JSON.stringify(updatedRequest));

                // Decrease the units in blood bank
                await bloodBankModel.decrement("units", {
                    by: decreasedUnit,
                    where: {donate_id: nearBlood.dataValues.donate_id},
                });

                // Send email to the donor
                await emailSender.sendEmail({
                    to: nearBlood.dataValues.donor.donor_email,
                    subject: "Blood Request Information",
                    text: 'Your blood request used. Thank you for your help.',
                });

                return res.status(200).send({message: "Blood request partially completed successfully."});
            }


        } else {
            const queueIdKey = `bloodRequestQueueId_${blood_type}`; // Key to store the incrementing counter
            const requestId = await redisClient.incr(queueIdKey); // Increment the counter and get the new value

            // Check if a similar request is already in the queue
            const isRequestInQueue = await redisClient.lrange(`bloodRequestQueue_${blood_type}`, 0, -1);
            const existingRequest = isRequestInQueue.find((request) => {
                const parsedRequest = JSON.parse(request);

                // Check if the parameters match
                return (
                    parsedRequest.units === units && parsedRequest.expire_day === expire_day && parsedRequest.reason === reason && JSON.stringify(parsedRequest.near50km) === JSON.stringify(nearDistrictIds)
                );
            });

            if (existingRequest) {
                return res.status(400).send({
                    message: `Blood request with the same parameters is already in the queue for blood type ${bloodTypes[blood_type - 1]}. Searching blood every day. Please be patient. STAY SAFE 😷:)`,
                });
            }
            // Add the request to Redis queue
            const queueData = {
                reids_queue_id: requestId,
                branch_id: branch_id,
                blood_type: blood_type,
                units: units,
                expire_day: expire_day,
                reason: reason,
                date: new Date().toISOString().slice(0, 10),
                near50km: nearDistrictIds,
            };

            await redisClient.rpush(`bloodRequestQueue_${blood_type}`, JSON.stringify(queueData));
            return res.status(200).send({message: `Blood request added to Redis queue for blood type ${bloodTypes[blood_type - 1]}. It will automatically be processed when blood is available.`,});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});
// redis-cli start the cli server for redis
// lrange bloodRequestQueue 0 -1 to see the queue data  (0 is the start index, -1 is the end index)
// # For A+
// LRANGE bloodRequestQueue_A+ 0 -1
// # For A-
// LRANGE bloodRequestQueue_A- 0 -1
// # For B+
// LRANGE bloodRequestQueue_B+ 0 -1
// # For B-
// LRANGE bloodRequestQueue_B- 0 -1
// # For AB+
// LRANGE bloodRequestQueue_AB+ 0 -1
// # For AB-
// LRANGE bloodRequestQueue_AB- 0 -1
// # For O+
// LRANGE bloodRequestQueue_O+ 0 -1
// # For O-
// LRANGE bloodRequestQueue_O- 0 -1

router.post("/processBloodRequests", async (req, res) => {
    try {
        const sequelize = await initializeSequelize();
        const bloodTypesModel = sequelize.define("blood_types", blood_types, {
            timestamps: false,
            freezeTableName: true,
        });
        const bloodBankModel = sequelize.define("blood_bank", blood_bank, {
            timestamps: false,
            freezeTableName: true,
        });
        const donorsModel = sequelize.define("donors", donors, {
            timestamps: false,
            freezeTableName: true,
        });
        const branchModel = sequelize.define("branch", branch, {
            timestamps: false,
            freezeTableName: true,
        });

        // Associations
        bloodBankModel.belongsTo(donorsModel, {
            foreignKey: "donor_id",
            targetKey: "donor_id",
        });
        bloodBankModel.belongsTo(branchModel, {
            foreignKey: "branch_id",
            targetKey: "branch_id",
        });

        const bloodTypes = await bloodTypesModel.findAll({});

        for (const type of bloodTypes) {
            const queueKey = `bloodRequestQueue_${type.dataValues.type_id}`;
            const isQueueEmpty = await redisClient.llen(queueKey);
            if (isQueueEmpty === 0) continue;

            const allData = await redisClient.lrange(queueKey, 0, -1);

            for (const queueItem of allData) {

                const queueDate = new Date(JSON.parse(queueItem).date);
                const today = new Date();
                const expire_day = JSON.parse(queueItem).expire_day;
                const last_date = new Date(queueDate.setDate(queueDate.getDate() + expire_day));

                if (today > last_date) {
                    console.log("Blood Expired");
                    await redisClient.lpop(queueKey);
                }

                const availableBlood = await bloodBankModel.findAll({
                    include: [
                        {
                            model: branchModel,
                            as: "branch",
                        },
                        {
                            model: donorsModel,
                            as: "donor",
                            attributes: ["donor_id", "donor_blood_type", "donor_email"],
                        },
                    ],
                    where: {
                        units: {
                            [Op.gt]: 0,
                        },
                    },
                });

                const parsedRequest = JSON.parse(queueItem);

                const foundBlood = availableBlood.find((bank) => {
                    return (
                        parsedRequest.near50km.includes(bank.dataValues.branch.branch_district)
                        &&
                        bank.dataValues.donor.donor_blood_type == parsedRequest.blood_type
                    );
                });
                if (!foundBlood) continue;

                const decreasedUnit = Math.min(
                    foundBlood.dataValues.units,
                    parsedRequest.units
                );
                await bloodBankModel.decrement("units", {
                    by: decreasedUnit,
                    where: {donate_id: foundBlood.dataValues.donate_id},
                });

                if (decreasedUnit === parsedRequest.units) {
                    await redisClient.lpop(queueKey);
                    emailSender.sendEmail({
                        to: foundBlood.dataValues.donor.donor_email,
                        subject: "Blood Request Information",
                        text: 'Your blood request used. Thank you your for your help.',
                    })
                        .then(() => {
                            console.log('Email sent successfully.');
                        })
                        .catch((error) => {
                            console.error('Error sending email:', error);
                        });
                } else {
                    const updatedRequest = {
                        ...parsedRequest,
                        units: parsedRequest.units - decreasedUnit,
                    };
                    await redisClient.lset(queueKey, 0, JSON.stringify(updatedRequest));
                    emailSender.sendEmail({
                        to: foundBlood.dataValues.donor.donor_email,
                        subject: "Blood Request Information",
                        text: 'Your blood request used. Thank you your for your help.',
                    })
                        .then(() => {
                            console.log('Email sent successfully.');
                        })
                        .catch((error) => {
                            console.error('Error sending email:', error);
                        });
                }
            }
        }

        return res
            .status(200)
            .send({message: "Blood request queues processed successfully."});
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
});
router.get("/getBloodTypes", async (req, res) => {
    try {
        const sequelize = await initializeSequelize();
        const bloodTypesModel = sequelize.define("blood_types", blood_types, {
            timestamps: false,
            freezeTableName: true,
        });

        const bloodTypes = await bloodTypesModel.findAll({
            attributes: ["type_id", "type_name"],
        });

        return res.status(200).send(bloodTypes);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
});

module.exports = router;
