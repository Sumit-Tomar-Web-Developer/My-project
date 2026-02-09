import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const OldPropertyMastHistory = sequelize.define(
  'oldpropertymast_history',
  {
    HistoryID: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    SnapshotType: {
      type: DataTypes.ENUM('BEFORE', 'AFTER'),
      allowNull: false
    },
    UpdVersionID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    OldZoneNo: DataTypes.STRING(30),
    OldWardNo: DataTypes.STRING(50),
    OldPropertyNo: DataTypes.STRING(100),
    OldPartitionNo: DataTypes.STRING(20),
    OldComputerNo: DataTypes.STRING(20),
    OldDescription: DataTypes.STRING(20),
    OldCityServeyNo: DataTypes.STRING(50),
    OldPlotNo: DataTypes.STRING(20),

    OldRV: DataTypes.FLOAT,
    OldPropertyTax: DataTypes.FLOAT,
    OldTotalTax: DataTypes.FLOAT,
    OldPlotArea: DataTypes.FLOAT,
    OldPropertyUse: DataTypes.STRING(20),
    OldToiletNo: DataTypes.INTEGER,
    OldRentalValue: DataTypes.FLOAT,
    OldTotalRooms: DataTypes.INTEGER,
    OldALV: DataTypes.INTEGER,
    ConstAreaSqFt: DataTypes.INTEGER,

    CreatedBy: DataTypes.INTEGER,
    CreatedDate: DataTypes.DATE,
    UpdatedBy: DataTypes.INTEGER,
    UpdatedDate: DataTypes.DATE,
    ScreenName: DataTypes.STRING(100),
    ChangeOnControl: DataTypes.STRING(100),
    EntryType: DataTypes.STRING(50),
    SnapshotBy: DataTypes.INTEGER,
    SnapshotCreatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'oldpropertymast_history',
    timestamps: false
  }
);

export { OldPropertyMastHistory };
