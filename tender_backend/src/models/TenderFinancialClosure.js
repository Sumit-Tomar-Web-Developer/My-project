// src/models/TenderFinancialClosure.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderFinancialClosure', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    emdAmountReceived: {
      type: DataTypes.BOOLEAN,
      field: 'emdAmountReceived',
      allowNull: false
    },
    sdAmountReceived: {
      type: DataTypes.BOOLEAN,
      field: 'sdAmountReceived',
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING,
      field: 'comments',
      allowNull: false
    },
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });

};