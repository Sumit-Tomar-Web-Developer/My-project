// src/models/masterExpenseStatus.js
module.exports = (sequelize, DataTypes) => {
  const MasterExpenseStatus = sequelize.define('MasterExpenseStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'MasterExpenseStatus',
    timestamps: false
  });

  MasterExpenseStatus.associate = models => {
    // A status can have many tenderSubmittedExpenses
    MasterExpenseStatus.hasMany(models.TenderSubmittedExpense, {
      foreignKey: 'currentStatus',
      as: 'tenderSubmittedExpenses'
    });
  };

  return MasterExpenseStatus;
};
