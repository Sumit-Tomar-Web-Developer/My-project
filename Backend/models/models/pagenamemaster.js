import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const PageNameMaster = sequelize.define(
  'pagenamemaster',
  {
    PageID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    PageName: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    PageAlias: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'pagenamemaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'PageID' }],
      },
    ],
  }
);
export default PageNameMaster;
