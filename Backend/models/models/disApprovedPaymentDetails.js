import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js'; // adjust path if needed

const DisApprovedPaymentDetails = sequelize.define(
  'DisApprovedPaymentDetails',
  {
    Id: {
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
      type: DataTypes.STRING(50),
      allowNull: false
    },

    MerchantTxnRefNumber: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    FinanceYear: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    Amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    RemarkForDisApproved:{
        type: DataTypes.STRING(255),
        allowNull: true
    },

    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },

    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'disapprovedPaymentDetails',
    timestamps: false, // IMPORTANT: since we manage dates manually
    freezeTableName: true
  }
);

export default DisApprovedPaymentDetails;
