// src/models/TenderPhysicalProgress.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderSelectionDetails', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    govStatus: {
      type: DataTypes.ENUM("L1", "L2", "L3"),
      field: 'govStatus',
      allowNull: false
    },
    technicalSelected: {
      type: DataTypes.BOOLEAN,
      field: 'technicalSelected',
      allowNull: false
    },
    financialSelected: {
      type: DataTypes.BOOLEAN,
      field: 'financialSelected',
      allowNull: false
    },
    tenderAllocatedCompany: {
      type: DataTypes.STRING,
      field: 'tenderAllocatedCompany',
      allowNull: false
    },
    remarks: {
      type: DataTypes.STRING,
      field: 'remarks',
      allowNull: false
    },
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });

};
