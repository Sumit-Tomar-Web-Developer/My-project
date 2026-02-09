import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const ApplicationSetting = sequelize.define('applicationsetting', {
  AppSettingID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  IsLivePaymentActive: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: true
  },
  DailyPaymentEndStatus: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: true
  },
  DailyCollectionReportTimeSpan: {
    type: DataTypes.TIME(3),
    allowNull: true
  },
  DailyCollectionReportDaySpan: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: true
  },
  DailyCollectionReportDaySpanForH: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  DailyCollectionReportDaySpanForDay: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  DashbordWithInterest: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    allowNull: true
  },
  OnlinePaymentPageFlag: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  OtpVerification: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    allowNull: true
  },
  IsWGMoreThnVal: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    allowNull: true
  },
  IsDataEntryRetainScreenEnable: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  IsMobileValidate: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  IsSpecialDiscount: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  DualReceiptCharge: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  IsReceiptDay: {
    type: DataTypes.TINYINT,
    allowNull: true
  },
  DualReceiptFee: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  IsThreeInchReceipt: {
    type: DataTypes.TINYINT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'applicationsetting',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "AppSettingID" },
      ]
    },
  ]
});

export default ApplicationSetting;
