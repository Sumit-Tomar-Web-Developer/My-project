import sequelize from "../../config/connectionDB.js";
import { DataTypes } from "sequelize";
import PropertyMast from "./propertymast.js";
import { OldPropertyMast } from "./oldpropertymast.js";
import PropertyDetailsNew from "./propertydetailsnew.js";
import CombinedOwnerName from "./combinedownerrenternames.js";

const PropertyImageMast = sequelize.define(
  "propertyimagesmast",
  {
    ownerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "propertymast",
        key: "OwnerID",
      },
    },
    PlanPhoto: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    PropertyPhotoA: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    PropertyPhotoB: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    PropertyPhotoC: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    PropertyPhotoD: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    PlanPath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyPathA: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyPathB: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyPathC: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyPathD: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyQrPath: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyDockPath1: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyDockPath2: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyDockPath3: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyDockPath4: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyDockPath5: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    PropertyDockPath6: {
      type: DataTypes.STRING(500),
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
  },
  {
    sequelize,
    tableName: "propertyimagesmast",
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "ownerid" }],
      },
    ],
  }
);
PropertyImageMast.belongsTo(PropertyMast, {
  foreignKey: "ownerid", // Define the foreign key
  targetKey: "OwnerID",
  as: "property", // Define alias for the association
});
PropertyImageMast.belongsTo(OldPropertyMast, {
  foreignKey: "ownerid", // Adjust based on your actual foreign key
  targetKey: "OwnerID",
  as: "oldProperty",
});
PropertyImageMast.belongsTo(CombinedOwnerName, {
  foreignKey: "ownerid", // Adjust based on your actual foreign key
  targetKey: "OwnerID",
  as: "combinedOwnerName",
});
PropertyImageMast.belongsTo(PropertyDetailsNew, {
  foreignKey: "ownerid", // Adjust based on your actual foreign key
  targetKey: "OwnerID",
  as: "propertyDetailsNew",
});
export default PropertyImageMast;
