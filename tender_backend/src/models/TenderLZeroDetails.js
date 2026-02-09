// src/models/TenderLZeroDetails.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderLZeroDetails', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    BGNumber: {
      type: DataTypes.STRING,
      field: 'BGNumber',
      allowNull: false
    },
    BGguid: {
      type: DataTypes.STRING,
      field: 'BGguid',
      allowNull: false
    },
    BGFileName: {
      type: DataTypes.STRING,
      field: 'BGFileName',
      allowNull: false
    },
    BGAmount: {
      type: DataTypes.INTEGER,
      field: 'BGAmount',
      allowNull: false
    },
    serialNumber: {
      type: DataTypes.STRING,
      field: 'serialNumber',
      allowNull: false
    },
    dateOfIssue: {
      type: DataTypes.DATE,
      field: 'dateOfIssue',
      allowNull: false
    },
    dateOfExpiry: {
      type: DataTypes.DATE,
      field: 'dateOfExpiry',
      allowNull: false
    },
    dateOfClaimMax: {
      type: DataTypes.DATE,
      field: 'dateOfClaimMax',
      allowNull: false
    },
    nameAddressOfApplicant: {
      type: DataTypes.STRING,
      field: 'serialNumber',
      allowNull: false
    },
    isAddBGRequired: {
      type: DataTypes.BOOLEAN,
      field: 'isAddBGRequired',
      allowNull: false
    },
    addBGAmount: {
      type: DataTypes.STRING,
      field: 'addBGAmount',
      allowNull: true
    },
    addBGguid: DataTypes.STRING,
    addBGFileName: DataTypes.STRING,
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });

};
