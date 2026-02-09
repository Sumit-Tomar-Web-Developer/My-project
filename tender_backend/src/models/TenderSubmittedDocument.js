module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderSubmittedDocument', {
    // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    guid: { type: DataTypes.STRING, field: 'guid', allowNull: false },
    fileName: { type: DataTypes.STRING, field: 'fileName', allowNull: false },
    openingDate: { type: DataTypes.DATE, field: 'openingDate', allowNull: false },
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });
};