// authRoutes.js
const express = require('express');
const router = express.Router();
const {initializeSequelize} = require('../helpers/sequelize');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {branch, city, district} = require("../helpers/sequelizemodels");

router.post('/login', async (req, res) => {
    try {
        const {branch_username, branch_password} = req.body;

        const sequelize = await initializeSequelize();
        const branchModel = sequelize.define('branch', branch, {
            timestamps: false,
            freezeTableName: true,
        });

        // Check if the user exists
        const findBranch = await branchModel.findOne({
            where: {
                branch_username,
            },
        });

        if (!findBranch) {
            return res.status(401).send('Invalid username or password');
        }

        // Check if the password is correct by comparing the hashed password login correct setup token
        const isPasswordCorrect = await bcrypt.compare(branch_password, findBranch.branch_password);

        if (!isPasswordCorrect) {
            return res.status(401).send('Invalid username or password');
        }

        // Generate JWT token
        const tokenPayload = {
            branch_id: findBranch.branch_id,
            branch_username: findBranch.branch_username,
            branch_name: findBranch.branch_name,
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY);

        // Send the token in the response
        return res.status(200).send({token});

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).send(error);
    }
});

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const {error, value} = Joi.object({
            branch_name: Joi.string().required(),
            branch_username: Joi.string().required(),
            branch_password: Joi.string().required(),
            branch_district: Joi.number().min(1).max(957).required(),
        }).validate(req.body);

        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {branch_username, branch_name, branch_password, branch_district} = value;

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(branch_password, 10);

        const sequelize = await initializeSequelize();
        const branchModel = sequelize.define('branch', branch, {
            timestamps: false,
            freezeTableName: true,
        });


        // Create a new user
        const newBranch = await branchModel.create({
            branch_username,
            branch_name,
            branch_password: hashedPassword,
            branch_district,
        });

        if (!newBranch) {
            return res.status(500).send('Registration error occurred. Please try again.');
        }

        return res.status(200).send('Branch created successfully.');
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal server error during registration.');
    }
});


router.get('/getCountry', async (req, res) => {
    try {
        const sequelize = await initializeSequelize();
        const cityModel = sequelize.define('city', city, {
            timestamps: false,
            freezeTableName: true,
        });
        const districtModel = sequelize.define('district', district, {
            timestamps: false,
            freezeTableName: true,
        });

        districtModel.belongsTo(cityModel, {foreignKey: 'city_id'});
        cityModel.hasMany(districtModel, {foreignKey: 'city_id'});


        const findCity = await cityModel.findAll({
            include: [{
                model: districtModel,
                as: 'districts',
                attributes: ['district_id', 'district_name', "latitude", "longitude"],
            }],
            attributes: ['city_id', 'city_name', "latitude", "longitude"],
        });


        if (!findCity) {
            return res.status(400).send('Validation Error');
        }

        // Send the token in the response
        return res.status(200).send(findCity);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal server error during registration.');
    }
});

router.get("/getAllBranches", async (req, res) => {
    try {
        const sequelize = await initializeSequelize();
        const branchModel = sequelize.define('branch', branch, {
            timestamps: false,
            freezeTableName: true,
        });

        const districtModel = sequelize.define('district', district, {
            timestamps: false,
            freezeTableName: true,
        });
        const cityModel = sequelize.define('city', city, {
            timestamps: false,
            freezeTableName: true,
        });

        districtModel.belongsTo(cityModel, {foreignKey: 'city_id'});

        branchModel.belongsTo(districtModel, {foreignKey: 'branch_district'});

        // Check if branch_name is provided in the query parameters
        const branchNameFilter = req.query.branch_name
            ? { branch_name: { [Op.like]: `%${req.query.branch_name}%` } }
            : {};

        const findBranch = await branchModel.findAll({
            attributes: ['branch_id', 'branch_name', 'branch_district'],
            include: [{
                model: districtModel,
                attributes: ['district_id', 'district_name'],
                include: [{
                    model: cityModel,
                    attributes: ['city_id', 'city_name'],
                }]
            }],
            where: branchNameFilter, // Apply branch_name filter
        });

        const transformedBranches = findBranch.map(branch => ({
            branch_id: branch.branch_id,
            branch_name: branch.branch_name,
            district_id: branch.district.district_id,
            district_name: branch.district.district_name,
            city_id: branch.district.city.city_id,
            city_name: branch.district.city.city_name,
        }));

        if (!transformedBranches) {
            return res.status(400).send('Validation Error');
        }
        return res.status(200).send(transformedBranches);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal server error during registration.');
    }
});


module.exports = router;