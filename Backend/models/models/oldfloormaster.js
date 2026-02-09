import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const OldFloorMaster = sequelize.define(
  'oldfloormaster',
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true, // Ensure autoIncrement is set to true
      unique :"ID_UNIQUE"
    },
    OldFloorID: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: "UQ__FloorMas__49D1E86A3B2BBE9D",
      primaryKey: true,
    },
    OldDescription: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    CreatedBy: { // Changed to match the table schema
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CreatedDate: { // Changed to match the table schema
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    UpdatedBy: { // Changed to match the table schema
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UpdatedDate: { // Changed to match the table schema
      type: DataTypes.DATE(6),
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'oldfloormaster',
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
      {
        name: "uc_OldFloorMaster",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "OldFloorID" },
        ]
      },
    ]
  }
);

export default OldFloorMaster;
