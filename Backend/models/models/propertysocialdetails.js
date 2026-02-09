import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const PropertySocialDetails = sequelize.define(
  'propertysocialdetails',
  {
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'propertymast',
        key: 'OwnerID',
      },
    },
    IsSolar: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NoOfSolar: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IsBoar: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NoOfBoar: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IsRainwaterharvesting: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NoOfRainwaterharvesting: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IsWaterConn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    WaterConnSize: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    WaterConnectionYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IsWaterMeter: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    TapUse: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    IsHandPump: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NoOfHandPump: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IsWell: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NoOfWell: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IsLift: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NoOfLift: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    RoadNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    RoadWidth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IsGarbageSegrigation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ISGarbageDisposal: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsSepticTank: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NoOfSepticTank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    IsEBill: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NoOfTrees: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DirectionEast: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    DirectionWest: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    DirectionNorth: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    DirectionSouth: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // Extra fields added
    NoOfWaterConnection: { type: DataTypes.INTEGER, allowNull: true },
    WaterConnectionType: { type: DataTypes.STRING(50), allowNull: true },
    MeterStatus: { type: DataTypes.STRING(50), allowNull: true },
    WaterBillAreaName: { type: DataTypes.STRING(100), allowNull: true },
    WaterBillConnectionNo1: { type: DataTypes.INTEGER, allowNull: true },
    WaterBillMeterNo: { type: DataTypes.INTEGER, allowNull: true },
    ConnectionNo2: { type: DataTypes.INTEGER, allowNull: true },
    MeterNo2: { type: DataTypes.INTEGER, allowNull: true },
    ConnectionNo3: { type: DataTypes.INTEGER, allowNull: true },
    MeterNo3: { type: DataTypes.INTEGER, allowNull: true },
    ConnectionNo4: { type: DataTypes.INTEGER, allowNull: true },
    MeterNo4: { type: DataTypes.INTEGER, allowNull: true },
    ConnectionNo5: { type: DataTypes.INTEGER, allowNull: true },
    MeterNo5: { type: DataTypes.INTEGER, allowNull: true },
    IsTubeWell: { type: DataTypes.BOOLEAN, allowNull: true },
    ToiletSeatCountResidential: { type: DataTypes.INTEGER, allowNull: true },
    ToiletSeatCountNonResidential: { type: DataTypes.INTEGER, allowNull: true },
    IsWastewaterOutlet: { type: DataTypes.BOOLEAN, allowNull: true },
    IsEtpStp: { type: DataTypes.BOOLEAN, allowNull: true },
    IsHomeComposting: { type: DataTypes.BOOLEAN, allowNull: true },
    IsVermicompost: { type: DataTypes.BOOLEAN, allowNull: true },
    IsECharging: { type: DataTypes.BOOLEAN, allowNull: true },
    IsUndergroundSewage: { type: DataTypes.BOOLEAN, allowNull: true },
    IsUndergroundTank: { type: DataTypes.BOOLEAN, allowNull: true },
    IsBoosterPump: { type: DataTypes.BOOLEAN, allowNull: true },
    WaterBillCustomerNo: { type: DataTypes.INTEGER, allowNull: true },
    IsFireSafety: { type: DataTypes.BOOLEAN, allowNull: true },
    NoOfFireSafety: { type: DataTypes.INTEGER, allowNull: true },
    IsBuildingPermission: { type: DataTypes.BOOLEAN, allowNull: true },
    IsOcIssued: { type: DataTypes.BOOLEAN, allowNull: true },
    OcNo: { type: DataTypes.INTEGER, allowNull: true },
    WaterRemark: { type: DataTypes.STRING(255), allowNull: true },
    ParkingRemark: { type: DataTypes.STRING(255), allowNull: true },
    BorewellRemark: { type: DataTypes.STRING(255), allowNull: true },
    CCNumber: { type: DataTypes.INTEGER, allowNull: true },

  },

  {
    sequelize,
    tableName: 'propertysocialdetails',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'OwnerID' }],
      },
    ],
  }
);
export default PropertySocialDetails;
