import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const SecurityLayer = sequelize.define(
  'securitylayer',
  {
    LayerID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    LayerName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'securitylayer',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'LayerID' }],
      },
    ],
  }
);
export default SecurityLayer;
