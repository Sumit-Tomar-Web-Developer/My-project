module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderEligibilityCriteria', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    technicalEligible: DataTypes.BOOLEAN,
    technical: DataTypes.STRING,
    financialEligible: DataTypes.BOOLEAN,
    financial: DataTypes.STRING,
    jointVenture: DataTypes.BOOLEAN,
    jointVenturePartner: DataTypes.STRING,
    createdBy: {type: DataTypes.STRING,field: 'createdby', allowNull: false,defaultValue: 'System'},
    updatedBy: {type: DataTypes.STRING,field: 'updatedby', allowNull: false,defaultValue: 'System'}
  });
};