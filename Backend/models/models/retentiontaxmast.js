import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const retentiontaxmast = sequelize.define('retentiontaxmast', {
    retentiontaxID: {
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
    type: DataTypes.DATE,
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
    type: DataTypes.INTEGER,
    allowNull: true
  },
  PartitionNo: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  RentalValue: {
    type: DataTypes.DOUBLE,
    allowNull: true
  },
  PropertyTax: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  EducationTax: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  TreeCess: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  EmploymentTax: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  FireCess: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  SpEducationTax: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  MajorBuilding: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  LightCess: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  RoadCess: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  DrainCess: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  SewageDisposalCess: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  Sanitation: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  SpWaterCess: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  WaterBenefit: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  WaterBill: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  Tax1: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  Tax2: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  Tax3: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  Tax4: {
    type: DataTypes.DECIMAL(10, 0),
    allowNull: true
  },
  Tax5: {
    type: DataTypes.DECIMAL(10, 0),
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
  tableName: 'retentiontaxmast',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "retentiontaxID" },
        ]
      },
      {
        name: "FK_retentiontaxmast_index",
        using: "BTREE",
        fields: [
          { name: "OwnerID" },
        ]
      },
    ]
});
export default retentiontaxmast
