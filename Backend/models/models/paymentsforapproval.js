import { DataTypes } from "sequelize";
import sequelize from "../../config/connectionDB.js";

const  PaymentForApproval = sequelize.define('PaymentsForApproval', {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  OwnerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  BillBookNo: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  InvoiceNo: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  MerchantTxnRefNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  FinanceYear: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  PendingYear: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  BillNo: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  TransactionDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  BillDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  PropertyTax: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
  },
  EducationTax: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  EmploymentTax: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  TreeCess: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  SpWaterCess: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  Sanitation: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  DrainCess: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  RoadCess: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  FireCess: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  LightCess: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  WaterBenefit: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  MajorBuilding: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  SewageDisposalCess: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  SpEducationTax: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  WaterBill: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  Tax1: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  Tax2: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  Tax3: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  Tax4: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  Tax5: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  TaxTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  Interest: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  Discount: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  NoticeFee: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  WarrentFee: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  MiscellaneousFee: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  NetTotal: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  Amount: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  EmpID: { type: DataTypes.INTEGER, allowNull: true },
  PaymentMode: { type: DataTypes.STRING(20), allowNull: true },
  DDChequeNo: { type: DataTypes.STRING(50), allowNull: true },
  PayeeName: { type: DataTypes.STRING(100), allowNull: true },
  BankName: { type: DataTypes.STRING(100), allowNull: true },
  BranchName: { type: DataTypes.STRING(100), allowNull: true },
  DDChequeDate: { type: DataTypes.DATEONLY, allowNull: true },
  ExpiryDate: { type: DataTypes.DATEONLY, allowNull: true },
  IFSCNo: { type: DataTypes.STRING(20), allowNull: true },
  Remark: { type: DataTypes.TEXT, allowNull: true },
  PaymentType: { type: DataTypes.STRING(50), allowNull: true },
  TransactionId: { type: DataTypes.STRING(100), allowNull: true },
  MobileNumber: { type: DataTypes.STRING(20), allowNull: true },
  PaymentResource: { type: DataTypes.STRING(50), allowNull: true },
  CreatedBy: { type: DataTypes.INTEGER, allowNull: false },
  CreatedDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  UpdatedBy: { type: DataTypes.INTEGER, allowNull: false },
  UpdatedDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  Status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'Pending' },
  PaymentProof: { type: DataTypes.STRING(255), allowNull: true },
}, {
  tableName: 'PaymentsForApproval',
  timestamps: false, // Already managing CreatedDate/UpdatedDate manually
});


export default PaymentForApproval;
