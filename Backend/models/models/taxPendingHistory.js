// models/TaxPendingDetailsVersionHistory.js
import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const TaxPendingDetailsVersionHistory = sequelize.define('TaxPendingDetailsVersionHistory', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  OwnerID: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  PendingYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  PropertyTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  EducationTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  TreeCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  Tax1: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  EmploymentTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  FireCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  SpEducationTax: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  MajorBuilding: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  LightCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  RoadCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  DrainCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  SewageDisposalCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  Sanitation: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  SpWaterCess: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  WaterBenefit: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  WaterBill: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  TaxTotal: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  Interest: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  NetTotal: {
    type: DataTypes.DECIMAL(19,4),
    allowNull: true,
  },
  Remark: {
    type: DataTypes.STRING(100),
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
  OriginalID: {
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
  tableName: 'TaxPendingDetails_VersionHistory',
  timestamps: false, 
});

export default  TaxPendingDetailsVersionHistory;
