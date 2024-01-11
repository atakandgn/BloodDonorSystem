// authRoutes.js
const express = require('express');
const router = express.Router();
const {initializeSequelize} = require('../helpers/sequelize');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { branch} = require("../helpers/sequelizemodels");


/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login.
 *     description: |
 *       This endpoint allows registered users to log in by providing their username and password.
 *       If the provided credentials are valid, a JWT token is generated and returned in the response.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *                 example: johndoe123
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: securePassword123
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Successful login. Returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication.
 *       '401':
 *         description: Invalid username or password.
 *       '500':
 *         description: Internal server error during login.
 */


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


// Register Swagger Documentation
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user.
 *     description: |
 *       This endpoint allows users to register a new account by providing required information.
 *       The provided password is hashed before being stored.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the new user.
 *                 example: John
 *               surname:
 *                 type: string
 *                 description: The surname of the new user.
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the new user.
 *                 example: john.doe@example.com
 *               username:
 *                 type: string
 *                 description: The desired username for the new user.
 *                 example: johndoe123
 *               password:
 *                 type: string
 *                 description: The password for the new user (at least 8 characters, one uppercase, one lowercase and one number.).
 *                 example: securePassword123
 *               passwordConfirm:
 *                 type: string
 *                 description: Confirm the password (must match the 'password' field).
 *                 example: securePassword_123
 *               phone:
 *                 type: string
 *                 description: The phone number of the new user.
 *                 example: +1234567890
 *               gender:
 *                 type: integer
 *                 description: The gender of the new user (1=XX, 2=XY).
 *                 example: 2
 *                country:
 *                  type: string
 *                  description: The country of the new user.
 *                  example: Turkey
 *                city:
 *                  type: string
 *                  description: The city of the new user.
 *                  example: İzmir
 *                district:
 *                  type: string
 *                  description: The district of the new user.
 *                  example: Karşıyaka
 *             required:
 *               - name
 *               - surname
 *               - email
 *               - username
 *               - password
 *               - passwordConfirm
 *               - phone
 *               - gender
 *               - country
 *               - city
 *               - district
 *     responses:
 *       '200':
 *         description: User created successfully.
 *       '400':
 *         description: Validation error or duplicate username/email/phone.
 *       '500':
 *         description: Internal server error during registration.
 */

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const {error, value} = Joi.object({
            branch_name: Joi.string().required(),
            branch_username: Joi.string().required(),
            branch_password: Joi.string().required(),
        }).validate(req.body);

        if (error) {
            return res.status(400).send(`Validation Error: ${error.details[0].message}`);
        }

        const {branch_username, branch_name, branch_password} = value;

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


module.exports = router;