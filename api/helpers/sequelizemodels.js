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
    donor_district: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'district',
            key: 'district_id',
        },
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
    branch_district: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'district',
            key: 'district_id',
        },
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

const city = {
    city_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    city_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}

const district = {
    district_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    district_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'city',
            key: 'city_id',
        },
    },
}

const blood_requests = {
    request_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'branches',
            key: 'branch_id',
        },
    },
    blood_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'blood_types',
            key: 'type_id',
        },
    },
    units: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    expire_day: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    request_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    request_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
};

const req_queue = {
    queue_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    req_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'blood_requests',
            key: 'request_id',
        },
    },

}


module.exports = {
    donors,
    branch,
    blood_bank,
    blood_types,
    city,
    district,
    blood_requests,
    req_queue
};
