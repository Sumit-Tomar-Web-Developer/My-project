import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const TransYearMast = sequelize.define('transyearmast', {
  FinanceYear: {
    autoIncrement: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    primaryKey: true
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW 
  },
  UpdatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  sequelize,
  tableName: 'transyearmast',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "FinanceYear" },
      ]
    },
  ]
});
export default TransYearMast
