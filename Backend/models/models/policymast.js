import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

export const PolicyMast = sequelize.define(
  'policymast',{
    OwnerID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Reason: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    RateableValue: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    PropertyTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    TreeTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    EducationTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    EmploymentTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    SpEducationTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    SanitationTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    DrainTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    SpWaterTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    RoadTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    FireTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    LightTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    WaterBenefit: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    MajorBuildingTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    SewageDisposalTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    WaterBill: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Interest: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Tax1: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Tax2: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Tax3: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Tax4: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Tax5: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ResRateablevalue: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    NonResRateablevalue: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'policymast',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "OwnerID" },
        ]
      },
    ]
  });
