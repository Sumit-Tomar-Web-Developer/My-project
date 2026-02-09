// src/models/masterTenderStatus.js
module.exports = (sequelize, DataTypes) => {
    const MasterExpenseType = sequelize.define('MasterExpenseType', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false
      },
      expenseType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      expenseDescription: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'MasterExpenseType',
      timestamps: false
    });
  
    return MasterExpenseType;
  };
  