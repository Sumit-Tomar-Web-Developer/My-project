import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const BillBookEntry = sequelize.define('billbookentry', {

  
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    EmpName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    BillBookNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ReceiptNoFrom: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ReceiptNoTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Remark: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ZoneNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    WardNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Status: {
      type: DataTypes.BOOLEAN, 
      defaultValue: false,
    },
    BillBookType: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'billbookmaster',
    timestamps: false, 
    indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "Id" },
          ]
        },
      ]
  }
);

export default BillBookEntry;
