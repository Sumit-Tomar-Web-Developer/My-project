// src/models/TenderPhysicalProgress.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderPhysicalProgress', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    physicalTrackingSetUp: {
      type: DataTypes.JSON,
      field: 'physicalTrackingSetUp',
      allowNull: false
    },
    physicalTrackingProgress: {
      type: DataTypes.JSON,
      field: 'physicalTrackingProgress',
      allowNull: true
    },
    fileName: {
      type: DataTypes.STRING,
      field: 'fileName',
      allowNull: true
    },
    guid: {
        type: DataTypes.STRING,
        field: 'guid',
        allowNull: true
    },
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });
};
