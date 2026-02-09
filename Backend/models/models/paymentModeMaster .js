import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const PaymentModeMaster = sequelize.define(
  "paymentmodemaster",
  {
    PaymentModeID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Mode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Description: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    CounterPayment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    NTISPayment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OnlinePayment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TabPayment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    AllPayment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'paymentmodemaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'PaymentModeID' }],
      },
    ],
  }
);

export default PaymentModeMaster;
