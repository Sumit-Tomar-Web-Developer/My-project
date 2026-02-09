module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderApprovalDetails', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    TechLeadApproval: DataTypes.ENUM("APPROVED", "REJECTED"),
    TechLeadComments: DataTypes.STRING,
    TechLeadApprover: DataTypes.STRING,
    TechLeadApprovedAt: DataTypes.STRING,

    DirectorApproval: DataTypes.ENUM("APPROVED", "REJECTED"),
    DirectorComments: DataTypes.STRING,
    DirectorApprover: DataTypes.STRING,
    DirectorApprovedAt: DataTypes.STRING,

    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });
};