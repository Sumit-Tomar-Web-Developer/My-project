import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const CustomTaxesMast = sequelize.define(
  'customtaxesmast',
  {
    CSTId: {
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
    PendingYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PropertyTax: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    EducationTax: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    TreeCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    EmploymentTax: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    FireCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    SpEducationTax: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    MajorBuilding: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    LightCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    RoadCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    DrainCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    SewageDisposalCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    Sanitation: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    SpWaterCess: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    WaterBenefit: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    WaterBill: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    Tax1: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    Tax2: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    Tax3: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    Tax4: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    Tax5: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    TaxTotal: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    Interest: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    NetTotal: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: true,
    },
    Remark: {
      type: DataTypes.STRING(100),
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
    FinanceYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OriginalOwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    EmpID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PartitionNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PropertyNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    WardNo: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    IsInterestRuntime: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'customtaxesmast',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'CSTId' }],
      },
      {
        name: 'FK_customtaxesmast_propertymast_idx',
        using: 'BTREE',
        fields: [{ name: 'OwnerID' }],
      },
    ],
  }
);
export default CustomTaxesMast;
