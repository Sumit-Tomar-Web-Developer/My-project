import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const OldTaxesHistory = sequelize.define(
  'oldtaxes_history',
  {
    HistoryID: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    OwnerID: DataTypes.INTEGER,
    OriginalID: DataTypes.INTEGER,

    PropertyTax: DataTypes.DOUBLE,
    EducationTax: DataTypes.DOUBLE,
    EmploymentTax: DataTypes.DOUBLE,
    TreeCess: DataTypes.DOUBLE,
    FireCess: DataTypes.DOUBLE,
    SpEducationTax: DataTypes.DOUBLE,
    MajorBuilding: DataTypes.DOUBLE,
    LightCess: DataTypes.DOUBLE,
    RoadCess: DataTypes.DOUBLE,
    DrainCess: DataTypes.DOUBLE,
    SewageDisposalCess: DataTypes.DOUBLE,
    Sanitation: DataTypes.DOUBLE,
    SpWaterCess: DataTypes.DOUBLE,
    WaterBenefit: DataTypes.DOUBLE,
    WaterBill: DataTypes.DOUBLE,
    Interest: DataTypes.DOUBLE,
    TaxTotal: DataTypes.DOUBLE,

    OldTaxYear: DataTypes.STRING(20),

    Tax1: DataTypes.DOUBLE,
    Tax2: DataTypes.DOUBLE,
    Tax3: DataTypes.DOUBLE,
    Tax4: DataTypes.DOUBLE,
    Tax5: DataTypes.DOUBLE,

    CreatedBy: DataTypes.INTEGER,
    CreatedDate: DataTypes.DATE,
    UpdatedBy: DataTypes.INTEGER,
    UpdatedDate: DataTypes.DATE,

    ScreenName: DataTypes.STRING(100),
    ChangeOnControl: DataTypes.STRING(50),
    EntryType: DataTypes.STRING(50),

    UpdVersionID: {
      type: DataTypes.STRING(100),
      allowNull: true
    }, 
       SnapshotType: DataTypes.STRING(10),
    SnapshotBy: DataTypes.INTEGER,
    SnapshotCreatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'oldtaxes_history',
    timestamps: false
  }
);

export default OldTaxesHistory;
