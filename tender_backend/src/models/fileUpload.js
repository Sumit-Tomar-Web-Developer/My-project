module.exports = (sequelize, DataTypes) => {
  const FileUpload = sequelize.define('FileUpload', {
    guid: { type: DataTypes.STRING, primaryKey: true },
    fileName: DataTypes.STRING
  });
  return FileUpload;
};