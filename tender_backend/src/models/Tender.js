module.exports = (sequelize, DataTypes) => {
  const Tender = sequelize.define('Tender', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    currentStatus: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      references: { model: 'MasterTenderStatus', key: 'id' }
    },
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });
  Tender.associate = models => {
    Tender.belongsTo(models.MasterTenderStatus, { foreignKey: 'currentStatus', as: 'status' });
    Tender.hasOne(models.TenderBasicDetails, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderCoverDetails, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderEmdFeeDetails, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderFeeDetails, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderWorkItems, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderCriticalDates, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderStampDetails, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderEligibilityCriteria, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderAdditionalDetails, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderDocument, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderDocument, { foreignKey: 'tenderId' });
    Tender.hasMany(models.TenderCorrigendum, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderApprovalDetails, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderClosureDetails, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderFinancialClosure, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderFinancialProgress, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderPhysicalProgress, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderLZeroDetails, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderSubmittedDocument, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderSelectionDetails, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderDocumentsForVerification, { foreignKey: 'tenderId' });
    Tender.hasOne(models.TenderL1ApprovalDetails, { foreignKey: 'tenderId' });
    Tender.hasMany(models.TenderSubmittedExpense, { foreignKey: 'tenderId' });
  };
  return Tender;
};