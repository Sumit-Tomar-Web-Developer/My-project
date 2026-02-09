import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const PropertyFullRowHistory = sequelize.define(
  'propertyfullrowhistory',
  {
    RowHistoryID: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    HistoryID: DataTypes.BIGINT,
    OwnerID: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    SnapshotType: {
      type: DataTypes.ENUM('BEFORE', 'AFTER'),
      allowNull: false
    },
    UpdVersionID: {
      type: DataTypes.STRING(100), // UUID ke liye string kaafi hai
      allowNull: true 
    },
    isPrime: {
      type: DataTypes.BOOLEAN, // Ya TINYINT(1)
      defaultValue: false
    },

    OwnerTitle: DataTypes.STRING,
    OwnerName: DataTypes.STRING,
    Address: DataTypes.TEXT,
    OwnerTitleMarathi: DataTypes.STRING,
    OwnerNameMarathi: DataTypes.STRING,
    OwnerPatta: DataTypes.TEXT,

    ShopNo: DataTypes.STRING,
    DuakanNo: DataTypes.STRING,
    BuildingOrShopName: DataTypes.STRING,
    BuildingOrShopNameMarathi: DataTypes.STRING,
    OccupierName: DataTypes.STRING,
    OccupierNameMarathi: DataTypes.STRING,

    ScreenName: DataTypes.STRING,
    ChangedBy: DataTypes.BIGINT,
    ChangeDate: DataTypes.DATE,
    EntryType: DataTypes.STRING
  },
  {
    tableName: 'property_fullrow_history',
    timestamps: false
  }
);

export default PropertyFullRowHistory;
