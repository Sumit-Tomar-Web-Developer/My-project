// src/models/TenderClosureDetails.js
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('TenderClosureDetails', {
        tenderId: { type: DataTypes.INTEGER, primaryKey: true },
        closureRemark: {
            type: DataTypes.STRING,
            field: 'closureRemark',
            allowNull: false
        },
        lessonsLearnt: {
            type: DataTypes.STRING,
            field: 'lessonsLearnt',
            allowNull: false
        },
        createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
        updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
    });

};




