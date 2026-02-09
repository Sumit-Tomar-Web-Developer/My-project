module.exports = (sequelize, DataTypes) => {
  const TenderBasicDetails = sequelize.define('TenderBasicDetails', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    location: DataTypes.STRING,
    tenderIdText: DataTypes.STRING,
    referenceNumber: DataTypes.STRING,
    department: DataTypes.INTEGER,
    departmentType: DataTypes.STRING,
    paymentMode: DataTypes.ENUM('Online', 'DD', 'FDR'),
    offlinePaymentDetails: DataTypes.STRING,
    UTRNumber: DataTypes.STRING,
    paymentReceiptGuid: DataTypes.STRING,
    paymentReceiptFileName: DataTypes.STRING,
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });

  TenderBasicDetails.associate = models => {
    TenderBasicDetails.belongsTo(models.MasterDepartment, { foreignKey: 'department', as: 'dep' });
  }

  return TenderBasicDetails;

};