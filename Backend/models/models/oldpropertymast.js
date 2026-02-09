import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
import Users from '../models/users.js'



const OldPropertyMast = sequelize.define(
  'oldpropertymast',
  {
    OwnerID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    OldZoneNo: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    OldWardNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    OldPropertyNo: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    OldPartitionNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OldComputerNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OldDescription: {
      type: DataTypes.STRING(20),
      allowNull: true
    },


    OldCityServeyNo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    OldPlotNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OldRV: {
      type: DataTypes.FLOAT,
      default: null,
      allowNull: true
    },
    OldPropertyTax: {
      type: DataTypes.FLOAT,
      default: null,
      allowNull: true
    },
    OldTotalTax: {
      type: DataTypes.FLOAT,
      default: null,
      allowNull: true
    },
    OldPlotArea: {
      type: DataTypes.FLOAT,
      allowNull: true,
      default: null
    },
    OldPropertyUse: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OldToiletNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
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
      // references: {
      //   model: Users, 
      //   key: 'id'
      // },
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    OldRentalValue: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    OldTotalRooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    OldALV: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ConstAreaSqFt: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'oldpropertymast',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "OwnerID" },
        ]
      },
    ]
  }

);

export { OldPropertyMast };
