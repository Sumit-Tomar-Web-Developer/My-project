import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const PropertyDetailsChangeHistory = sequelize.define(
  'propertydetailschangehistory',
  {
    HistoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ChangeDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ChangeOn: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    BeforeChange: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    AfterChange: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    ScreenName: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    ChangeOnControl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    EntryType: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'propertydetailschangehistory',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'HistoryID' }],
      },
    ],
  }
);

export default PropertyDetailsChangeHistory;
