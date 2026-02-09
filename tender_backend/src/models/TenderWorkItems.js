module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderWorkItems', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    title: DataTypes.STRING,
    productCategory: DataTypes.STRING,
    location: DataTypes.STRING,
    preBidAddress: DataTypes.STRING,
    preBidDate: {
      type: DataTypes.DATE,
      allowNull: true, 
    },
    preBidExtension: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPreBidding: DataTypes.BOOLEAN,
    isPreBiddingSite: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    createdBy: {type: DataTypes.STRING,field: 'createdby', allowNull: false,defaultValue: 'System'},
    updatedBy: {type: DataTypes.STRING,field: 'updatedby', allowNull: false,defaultValue: 'System'}
  });
};