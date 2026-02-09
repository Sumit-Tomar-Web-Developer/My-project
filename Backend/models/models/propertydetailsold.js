import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const PropertyDetailsOld = sequelize.define(
  'PropertyDetailsOld',
  {
    PDOId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'oldpropertymast', // Name of the table you're referencing
        key: 'ownerId' // The column in the referenced table
      }
    },
    OldFloorID: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'oldfloormaster',
        key: 'OldFloorID'
      }
    },
    OldConstructionYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    OldConstructionType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'oldconstructiontypemaster',
        key: 'OldConstructionId'
      }
    },
    OldTypeOFUse: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'oldtypeofusemaster',
        key: 'OldTypeOfUseID'
      }
    },
    OldCarpetAreaSqfeet: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    OldCarpetAreaSqMeter: {
      type: DataTypes.DOUBLE,
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
  },
  {
    sequelize,
    tableName: 'propertydetailsold',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'PDOId' }]
      },
      {
        name: 'FK_propertydetailsold_oldconstructiontypemaster_idx',
        using: 'BTREE',
        fields: [{ name: 'OldConstructionType' }]
      },
      {
        name: 'FK_propertydetailsold_oldfloormaster',
        using: 'BTREE',
        fields: [{ name: 'OldFloorID' }]
      },
      {
        name: 'FK_propertydetailsold_oldpropertymast_idx',
        using: 'BTREE',
        fields: [{ name: 'OwnerID' }]
      },
      {
        name: 'FK_propertydetailsold_oldtypeofusemaster',
        using: 'BTREE',
        fields: [{ name: 'OldTypeOFUse' }]
      }
    ]
  }
);

export default PropertyDetailsOld;
