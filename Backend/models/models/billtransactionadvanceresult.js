// models/billtransactionadvanceresult.js
import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js'; 

const BillTransactionAdvanceResult =  sequelize.define('billtransactionadvanceresult', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    FinanceYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    OpenBal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    CloseBal: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uniquekey: {
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: "UK_uniquekey"
    }
  }, {
    sequelize,
    tableName: 'billtransactionadvanceresult',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "ID" }]
      },
      {
        name: "UK_uniquekey",
        unique: true,
        using: "BTREE",
        fields: [{ name: "uniquekey" }]
      }
    ]
  });


export default BillTransactionAdvanceResult;
