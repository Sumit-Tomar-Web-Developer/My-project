import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const RoomShapeMaster = sequelize.define('RoomShapeMaster', {
  ShapeID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
      allowNull: false,
    primaryKey: true
  },
  RoomShapeName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  Length: {
    type: DataTypes.TINYINT(1),
    allowNull: true
  },
  Width: {
    type: DataTypes.TINYINT(1),
    allowNull: true
  },
  Height: {
    type: DataTypes.TINYINT(1),
    allowNull: true
  },
  SmallBase: {
    type: DataTypes.TINYINT(1),
    allowNull: true
  },
  LargeBase: {
    type: DataTypes.TINYINT(1),
    allowNull: true
  },
  Radius: {
    type: DataTypes.TINYINT(1),
    allowNull: true
  },
  length_a: {
    type: DataTypes.TINYINT(1),
    allowNull: true
  },
  length_b: {
    type: DataTypes.TINYINT(1),
    allowNull: true
  },
  length_c: {
    type: DataTypes.TINYINT(1),
    allowNull: true
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
  }
}, {
    sequelize,

  tableName: 'roomshapemaster',
  timestamps: false ,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "ShapeID" },
      ]
    },
  ]
});

export default RoomShapeMaster
