import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

export const OldTaxes = sequelize.define(
  'oldtaxes', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propertymast',
        key: 'OwnerID'
      }
    },
    PropertyTax: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
    },
    EducationTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    EmploymentTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    TreeCess: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    FireCess: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    SpEducationTax: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    MajorBuilding: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    LightCess: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    RoadCess: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    DrainCess: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    SewageDisposalCess: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    Sanitation: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    SpWaterCess: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    WaterBenefit: {
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
    TaxTotal: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    OldTaxYear: {
      type: DataTypes.STRING(20),
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
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'oldtaxes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "FK_oldtaxes_oldpropertymast_idx",
        using: "BTREE",
        fields: [
          { name: "OwnerID" },
        ]
      },
    ]
  });

