import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const FloorSubmissionDetails = sequelize.define(
  'floorsubmissiondetails',
  {
    FSDId: {
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
    FloorID: {
      type: DataTypes.STRING(30),
      allowNull: true,
      references: {
        model: 'floormaster',
        key: 'FloorID',
      },
    },
    ConstructionYear: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    ConstructionId: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'constructiontypemaster',
        key: 'ConstructionId',
      },
    },
    TypeOfUseID: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    Length: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Width: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Height: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Formula: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Area: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    NoOfRooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    TotalArea: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    PDNId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'propertydetailsnew',
        key: 'PDNId',
      },
    },
    RoomNo: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    RoomRemark: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    RoomType: {
      type: DataTypes.STRING(255), 
      allowNull: true,
    },
    InnerOuter: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    isMinus: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Remark: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UpdatedBy: {
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
    RoomShapeID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    RoomShapeName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    SmallBase: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    LargeBase: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Radius: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    length_a: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    length_b: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    length_c: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'floorsubmissiondetails',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'FSDId' }],
      },
      {
        name: 'FK_floorsubmissiondetails_constructiontypemaster',
        using: 'BTREE',
        fields: [{ name: 'ConstructionId' }],
      },
      {
        name: 'FK_floorsubmissiondetails_floormaster',
        using: 'BTREE',
        fields: [{ name: 'FloorID' }],
      },
      {
        name: 'FK_floorsubmissiondetails_propertymast_idx',
        using: 'BTREE',
        fields: [{ name: 'OwnerID' }],
      },
      {
        name: 'FK_floorsubmissiondetails_propertydetailsnew',
        using: 'BTREE',
        fields: [{ name: 'PDNId' }],
      },
      
    ],
  }
);

export default FloorSubmissionDetails;
