import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const ActiveTaxesMaster = sequelize.define(
  'activetaxesmaster',
  {
    TaxNameID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    TaxName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    TaxNameAlias: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TaxNameOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ActiveTaxHeadsOnly: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'activetaxesmaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'TaxNameID' }],
      },
    ],
  }
);
export default ActiveTaxesMaster;
