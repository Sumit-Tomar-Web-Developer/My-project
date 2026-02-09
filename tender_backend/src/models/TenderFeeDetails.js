module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderFeeDetails', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    tenderFee: DataTypes.FLOAT,
    processingFee: DataTypes.FLOAT,
    exemptionTenderFee: DataTypes.BOOLEAN,
    createdBy: {type: DataTypes.STRING,field: 'createdby', allowNull: false,defaultValue: 'System'},
    updatedBy: {type: DataTypes.STRING,field: 'updatedby', allowNull: false,defaultValue: 'System'}
  });
};