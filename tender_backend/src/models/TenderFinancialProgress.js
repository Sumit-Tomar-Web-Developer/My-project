// src/models/TenderFinancialProgress.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenderFinancialProgress', {
    tenderId: { type: DataTypes.INTEGER, primaryKey: true },
    clientName: {
      type: DataTypes.STRING,
      field: 'clientname',
      allowNull: false
    },
    clientAddress: {
      type: DataTypes.STRING,
      field: 'clientaddress',
      allowNull: false
    },
    issuingAuthorityName: {
      type: DataTypes.STRING,
      field: 'issuingauthorityname',
      allowNull: false
    },
    clientGSTNumber: {
      type: DataTypes.STRING,
      field: 'clientgstnumber',
      allowNull: false
    },
    clientPAN: {
      type: DataTypes.STRING,
      field: 'clientpan',
      allowNull: false
    },
    billSubmittedAmount: {
      type: DataTypes.DECIMAL(20, 2),
      field: 'billsubmittedamount',
      allowNull: false
    },
    billPaymentReceived: {
      type: DataTypes.DECIMAL(20, 2),
      field: 'billpaymentreceived',
      allowNull: false
    },
    amountVarianceReason: {
      type: DataTypes.STRING,
      field: 'amountvariancereason',
      allowNull: false
    },
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' }
  });

};
