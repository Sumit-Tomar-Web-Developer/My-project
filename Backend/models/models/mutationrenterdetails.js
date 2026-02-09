import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const RenterMutation = sequelize.define('mutationrenterdetails', {
  RMutationID: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  OwnerID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  PDNID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Floor: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  CurrentRenter: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  MCurrentRenter: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  PreviousRenter: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  MPreviousRenter: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  CurrentOccupier: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  MCurrentOccupier: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  PreviousOccupier: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  MPreviousOccupier: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  Remark: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  MutationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  OrderNo: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'mutationrenterdetails',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "RMutationID" },
      ]
    },
  ]
});
export default RenterMutation;
