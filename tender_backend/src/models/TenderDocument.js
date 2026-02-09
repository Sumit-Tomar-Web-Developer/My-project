module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderDocument', {
    // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    guid: DataTypes.STRING,
    fileName: DataTypes.STRING,
    fileList: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    govtLink: DataTypes.STRING,
    createdBy: {type: DataTypes.STRING,field: 'createdby', allowNull: false,defaultValue: 'System'},
    updatedBy: {type: DataTypes.STRING,field: 'updatedby', allowNull: false,defaultValue: 'System'}
  });
};