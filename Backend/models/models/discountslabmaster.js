import { DataTypes } from "sequelize";
import sequelize from "../../config/connectionDB.js";

const DiscountSlabMaster = sequelize.define(
  "discountslabmaster",
  {
    DiscountID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ZoneSectionNo: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    Ward: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    DiscountFromDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DiscountToDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DiscountFinanceYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DiscountPendingYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PaymentType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    TaxName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    PaymentResource: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    DiscountPercentage: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "discountslabmaster",
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "DiscountID" }],
      },
    ],
    uniqueKeys: {
      uq_discount_slab: {
        fields: [
          "ZoneSectionNo",
          "Ward",
          "DiscountFromDate",
          "DiscountToDate",
          "DiscountFinanceYear",
          "DiscountPendingYear",
          "PaymentType",
          "TaxName",
          "PaymentResource",
          "DiscountPercentage",
        ],
      },
    },
  }
);

export default DiscountSlabMaster;
