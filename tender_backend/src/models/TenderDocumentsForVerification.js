module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderDocumentsForVerification', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    fileList: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });
};