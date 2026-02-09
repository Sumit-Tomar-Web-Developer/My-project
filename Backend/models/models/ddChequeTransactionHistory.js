import { DataTypes } from "sequelize";
import sequelize from "../../config/connectionDB.js";
import PropertyMast from "./propertymast.js";

const DDChequeTransactionHistory = sequelize.define(
  "ddchequetransactionhistory",
  {
    DDChequeHistoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    BillBookNo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    InvoiceNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    TransactionDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    DDChequeNo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    DDChequeDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false
    },
    MerchantTxnRefNumber: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    ChequeStatus: {
      type: DataTypes.STRING(50),
      allowNull: false
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
    ChequeClearDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    BankName: {
      type: DataTypes.TEXT("long"),
      allowNull: true
    },
    PaymentResource: {
      type: DataTypes.TEXT("long"),
      allowNull: true
    },
    FinanceYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Latitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Longitude: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "DDChequeTransactionHistory",
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "DDChequeHistoryID" }]
      }
    ]
  }
);
PropertyMast.hasMany(DDChequeTransactionHistory, { foreignKey: 'OwnerID' });
DDChequeTransactionHistory.belongsTo(PropertyMast, { foreignKey: 'OwnerID' });
export default DDChequeTransactionHistory;
