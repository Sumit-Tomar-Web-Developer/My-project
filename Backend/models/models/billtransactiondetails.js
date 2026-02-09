import { DataTypes } from "sequelize"; 
import sequelize from '../../config/connectionDB.js';
import PropertyMast from "./propertymast.js";
 const BillTransactionDetails = sequelize.define('billtransactiondetails', {
    BTId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ManageID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    BillBookNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    InvoiceNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MerchantTxnRefNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    FinanceYear: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    PendingYear: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    BillNo: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    TransactionDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    BillDate: {
      type: DataTypes.DATEONLY,
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
    EmploymentTax: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    TreeCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    SpWaterCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Sanitation: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    DrainCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    RoadCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    FireCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    LightCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    WaterBenefit: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    MajorBuilding: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    SewageDisposalCess: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    SpEducationTax: {
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
    Discount: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Noticefee: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    WarrentFee: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    MiscellaneousFee: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    NetTotal: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: true
    },
    EmpID: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    PaymentMode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DDChequeNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PayeeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BankName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BranchName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ChequeStatus: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    DDChequeDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ExpiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    IFSCNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Remark: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    PaymentType: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    TransactionId: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PaymentResource: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    RelID: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    EmailId: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    MobileNumber: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    TaxType: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LastDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    DiscountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    GrpOneInterestDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    GrpOneInterestDiscountPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    GrpTwoInterestDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    GrpTwoInterestDiscountPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CalFixedPendingInterestDiscountPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    RainWaterHarvestingDiscountAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    RainWaterHarvestingDiscountPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    GarbageSegregationDiscountAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    GarbageDisposalDiscountAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    GarbageDisposalDiscountPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    SolarEnergyDiscountAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    SolarEnergyDiscountPercentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    SpWaterCessDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    SpWaterCessDiscountPercentage: {
      type: DataTypes.FLOAT,
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
    },
     TransferFee: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    RTIFee: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    OtherFee: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'billtransactiondetails',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "BTId" },
        ]
      },
    ]
  });
BillTransactionDetails.belongsTo(PropertyMast, {
  foreignKey: "OwnerID",    
  targetKey: "OwnerID"     
});

PropertyMast.hasMany(BillTransactionDetails, {
  foreignKey: "OwnerID",
  sourceKey: "OwnerID"
});

export default BillTransactionDetails;