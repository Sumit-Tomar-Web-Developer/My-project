module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderStampDetails', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    stampRequired: DataTypes.BOOLEAN,
    stampDetails: DataTypes.STRING,
    qty100: DataTypes.INTEGER,
    qty500: DataTypes.INTEGER,
    qty1000: DataTypes.INTEGER,
    createdBy: {type: DataTypes.STRING,field: 'createdby', allowNull: false,defaultValue: 'System'},
    updatedBy: {type: DataTypes.STRING,field: 'updatedby', allowNull: false,defaultValue: 'System'}
  });
};