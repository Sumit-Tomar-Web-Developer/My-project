import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const PasswordMaster = sequelize.define(
  'passwordmaster',
  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    levelname: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },

  {
    sequelize,
    tableName: 'passwordmaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'ID' }],
      },
    ],
  }
);
export default PasswordMaster;
