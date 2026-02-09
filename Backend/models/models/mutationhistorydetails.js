import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const MutationHistoryDetails = sequelize.define(
  'mutationhistorydetails',
  {
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propertymast',
        key: 'OwnerID'
      }
    },
    SellerName: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    BuyerName: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    PurchaseDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    OccupierName:  {
     type: DataTypes.STRING(500),
      allowNull: true
    },

        OccupierNameMarathi:  {
         type: DataTypes.STRING(500),
      allowNull: true
    },
    SellingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ReasonForSale: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    OrderNo: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OrderTransferDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    OPUser: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreationDate: {
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
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'mutationhistorydetails',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "FK_mutationhistorydetails_Propertymast_idx",
        using: "BTREE",
        fields: [
          { name: "OwnerID" },
        ]
      },
    ]
  });

export default MutationHistoryDetails;