import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const PropertyDetailsNewHistory = sequelize.define(
  'propertydetailsnew_history',
  {
    HistoryID: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    PDNId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UpdVersionID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    FloorID: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    ConstructionYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ConstructionType: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    GroupId: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    TypeOFUse: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    CarpetAreaSqFeet: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    CarpetAreaSqMeter: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    BuildUpAreaSqFeet: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    BuildUpAreaSqMeter: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    NoOfRooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Room: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Registration: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    RenterYesNO: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    RenterName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    RenterNameMarathi: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Rent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    NonCalculateRent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OccupierYesNo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    OccupierName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    OccupierNameMarathi: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Wing: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    IsAgreement: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AgreementDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    AgreementToDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UpdatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    SnapshotType: {
      type: DataTypes.STRING(10), // 'BEFORE' or 'AFTER'
      allowNull: false,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    SnapshotCreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'propertydetailsnew_history',
    timestamps: false,
  }
);

export default PropertyDetailsNewHistory;
