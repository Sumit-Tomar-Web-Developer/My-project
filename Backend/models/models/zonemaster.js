//zoneMaster

import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const ZoneMaster = sequelize.define(
  'zonemaster',
  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    ZoneNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    ZoneType: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    Remark: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    CreatedBy: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    CreatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    UpdatedBy: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    UpdatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'zonemaster',
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
export default ZoneMaster;
