// helpers/sequelizemodels.js
const {DataTypes} = require('sequelize');

const donors = {
    donor_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    donor_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    donor_surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    donor_phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    donor_city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    donor_town: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    donor_blood_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'blood_types',
            key: 'type_id',
        }
    },
    donor_img: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}


const branch = {
    branch_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    branch_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branch_username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branch_password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branch_city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branch_town: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}

const blood_bank = {
    donate_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'branch',
            key: 'branch_id',
        },
    },
    donor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'donors',
            key: 'donor_id',
        },
    },
    donation_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    units: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}

const blood_types = {
    type_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}


module.exports = {
    donors,
    branch,
    blood_bank,
    blood_types,
};
