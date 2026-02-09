import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const BankMaster = sequelize.define('bankmaster', {
    BankID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    BankName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Address: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
     CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW 
  },
  UpdatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  }
  }, {
    sequelize,
    tableName: 'bankmaster',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "BankID" },
        ]
      },
    ]
  });

  export default BankMaster
