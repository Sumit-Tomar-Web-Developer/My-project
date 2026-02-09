import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const CombinedOwnerNameHistory = sequelize.define(
  'combinedownerrenternameshistory',
  {
    RowHistoryID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    HistoryID: DataTypes.INTEGER,
    OwnerID: DataTypes.INTEGER,
    SnapshotType: DataTypes.STRING(10),

    ScreenName: DataTypes.STRING(50),
    EntryType: DataTypes.STRING(20),
    ChangedBy: DataTypes.INTEGER,
    ChangeDate: DataTypes.DATE,

    OwnerName: DataTypes.STRING(500),
    MarathiOwnerName: DataTypes.STRING(500),
    RenterName: DataTypes.STRING(500),
    MarathiRenterName: DataTypes.STRING(500),
    OccupierName: DataTypes.STRING(500),
    MarathiOccupierName: DataTypes.STRING(500)
  },
  {
    sequelize,
    tableName: 'combinedownerrenternameshistory',
    timestamps: false
  }
);

export default CombinedOwnerNameHistory;
