import { DataTypes } from "sequelize";
import sequelize from "../../config/connectionDB.js";

export const ApplyTaxMasterPrime = sequelize.define(
  "applytaxesmasterprime",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    TypeofUseId: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    Type: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    PropertyTax: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    EducationTax: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    EmploymentTax: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    SpEducationTax: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    DrainCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    RoadCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    TreeCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    SewageDisposalCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Sanitation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    WaterBenefit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    SpWaterCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    WaterBill: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    MajorBuilding: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    FireCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    LightCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tax1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tax2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tax3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tax4: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tax5: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    UpdatedBy: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    CreatedBy: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0,
    },
    CreatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    UpdatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "applytaxesmasterprime",
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "AtmId" }],
      },
    ],
  }
);
