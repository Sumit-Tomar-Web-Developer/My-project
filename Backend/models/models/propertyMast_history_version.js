import { DataTypes } from "sequelize";
import sequelize from "../../config/connectionDB.js";

const PropertyMastHistory = sequelize.define(
  "propertymasthistory",
  {
    RowHistoryID: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    HistoryID: DataTypes.BIGINT,
    OwnerID: DataTypes.BIGINT,
    SnapshotType: DataTypes.STRING(10),
    UpdVersionID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ScreenName: DataTypes.STRING(50),
    EntryType: DataTypes.STRING(20),
    ChangedBy: DataTypes.BIGINT,
    ChangeDate: DataTypes.DATE,
    CreatedAt: DataTypes.DATE,

    // ==== COPY FIELDS ====
    NewZoneNo: DataTypes.STRING(5),
    NewWardNo: DataTypes.STRING(10),
    NewPropertyNo: DataTypes.STRING(5),
    NewPartitionNo: DataTypes.STRING(5),
    NewCityServeyNo: DataTypes.STRING(20),
    NewPlotNo: DataTypes.STRING(20),
    OpenPlot: DataTypes.BOOLEAN,
    PlotArea: DataTypes.INTEGER,
    PropertyTypeID: DataTypes.INTEGER,

    OwnerTitle: DataTypes.STRING(10),
    OwnerName: DataTypes.STRING(500),
    OwnerTitleMarathi: DataTypes.STRING(20),
    OwnerNameMarathi: DataTypes.STRING(500),
    OwnerPatta: DataTypes.STRING(300),

    Address: DataTypes.STRING(200),
    BuildingOrShopName: DataTypes.STRING(500),
    BuildingOrShopNameMarathi: DataTypes.STRING(500),
    BuildingOrFlatNo: DataTypes.STRING(100),
    BuildingOrFlatNoMarathi: DataTypes.STRING(100),

    MobileNo: DataTypes.STRING(20),
    EmailID: DataTypes.STRING(30),
    Category: DataTypes.STRING(20),
    Type: DataTypes.STRING(20),
    Status: DataTypes.STRING(20),
    VersionNo: DataTypes.STRING(20),

    ShopNo: DataTypes.STRING(20),
    DuakanNo: DataTypes.STRING(20),

    PropertyRemark: DataTypes.STRING(500),
    LoanRemark: DataTypes.STRING(255),
    FileNo: DataTypes.STRING(255),
OpenPlotRenterName: DataTypes.STRING(255),
OpenPlotOccupierName: DataTypes.STRING(255),
OpenPlotOccupierMarathiName: DataTypes.STRING(255),

PlotTaxableAreaSqFt: DataTypes.DOUBLE,
PlotAreaSqMtr: DataTypes.DOUBLE,

OpenPlotLength: DataTypes.DOUBLE,
OpenPlotWidth: DataTypes.DOUBLE,
OpenPlotType: DataTypes.STRING(50),

Latitude: DataTypes.STRING(50),
Longitude: DataTypes.STRING(50),

ElectionCardNo: DataTypes.STRING(50),
PanCardNo: DataTypes.STRING(50),
AdharCardNo: DataTypes.STRING(50),
PinCode: DataTypes.STRING(10),

SocietyNameMarathi: DataTypes.STRING(255),
SocietyNameEnglish: DataTypes.STRING(255),

ManagerNameMarathi: DataTypes.STRING(255),
ManagerNameEnglish: DataTypes.STRING(255),
ManagerMobileNo: DataTypes.STRING(20),

Wing: DataTypes.STRING(50),
BuildingPermissions: DataTypes.STRING(255),
BuildingAdvertiseType: DataTypes.STRING(255),

LicenceNo: DataTypes.STRING(100),
LicenceDate: DataTypes.DATE,
YearOfPermission: DataTypes.STRING(10),
BuildCompletionDate: DataTypes.DATE,

AssessmentNo: DataTypes.STRING(100),
CouncilID: DataTypes.STRING(50),
NoOfPeople: DataTypes.INTEGER,

HearingObjNo: DataTypes.STRING(100),
AppealCommObjNo: DataTypes.STRING(100),

OccupierName: DataTypes.STRING(255),
OccupierNameMarathi: DataTypes.STRING(255),

BuildingOrSocietyName: DataTypes.STRING(255),
WadhGhatRemarkOne: {
  type: DataTypes.STRING(500),
  allowNull: true,
},
WadhGhatRemarkTwo: {
  type: DataTypes.STRING(500),
  allowNull: true,
},
WadhGhatRemarkThree: {
  type: DataTypes.STRING(500),
  allowNull: true,
},
CombPropRemark: {
  type: DataTypes.STRING(500),
  allowNull: true,
},
FlatSystemRemark: {
  type: DataTypes.STRING(20),
  allowNull: true,
},
BHK: {
  type: DataTypes.INTEGER,
  allowNull: true,
},
SocietyNameMarathi: {
  type: DataTypes.STRING(50),
  allowNull: true,
},
SocietyNameEnglish: {
  type: DataTypes.STRING(50),
  allowNull: true,
},
 

  },
  {
    sequelize,
    tableName: "propertymasthistory",
    timestamps: false,
  }
);

export default PropertyMastHistory;
