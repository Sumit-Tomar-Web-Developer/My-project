import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const MutationDetails = sequelize.define(
  'mutationdetails',
  {
    MDId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, 
      autoIncrement: true
    },
    OwnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'propertymast',
        key: 'OwnerID'
      }
    },
    PurchaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    isPrime: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    OwnerTitle: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OwnerName: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
     OccupierName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    OccupierNameMarathi: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    SellingDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    ReasonForSale: {
      type: DataTypes.STRING(350),
      allowNull: true
    },
    TransferType: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    isSaler: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    OwnerTitleMarathi: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OwnerNameMarathi: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    MutationCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OrderNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OrderTransferDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    OriginalID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UpdVersionID: {
      type: DataTypes.STRING(255),
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
    tableName: 'mutationdetails',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MDId" },
        ]
      },
      {
        name: "FK_mutationdetails_propertymast_idx",
        using: "BTREE",
        fields: [
          { name: "OwnerId" },
        ]
      },
    ]
  });


export default MutationDetails
