import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const TaxNameMaster = sequelize.define('taxnamemaster', {
  ID: {
    autoIncrement: true,
    type: DataTypes.SMALLINT,
    allowNull: false,
    primaryKey: true
  },
  TaxName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  AliseName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Status: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
}, {
  tableName: 'taxnamemaster',
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
  ]
});

export default TaxNameMaster;
