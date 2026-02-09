import sequelize from "../../config/connectionDB.js";
import { DataTypes } from "sequelize";

const PaymentResourceMaster = sequelize.define(
  "paymentresourcemaster",
  {
    PaymentResourceID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    Resource: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Description: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "paymentresourcemaster",
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "PaymentModeID" }],
      },
    ],
  }
);

export default PaymentResourceMaster;
