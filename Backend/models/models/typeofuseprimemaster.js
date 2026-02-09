import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const TypeofUsePrime = sequelize.define('typeofuseprimemaster', {
  ID: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  Type: {
    type: DataTypes.STRING(5),
    allowNull: true,
    unique: "UQ__TypeOfUs__F9B8A48B8B76B71F"
  },
  Description: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  TypeTaxableStatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  CreatedBy: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  CreatedDate: {
    type: DataTypes.DATE(6),
    allowNull: true
  },
  UpdatedBy: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  UpdatedDate: {
    type: DataTypes.DATE(6),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'typeofuseprimemaster',
  timestamps: false,
  indexes: [
    {
      name: "UQ__TypeOfUs__F9B8A48B8B76B71F",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "Type" },
      ]
    },
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
export default TypeofUsePrime
