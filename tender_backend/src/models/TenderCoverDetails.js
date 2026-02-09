module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderCoverDetails', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    docsDict: DataTypes.JSON, // ex: {list: [{ docType: '', docDesp: '' }]}
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });
};