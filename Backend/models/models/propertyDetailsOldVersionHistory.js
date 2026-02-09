import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const PropertyDetailsOldHistory = sequelize.define(
  'PropertyDetailsOldHistory',
  {
    ID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    PDOId: DataTypes.INTEGER,
    OwnerID: DataTypes.INTEGER,

    OldFloorID: DataTypes.STRING(10),
    OldConstructionYear: DataTypes.INTEGER,
    OldConstructionType: DataTypes.STRING(10),
    OldTypeOFUse: DataTypes.STRING(10),
    OldCarpetAreaSqfeet: DataTypes.DOUBLE,
    OldCarpetAreaSqMeter: DataTypes.DOUBLE,

    CreatedBy: DataTypes.INTEGER,
    CreatedDate: DataTypes.DATE,
    UpdatedBy: DataTypes.INTEGER,
    UpdatedDate: DataTypes.DATE,

    ScreenName: DataTypes.STRING,
    ChangeOnControl: DataTypes.STRING,
    EntryType: DataTypes.STRING,

    UpdVersionID: DataTypes.STRING,
    SnapshotType: DataTypes.STRING,
    SnapshotBy: DataTypes.INTEGER,
    SnapshotCreatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'propertydetailsold_history',
    timestamps: false
  }
);

export default PropertyDetailsOldHistory;
