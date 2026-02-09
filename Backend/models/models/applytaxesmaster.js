import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const ApplyTaxesMaster = sequelize.define(
  'applytaxesmaster',
  {
    applytaxesmasterID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'propertymast',
        key: 'OwnerID',
      },
    },
    AssessmentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'assessmentmaster',
        key: 'AssessmentID',
      },
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
    IsTaxForPlot: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsPolicyApplicable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    InAppComm: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    InHearing: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    DrainFlatRate: {
      type: DataTypes.BOOLEAN,
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
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    UpdatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'applytaxesmaster',
    timestamps: false,

    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'applytaxesmasterID' }],
      },
      {
        name: 'UQ__ApplyTax__B32D8F86499AA4DC',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'OwnerID' }, { name: 'AssessmentID' }],
      },
      {
        name: 'FK_applytaxesmaster_assessmentmaster_idx',
        using: 'BTREE',
        fields: [{ name: 'AssessmentID' }],
      },
    ],
  }
);
export default ApplyTaxesMaster;
