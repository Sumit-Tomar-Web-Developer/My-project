import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const TapSizeMaster = sequelize.define(
  'tapsizemaster',
  {
    TapSizeId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    SizeInInch: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    SizeAlias: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'tapsizemaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'TapSizeId' }],
      },
    ],
  }
);

export default TapSizeMaster;
