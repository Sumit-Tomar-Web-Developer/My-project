import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const JoinOwnerDetails = sequelize.define(
  'jointownerdetails',
  {
    JODId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'propertymast',
        key: 'OwnerID',
      },
    },
    isPrime: {
      type: DataTypes.BOOLEAN,
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
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    BuildingOrSocietyName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    BuildingOrFlatNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OwnerTitleMarathi: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    OwnerNameMarathi: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    OwnerPatta: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    BuildingOrSocietyNameMarathi: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    BuildingOrFlatNoMarathi: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    BuildingOrShopName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    BuildingOrShopNameMarathi: {
      type: DataTypes.STRING(100),
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
    UpdatedBy: {
      type: DataTypes.INTEGER,
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
  },
  {
    sequelize,
    tableName: 'jointownerdetails',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'JODId' }],
      },
      {
        name: 'FK_JointOwnerDetails_PropertyMast_idx',
        using: 'BTREE',
        fields: [{ name: 'OwnerID' }],
      },
    ],
  }
);

export default JoinOwnerDetails;
