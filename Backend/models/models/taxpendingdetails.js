import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

export const TaxPendingDetails = sequelize.define('taxpendingdetails', {
  TPDID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PendingYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PropertyTax: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    EducationTax: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    TreeCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    EmploymentTax: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    FireCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    SpEducationTax: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    MajorBuilding: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    LightCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    RoadCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    DrainCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    SewageDisposalCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Sanitation: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    SpWaterCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    WaterBenefit: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    WaterBill: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Tax1: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Tax2: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Tax3: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Tax4: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Tax5: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    TaxTotal: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Interest: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    NetTotal: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Remark: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    OriginalID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    IsInterestRuntime: {
      type: DataTypes.BOOLEAN,
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
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'taxpendingdetails',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TPDID" },
        ]
      },
    ]
  });

