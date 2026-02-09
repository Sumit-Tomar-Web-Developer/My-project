// models/TransMastVersionHistory.js
import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const TransMastVersionHistory = sequelize.define('TransMastVersionHistory', {
  OwnerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  FinanceYear: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
  RateableValue: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  PropertyTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  Tax1: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  EducationTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  EmploymentTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  TreeCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  TaxTotal: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  AssesmentID: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
  Remark: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  SpEducationTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  Sanitation: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  DrainCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  SpWaterCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  RoadCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  FireCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  LightCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  WaterBenefit: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  MajorBuilding: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  SewageDisposalCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  WaterBill: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  LettingValue: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  YearlyRentedAreaRent: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  YearlyNonRentedAreaRent: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  AnnualRent: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  Maintenance: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  Interest: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  RRateableValue: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CRateableValue: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  RMaintenance: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  CMaintenance: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  RLettingValue: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  CLettingValue: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  REducationTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  CEducationTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  REmploymentTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  CEmploymentTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  Tax2: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  Tax3: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  Tax4: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  Tax5: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  UpdatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  OriginalOwnerID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ScreenName: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  ChangeOnControl: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  EntryType: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  UpdVersionID: {
    type: DataTypes.CHAR(36),
    allowNull: true,
  },
  AfterBefore: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: 'TransMast_VersionHistory',
  timestamps: false,
});

export default TransMastVersionHistory;
