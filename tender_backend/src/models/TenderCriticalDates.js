module.exports = (sequelize, DataTypes) => {
  const TenderCriticalDates = sequelize.define('TenderCriticalDates', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    publishDate: DataTypes.DATE,
    bidOpeningDate: DataTypes.DATE,
    downloadStartDate: DataTypes.DATE,
    downloadEndDate: DataTypes.DATE,
    clarificationStartDate: DataTypes.DATE,
    clarificationEndDate: DataTypes.DATE,
    submissionStartDate: DataTypes.DATE,
    submissionEndDate: DataTypes.DATE,
    extensionDate: DataTypes.DATE,
    createdBy: {type: DataTypes.STRING,field: 'createdby', allowNull: false,defaultValue: 'System'},
    updatedBy: {type: DataTypes.STRING,field: 'updatedby', allowNull: false,defaultValue: 'System'}
  });

  TenderCriticalDates.associate = models => {
    TenderCriticalDates.belongsTo(models.Tender, {
      foreignKey: 'tenderId',
    });
  };

  return TenderCriticalDates;
};