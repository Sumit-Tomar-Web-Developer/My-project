import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const ApplyPenaltyTaxesMasterOwnerIDWise = sequelize.define(
  'applypenaltytaxesmaster',
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    AssesmentID: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PropertyTax: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    EducationTax: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    EmploymentTax: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    SpEducationTax: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    DrainCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    RoadCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    TreeCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    SewageDisposalCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Sanitation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    WaterBenefit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    SpWaterCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    WaterBill: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    MajorBuilding: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    FireCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    LightCess: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tax1: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tax2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tax3: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tax4: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Tax5: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    start_half_on_current: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_half_on_current: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    start_full_on_current: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_full_on_current: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    start_full_on_pending: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_full_on_pending: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
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
    Rate_Current: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    Rate_Pending: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    Year: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    IsValidateDate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    BillGenerationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    IsAppliedOwnerIDWise: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    NodeNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    SectorNo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'applypenaltytaxesmaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'id' }],
      },
    ],
  }
);
export default ApplyPenaltyTaxesMasterOwnerIDWise;
