module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderL1ApprovalDetails', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    loiReceived: {
      type: DataTypes.BOOLEAN,
      field: 'loiReceived',
      allowNull: false
    },
    workOrderCost: {
      type: DataTypes.DECIMAL(20, 2),
      field: 'workOrderCost',
      allowNull: false
    },
    securityDepositAmount: {
      type: DataTypes.DECIMAL(20, 2),
      field: 'securityDepositAmount',
      allowNull: false
    },
    completedByDate: { type: DataTypes.DATE, field: 'completedByDate', allowNull: false },
    agreementStampRequired: {
      type: DataTypes.BOOLEAN,
      field: 'agreementStampRequired',
      allowNull: false
    },
    stampDutyAmount: {
      type: DataTypes.DECIMAL(20, 2),
      field: 'stampDutyAmount',
      allowNull: false
    },
    registrationFees: {
      type: DataTypes.DECIMAL(20, 2),
      field: 'registrationFees',
      allowNull: false
    },
    physicalStampRequired: {
      type: DataTypes.BOOLEAN,
      field: 'physicalStampRequired',
      allowNull: false
    },
    numOfStampsRequired: DataTypes.INTEGER,
    eSBTRRequired: {
      type: DataTypes.BOOLEAN,
      field: 'eSBTRRequired',
      allowNull: false
    },
    panNo: { type: DataTypes.STRING, field: 'panNo', allowNull: true },
    gstNo: { type: DataTypes.STRING, field: 'gstNo', allowNull: true },
    otherPartyName: { type: DataTypes.STRING, field: 'otherPartyName', allowNull: false },
    otherDutyPayerId: { type: DataTypes.STRING, field: 'otherDutyPayerId', allowNull: false },
    l1FileName: { type: DataTypes.STRING, field: 'l1FileName', allowNull: false },
    l1Guid: { type: DataTypes.STRING, field: 'l1Guid', allowNull: false },
    loiFileName: { type: DataTypes.STRING, field: 'loiFileName', allowNull: false },
    loiGuid: { type: DataTypes.STRING, field: 'loiGuid', allowNull: false },
    agreementFileName: { type: DataTypes.STRING, field: 'agreementFileName', allowNull: false },
    agreementGuid: { type: DataTypes.STRING, field: 'agreementGuid', allowNull: false },
    workOrderFileName: { type: DataTypes.STRING, field: 'workOrderFileName', allowNull: false },
    workOrderGuid: { type: DataTypes.STRING, field: 'workOrderGuid', allowNull: false },
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });
};