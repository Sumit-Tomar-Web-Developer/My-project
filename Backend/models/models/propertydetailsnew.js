import sequelize from '../../config/connectionDB.js';
import { DataTypes, Sequelize } from 'sequelize';
import TypeofUseMaster from './typeofusemaster.js';
import CombinedOwnerName from './combinedownerrenternames.js';
const PropertyDetailsNew = sequelize.define(
  'propertydetailsnew',
  {
    PDNId: {
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
      type: DataTypes.STRING(5),
      allowNull: true,
      references: {
        model: 'floormaster',
        key: 'FloorID',
      },
    },
    ConstructionYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ConstructionType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'constructiontypemaster',
        key: 'ConstructionId',
      },
    },
    GroupId: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    TypeOFUse: {
      type: DataTypes.STRING(5),
      allowNull: true,
      references: {
        model: 'typeofusemaster',
        key: 'TypeOfUseID',
      },
    },
    CarpetAreaSqFeet: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    CarpetAreaSqMeter: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
     BuildUpAreaSqFeet: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    BuildUpAreaSqMeter: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    NoOfRooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Room: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Registration: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    RenterYesNO: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    RenterName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    RenterNameMarathi: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    Rent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    NonCalculateRent: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    OccupierYesNo: {
      type: DataTypes.BOOLEAN,
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
    Wing: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    IsAgreement: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AgreementDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    AgreementToDate: {
      type: DataTypes.DATEONLY,
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
      type: DataTypes.DATE(6),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'propertydetailsnew',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'PDNId' }],
      },
      {
        name: 'ConstructionId_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'PDNId' }],
      },
      {
        name: 'fk_propertydetailsnew_floormaster',
        using: 'BTREE',
        fields: [{ name: 'FloorID' }],
      },
      {
        name: 'fk_propertydetailsnew_ConstructionTypeMaster',
        using: 'BTREE',
        fields: [{ name: 'ConstructionType' }],
      },
      {
        name: 'FK_PropertyDetailsNew_PropertyMast_idx',
        using: 'BTREE',
        fields: [{ name: 'OwnerID' }],
      },
      {
        name: 'FK_propertydetailsnew_typeofusemaster',
        using: 'BTREE',
        fields: [{ name: 'TypeOFUse' }],
      },
    ],
  }
);


PropertyDetailsNew.belongsTo(CombinedOwnerName, {
  foreignKey: 'OwnerID', // Define the foreign key
  targetKey:'OwnerID',
  as: 'combinedOwnerName', // Define alias for the association
});
PropertyDetailsNew.belongsTo(TypeofUseMaster, {
  foreignKey: 'TypeOFUse',   // column in PropertyDetailsNew
  targetKey: 'TypeOfUseID',    // column in TypeofUseMaster
  as: 'typeofUseMaster'        // alias to access the association
});



export default PropertyDetailsNew;
