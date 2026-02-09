import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js'; 
  const BillTransactionDetailsAdvance = sequelize.define('billtransactiondetailsadvance', {
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
      allowNull: true,
      references: {
        model: 'propertymast',
        key: 'OwnerID'
      }
    },
    BillBookNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    InvoiceNo: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.INTEGER,
      allowNull: true
    },
    TransactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    BillDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    PropertyTax: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    EducationTax: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    EmploymentTax: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    TreeCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    SpWaterCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    Sanitation: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    DrainCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    RoadCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    FireCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    LightCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    WaterBenefit: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    MajorBuilding: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    SewageDisposalCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    SpEducationTax: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    WaterBill: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    Tax1: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    Tax2: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    Tax3: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    Tax4: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    Tax5: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    TaxTotal: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    Interest: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    Discount: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    Noticefee: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    WarrentFee: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    MiscellaneousFee: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    NetTotal: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    Amount: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true
    },
    EmpID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    PaymentMode: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    DDChequeNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    PayeeName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BankName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BranchName: {
      type: DataTypes.STRING(50),
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
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PaymentType: {
      type: DataTypes.STRING(25),
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
    tableName: 'billtransactiondetailsadvance',
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
      {
        name: "FK_BillTransactionDetailsAdvance_PropertyMast",
        using: "BTREE",
        fields: [
          { name: "OwnerID" },
        ]
      },
    ]
  });

export default BillTransactionDetailsAdvance
