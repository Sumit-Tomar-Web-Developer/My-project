import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const OldTypeOfUseMaster = sequelize.define(
  'oldtypeofusemaster',
  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    OldTypeOfUseID: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: 'ID_UNIQUE',
    },
    OldDescription: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    OldType: {
      type: DataTypes.STRING(50),
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
    tableName: 'oldtypeofusemaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'OldTypeOfUseID' }],
      },
      {
        name: 'ID_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'ID' }],
      },
    ],
  }
);
export default OldTypeOfUseMaster;
