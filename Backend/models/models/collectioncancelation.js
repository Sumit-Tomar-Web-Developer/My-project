import { DataTypes } from "sequelize";
import sequelize from "../../config/connectionDB.js";

const CollectionCancelation = sequelize.define(
  "collectioncancelation",
  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    BillNo: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    TransactionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    BillDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    PropertyTax: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    Tax1: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    EducationTax: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    EmploymentTax: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    TreeCess: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    SpWaterCess: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    Sanitation: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    DrainCess: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    RoadCess: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    FireCess: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    LightCess: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    WaterBenefit: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    MajorBuilding: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    SewageDisposalCess: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    SpEducationTax: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    WaterBill: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    TaxTotal: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    Interest: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    Discount: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    Noticefee: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    WarrentFee: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    NetTotal: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    EmpID: { type: DataTypes.SMALLINT, allowNull: true },
    PaymentMode: { type: DataTypes.STRING(50), allowNull: true },
    PaymentType: { type: DataTypes.STRING(10), allowNull: true },
    DDChequeNo: { type: DataTypes.STRING(300), allowNull: true },
    PayeeName: { type: DataTypes.STRING(50), allowNull: true },
    BankName: { type: DataTypes.STRING(500), allowNull: true },
    BranchName: { type: DataTypes.STRING(50), allowNull: true },
    DDChequeDate: { type: DataTypes.DATEONLY, allowNull: true },
    ExpiryDate: { type: DataTypes.DATEONLY, allowNull: true },
    IFSCNo: { type: DataTypes.STRING(50), allowNull: true },
    Amount: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    FinanceYear: { type: DataTypes.SMALLINT, allowNull: true },
    PendingYear: { type: DataTypes.SMALLINT, allowNull: true },
    Remark: { type: DataTypes.TEXT, allowNull: true },
    Tax2: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    Tax3: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    Tax4: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    Tax5: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    PaymentResource: { type: DataTypes.STRING(15), allowNull: true },
    MerchantTxnRefNumber: { type: DataTypes.STRING(50), allowNull: true },
    ActiveYearID: { type: DataTypes.INTEGER, allowNull: true },
    TransactionId: { type: DataTypes.STRING(50), allowNull: true },
    EmailId: { type: DataTypes.STRING(100), allowNull: true },
    MobileNumber: { type: DataTypes.STRING(15), allowNull: true },
    AdharCardNumber: { type: DataTypes.STRING(50), allowNull: true },
    DebitRefID: { type: DataTypes.STRING(50), allowNull: true },
    MiscellaneousFee: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
    ChequeStatus: { type: DataTypes.STRING(30), allowNull: true },
    DiscountPercentage: { type: DataTypes.INTEGER, allowNull: true },
    UpdatedBy: { type: DataTypes.INTEGER, allowNull: true },
    CreatedBy: { type: DataTypes.INTEGER, allowNull: true },
    CreatedDate: { type: DataTypes.DATE, allowNull: true },
    UpdatedDate: { type: DataTypes.DATE, allowNull: true },
    CancelReason: { type: DataTypes.TEXT, allowNull: true },
    Latitude: { type: DataTypes.STRING(50), allowNull: true },
    Longitude: { type: DataTypes.STRING(50), allowNull: true },
    PublicIP: { type: DataTypes.STRING(50), allowNull: true },
    LocalIP: { type: DataTypes.STRING(50), allowNull: true },
    LocalMac: { type: DataTypes.STRING(50), allowNull: true },
  },
 {
    sequelize,
    tableName: 'collectioncancelation',
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
    ]
  }
);

export default CollectionCancelation;
