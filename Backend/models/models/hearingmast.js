import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const HearingMast = sequelize.define('hearingmast', {
  hearingmastID: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  OwnerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
      references: {
        model: 'propertymast',
        key: 'OwnerID'
      }
  },
  Date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Reason: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  EmpID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  WardNo: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  PropertyNo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  PartitionNo: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  PropertyTax: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  TreeCess: {
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
  RentalValue: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  OriginalOwnerID: {
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
  UpdatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'hearingmast',
  timestamps: false,
  indexes: [
    {
      name: "PRIMARY",
      unique: true,
      using: "BTREE",
      fields: [
          { name: "hearingmastID" },
        ]
      },
      {
        name: "FK_hearingmast_idx",
        using: "BTREE",
        fields: [
        { name: "OwnerID" },
      ]
    },
  ]
});
export default HearingMast
