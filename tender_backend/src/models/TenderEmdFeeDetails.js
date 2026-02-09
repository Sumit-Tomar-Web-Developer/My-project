module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderEmdFeeDetails', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    emdAmount: DataTypes.FLOAT,
    exemptionEmd: DataTypes.BOOLEAN,
    createdBy: {type: DataTypes.STRING,field: 'createdby', allowNull: false,defaultValue: 'System'},
    updatedBy: {type: DataTypes.STRING,field: 'updatedby', allowNull: false,defaultValue: 'System'}
  });
};