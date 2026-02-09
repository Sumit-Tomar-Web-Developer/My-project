
import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const PaymentGatewayTransactionDetails = sequelize.define(
  'PaymentGatewayTransactionDetails',
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    OwnerID: { type: DataTypes.INTEGER, allowNull: false },
    BillBookNo: { type: DataTypes.STRING(500), allowNull: true },
    InvoiceNo: { type: DataTypes.INTEGER, allowNull: false },
    BillNo: { type: DataTypes.SMALLINT, allowNull: true },
    BillDate: { type: DataTypes.DATEONLY, allowNull: true },

    PropertyTax: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    Tax1: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    EducationTax: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    EmploymentTax: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    TreeCess: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    SpWaterCess: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    Sanitation: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    DrainCess: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    RoadCess: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    FireCess: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    LightCess: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    WaterBenefit: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    MajorBuilding: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    SewageDisposalCess: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    SpEducationTax: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    WaterBill: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    TaxTotal: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    Interest: { type: DataTypes.DECIMAL(19, 4), allowNull: true },

    Discount: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    Noticefee: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    WarrentFee: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    NetTotal: { type: DataTypes.DECIMAL(19, 4), allowNull: true },

    EmpID: { type: DataTypes.SMALLINT, allowNull: true },

    PaymentMode: { type: DataTypes.STRING(500), allowNull: true },
    DDChequeNo: { type: DataTypes.STRING(500), allowNull: true },
    PayeeName: { type: DataTypes.STRING(500), allowNull: true },
    BankName: { type: DataTypes.STRING(500), allowNull: true },
    BranchName: { type: DataTypes.STRING(500), allowNull: true },
    DDChequeDate: { type: DataTypes.DATEONLY, allowNull: true },
    ExpiryDate: { type: DataTypes.DATEONLY, allowNull: true },
    IFSCNo: { type: DataTypes.STRING(50), allowNull: true },

    FinanceYear: { type: DataTypes.SMALLINT, allowNull: true },
    PendingYear: { type: DataTypes.SMALLINT, allowNull: true },
    Remark: { type: DataTypes.STRING(500), allowNull: true },

    Tax2: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    Tax3: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    Tax4: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    Tax5: { type: DataTypes.DECIMAL(19, 4), allowNull: true },

    UpdatedBy: { type: DataTypes.INTEGER, allowNull: true },
    CreatedBy: { type: DataTypes.INTEGER, allowNull: true },
    CreatedDate: { type: DataTypes.DATE, allowNull: true },
    UpdatedDate: { type: DataTypes.DATE, allowNull: true },

    PaymentResource: { type: DataTypes.STRING(200), allowNull: true },
    RequestType: { type: DataTypes.STRING(50), allowNull: true },
    MerchantTxnRefNumber: { type: DataTypes.STRING(500), allowNull: true },
    Amount: { type: DataTypes.DECIMAL(19, 4), allowNull: true },

    UniqueCustomerId: { type: DataTypes.STRING(100), allowNull: true },
    ShoppingCartDetails: { type: DataTypes.STRING(1000), allowNull: true },

    TransactionDate: { type: DataTypes.DATE, allowNull: true },
    Email: { type: DataTypes.STRING(100), allowNull: true },
    MobileNumber: { type: DataTypes.DOUBLE, allowNull: true },

    TxnStatus: { type: DataTypes.STRING(10), allowNull: true },
    ClintTxnRefNo: { type: DataTypes.STRING(500), allowNull: true },
    TxnBankCode: { type: DataTypes.STRING(500), allowNull: true },
    TxnID: { type: DataTypes.STRING(100), allowNull: true },
    TxnAmount: { type: DataTypes.DOUBLE, allowNull: true },
    TxnDateTime: { type: DataTypes.DATE, allowNull: true },

    ActiveYearID: { type: DataTypes.INTEGER, allowNull: true },
    PaymentType: { type: DataTypes.STRING(100), allowNull: true },

    AdharCardNumber: { type: DataTypes.STRING(50), allowNull: true },
    DiscountPercentage: { type: DataTypes.INTEGER, allowNull: true },
    GrpOneInterestDiscount: { type: DataTypes.DOUBLE, allowNull: true },
    SpWaterCessDiscount: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    SpWaterCessDiscountPercentage: { type: DataTypes.INTEGER, allowNull: true },

    Latitude: { type: DataTypes.STRING(50), allowNull: true },
    Longitude: { type: DataTypes.STRING(50), allowNull: true },
    PublicIP: { type: DataTypes.STRING(50), allowNull: true },
    LocalIP: { type: DataTypes.STRING(50), allowNull: true },
    LocalMac: { type: DataTypes.STRING(50), allowNull: true },
    UpdatedLatitude: { type: DataTypes.STRING(50), allowNull: true },
    UpdatedLongitude: { type: DataTypes.STRING(50), allowNull: true },
    UpdatedPublicIP: { type: DataTypes.STRING(50), allowNull: true },
    UpdatedLocalIP: { type: DataTypes.STRING(50), allowNull: true },
    UpdatedLocalMac: { type: DataTypes.STRING(50), allowNull: true }
  },
  {
    tableName: 'PaymentGatewayTransactionDetails',
    timestamps: false
  }
);

export default PaymentGatewayTransactionDetails;
