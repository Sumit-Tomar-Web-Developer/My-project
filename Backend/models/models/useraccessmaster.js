import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const UserAccessMaster = sequelize.define(
  'useraccessmaster',
  {
    AccessID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    AccessName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
  },
  {
    tableName: 'useraccessmaster',
    timestamps: false,
  }
);
export default UserAccessMaster;
