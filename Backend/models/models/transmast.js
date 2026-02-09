import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const TransMast = sequelize.define('transmast', {
  TId: {
autoIncrement: true,
    type: DataTypes.INTEGER,
   allowNull: false,
      primaryKey: true
  },
  OwnerID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  FinanceYear: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  RateableValue: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  PropertyTax: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  EducationTax: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  EmploymentTax: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  TreeCess: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  SpEducationTax: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  Sanitation: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  DrainCess: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  SpWaterCess: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  RoadCess: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  FireCess: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  LightCess: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  WaterBenefit: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  MajorBuilding: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  SewageDisposalCess: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  WaterBill: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  TaxTotal: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  Maintenance: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  Interest: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  Tax1: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  Tax2: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  Tax3: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  Tax4: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  Tax5: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  Remark: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  OriginalOwnerID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  UpdatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'transmast',
  timestamps: false,
 indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TId" },
        ]
      },
    ]
});

export default TransMast
