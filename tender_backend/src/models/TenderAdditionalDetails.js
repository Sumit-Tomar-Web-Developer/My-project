module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderAdditionalDetails', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    referencedBy: DataTypes.STRING,
    additionalFieldDict: DataTypes.JSON, //ex: { list : [{ fieldName: DataTypes.STRING, fieldValue: DataTypes.STRING}]}
    createdBy: {type: DataTypes.STRING,field: 'createdby', allowNull: false,defaultValue: 'System'},
    updatedBy: {type: DataTypes.STRING,field: 'updatedby', allowNull: false,defaultValue: 'System'}
  });
};