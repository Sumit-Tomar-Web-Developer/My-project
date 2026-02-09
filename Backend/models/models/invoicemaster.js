// models/InvoiceNoMaster.js
import sequelize from '../../config/connectionDB.js'; 
import { DataTypes } from 'sequelize';

const InvoiceNoMaster = sequelize.define('InvoiceNoMaster', {
  ID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  Year: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  BillBookNo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  InvoiceNo: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },
  Status: {
    type: DataTypes.BOOLEAN, 
    allowNull: true,
  },
  Reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  PreviousReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  CreationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  UpdatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  UpdationDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'invoicenomaster',
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
});

export default InvoiceNoMaster;
