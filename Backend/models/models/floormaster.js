import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const FloorMaster = sequelize.define(
 'floormaster',
 {
    FMId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true 
    },
    FloorID: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: "UQ__FloorMas__49D1E86A3B2BBE9D"
    },
    Description: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Weightage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'floormaster',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "FMId" },
        ]
      },
      {
        name: "UQ__FloorMas__49D1E86A3B2BBE9D",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "FloorID" },
        ]
      },
    ]
  });
  export default FloorMaster;