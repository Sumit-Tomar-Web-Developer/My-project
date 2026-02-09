// src/models/TenderCorrigendum.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderCorrigendum', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenderId: {
      type: DataTypes.INTEGER,
      field: 'tenderId',
      allowNull: false,
    },
    corrigendumReceivedDate: {
      type: DataTypes.DATE,
      field: 'corrigendumReceivedDate',
      allowNull: false
    },
    changes: {
      type: DataTypes.STRING,
      field: 'changes',
      allowNull: false
    },
    tenderExtendDate: {
      type: DataTypes.DATE,
      field: 'tenderExtendDate',
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }

  });

};