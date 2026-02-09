import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const FloorSubmissionDetailsMinusData= sequelize.define('floorsubmissiondetailsminusdata', {
    FSDMDId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Length: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Width: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Height: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Area: {
      type: DataTypes.FLOAT,
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
    },
    FSDId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'floorsubmissiondetails',
        key: 'FSDId'
      }
    },
    RoomShapeID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RoomShapeName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    SmallBase: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    LargeBase: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Radius: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    length_a: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    length_b: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    length_c: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'floorsubmissiondetailsminusdata',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "FSDMDId" },
        ]
      },
      {
        name: "FK_floorsubmissiondetailsminusdata_floorsubmissiondetails_idx",
        using: "BTREE",
        fields: [
          { name: "FSDId" },
        ]
      },
    ]
  });
  
  export default FloorSubmissionDetailsMinusData;

