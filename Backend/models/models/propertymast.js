import { DataTypes } from "sequelize";
import sequelize from "../../config/connectionDB.js";
import AppealMast from "./appealmast.js";
import CombinedOwnerName from "./combinedownerrenternames.js";
import HearingMast from "./hearingmast.js";
import CourtResultMast from "./courtresultmast.js";
import retentiontaxmast from "./retentiontaxmast.js";
import AssessmentMaster from "./assessmentmaster.js";
import { OldPropertyMast } from "./oldpropertymast.js";
import PropertyTypeMaster from "./propertytypemaster.js";
import PropertyDetailsNew from "./propertydetailsnew.js";
import TransMast from "./transmast.js";
import FloorSubmissionDetails from "./floorsubmissiondetails.js";


const PropertyMast = sequelize.define(
  "propertymast",
  {
    OwnerID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    NewZoneNo: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    NewWardNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    NewPropertyNo: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    NewPartitionNo: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    NewCityServeyNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    NewPlotNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    OpenPlot: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    PlotArea: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PropertyTypeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OwnerTitle: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    OwnerName: {
      type: DataTypes.STRING(500),
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
    Address: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    BuildingOrShopName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    BuildingOrFlatNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    OwnerTitleMarathi: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    OwnerNameMarathi: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    OwnerPatta: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },

    BuildingOrShopNameMarathi: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    BuildingOrFlatNoMarathi: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    OpenPlotRenterName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    OpenPlotOccupierName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    OpenPlotOccupierMarathiName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PlotTaxableAreaSqFt: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    PlotAreaSqMtr: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    OpenPlotLength: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    OpenPlotWidth: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    OpenPlotType: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    MobileNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    EmailID: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    ElectionCardNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    PinCode: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    PanCardNo: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    AdharCardNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    NewToiletNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    commToiletNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    NoOfWaterConnection: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isPropertyLock: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PropertyRemark: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyRemarkTwo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
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
    Category: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Type: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    PartType: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    BlockNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    SecretoryNameMarathi: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    SecretoryNameEnglish: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ManagerNameMarathi: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ManagerNameEnglish: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ManagerMobileNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Wing: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    BuildingPermissions: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    BuildingAdvertiseType: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    LicenceNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    LicenceDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    YearOfPermission: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    BuildCompletionDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    AssessmentNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    CouncilID: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    NoOfPeople: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Latitude: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Longitude: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    HearingObjNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    AppealCommObjNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    VersionNo: {
      type: DataTypes.STRING(20),
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
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ShopNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    DuakanNo: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PropertyChange: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
       LoanRemark: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
      FileNo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "propertymast",
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "OwnerID" }],
      },
    ],
  }
);
PropertyMast.hasMany(AppealMast, { foreignKey: "OwnerID" });
PropertyMast.hasMany(CombinedOwnerName, { foreignKey: 'OwnerID' });
PropertyMast.hasMany(HearingMast, { foreignKey: "OwnerID" });
PropertyMast.hasMany(CourtResultMast, { foreignKey: "OwnerID" });
PropertyMast.hasMany(retentiontaxmast, { foreignKey: "OwnerID" });
PropertyMast.hasOne(AssessmentMaster, { foreignKey: "AssessmentID" });
PropertyMast.hasOne(OldPropertyMast, { foreignKey: 'ownerId' })
PropertyMast.hasMany(FloorSubmissionDetails, { foreignKey: "OwnerID" });
FloorSubmissionDetails.belongsTo(PropertyMast, { foreignKey: "OwnerID" });

export default PropertyMast;
