// models/billtransactionadvanceresult.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/connectionDB.js";

const Billtransactionadvanceresultsummary = sequelize.define(
  "billtransactionadvanceresultsummary",
  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    ResultID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CreditediFinanceYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PaymentType: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PaidAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "billtransactionadvanceresultsummary",
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "ID" }],
      }
    ],
  }
);

export default Billtransactionadvanceresultsummary;
