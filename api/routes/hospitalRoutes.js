// hospitalRoutes.js
const express = require('express');
const router = express.Router();
const {initializeSequelize} = require('../helpers/sequelize');
const Joi = require('joi');
const {donors, blood_types, blood_bank} = require("../helpers/sequelizemodels");
const authenticateToken = require("../middlewares/authentication");

router.post('/createDonor', authenticateToken, async (req, res) => {
    try {
        const {error, value} = Joi.object({
            donor_name: Joi.string().required(),
            donor_surname: Joi.string().required(),
            donor_phone: Joi.string().required(),
            donor_city: Joi.string().required(),
            donor_town: Joi.string().required(),
            donor_blood_type: Joi.number().required(),
            donor_img: Joi.string().required(),
        }).validate(req.body);

        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {donor_name, donor_surname, donor_phone, donor_city, donor_town, donor_blood_type, donor_img} = value;

        const sequelize = await initializeSequelize();
        const donorsModel = sequelize.define('donors', donors, {
            timestamps: false, freezeTableName: true,
        });

        const bloodTypesModel = sequelize.define('blood_types', blood_types, {
            timestamps: false, freezeTableName: true,
        });

        donorsModel.belongsTo(bloodTypesModel, {foreignKey: 'donor_blood_type', targetKey: 'type_id'});

        if (donor_blood_type < 1 || donor_blood_type > 8) {
            return res.status(400).send(`Validation Error: Blood type must be between 1 and 8.`);
        }

        const existingDonor = await donorsModel.findOne({
            where: {
                donor_phone: donor_phone,
            },
        });

        if (existingDonor) {
            return res.status(400).send('Can not add this donor is already exist.');
        }
        const bloodType = await bloodTypesModel.findOne({
            attributes: ['type_name'], where: {
                type_id: donor_blood_type
            },
        });


        // Create a new donor
        const newDonor = await donorsModel.create({
            donor_name: donor_name,
            donor_surname: donor_surname,
            donor_phone: donor_phone,
            donor_city: donor_city,
            donor_town: donor_town,
            donor_blood_type: donor_blood_type,
            donor_img: donor_img,
        });

        const response = {
            message: 'New donor created successfully.', newDonor: {
                ...newDonor.toJSON(), donor_blood_type: bloodType.type_name,
            },
        }

        if (!newDonor) {
            return res.status(500).send('Donor creation error occurred. Please try again.');
        }

        return res.status(200).send(response);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send(error.message);
    }
});


router.put('/updateDonor/:donor_id', authenticateToken, async (req, res) => {
    try {
        const donor_id = req.params.donor_id;
        const {error, value} = Joi.object({
            donor_name: Joi.string(),
            donor_surname: Joi.string(),
            donor_phone: Joi.string(),
            donor_city: Joi.string(),
            donor_town: Joi.string(),
            donor_blood_type: Joi.number().min(1).max(8),
            donor_img: Joi.string(),
        }).validate(req.body);

        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {donor_name, donor_surname, donor_phone, donor_city, donor_town, donor_blood_type, donor_img} = value;
        const sequelize = await initializeSequelize();
        const donorsModel = sequelize.define('donors', donors, {
            timestamps: false, freezeTableName: true,
        });
        const bloodTypesModel = sequelize.define('blood_types', blood_types, {
            timestamps: false, freezeTableName: true,
        });

        donorsModel.belongsTo(bloodTypesModel, {foreignKey: 'donor_blood_type', targetKey: 'type_id'});

        if (donor_blood_type < 1 || donor_blood_type > 8) {
            return res.status(400).send(`Validation Error: Blood type must be between 1 and 8.`);
        }

        const existingDonor = await donorsModel.findOne({
            where: {
                donor_id: donor_id,
            },
        });

        if (!existingDonor) {
            return res.status(400).send('Donor not found.');
        }

        const rowsUpdated = await donorsModel.update({
            donor_name: donor_name || existingDonor.donor_name,
            donor_surname: donor_surname || existingDonor.donor_surname,
            donor_phone: donor_phone || existingDonor.donor_phone,
            donor_city: donor_city || existingDonor.donor_city,
            donor_town: donor_town || existingDonor.donor_town,
            donor_blood_type: donor_blood_type || existingDonor.donor_blood_type,
            donor_img: donor_img || existingDonor.donor_img,
        }, {
            where: {
                donor_id: donor_id,
            },
        });

        if (rowsUpdated === 0) {
            return res.status(400).json({error: 'No changes were made to the donor data.'});
        }

        const updatedDonor = await donorsModel.findOne({
            where: {
                donor_id: donor_id,
            },
        });

        const bloodType = await bloodTypesModel.findOne({
            attributes: ['type_name'], where: {
                type_id: updatedDonor.donor_blood_type,
            },
        });
        // Construct the response without including the blood_type field
        const response = {
            message: 'Donor information updated successfully', updatedDonor: {
                ...updatedDonor.toJSON(), donor_blood_type: bloodType.type_name,
            },
        };
        res.status(200).json(response);
    } catch (error) {
        // Handle validation errors or database errors
        console.error(error);
        res.status(400).json({error: 'Invalid donor data or database error'});
    }
});


router.post('/addBloodToBank', authenticateToken, async (req, res) => {
    try {
        const {error, value} = Joi.object({
            branch_id: Joi.number().required(),
            blood_type: Joi.number().required(),
            donor_id: Joi.number().required(),
            units: Joi.number().required(),
        }).validate(req.body);
        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {branch_id, blood_type, donor_id, units} = value;
        const donation_date = new Date().toISOString().slice(0, 10);
        const sequelize = await initializeSequelize();

        const bloodBankModel = sequelize.define('blood_bank', blood_bank, {
            timestamps: false, freezeTableName: true,
        });

        const existingDonor = await bloodBankModel.findOne({
            where: {
                donor_id: donor_id,
            },
        });

        if (!existingDonor) {
            const addBlood = await bloodBankModel.create({
                branch_id: branch_id,
                blood_type: blood_type,
                donor_id: donor_id,
                donation_date: donation_date,
                units: units,
            });
        } else {
            const rowsUpdated = await bloodBankModel.update({
                units: existingDonor.units + units,
            }, {
                where: {
                    donor_id: donor_id,
                },
            });
        }

        res.status(200).send({message: 'Blood added to blood bank successfully.'});

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send(error.message);
    }
});

router.post('/requestBlood', async (req, res) => {
    try {
        const {error, value} = Joi.object({
            branch_id: Joi.number().required(),
            blood_type: Joi.number().required(),
            email: Joi.string().email().required(),
            city: Joi.string().required(),
            town: Joi.string().required(),
            units: Joi.number().required(),
        }).validate(req.body);


    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});
module.exports = router;