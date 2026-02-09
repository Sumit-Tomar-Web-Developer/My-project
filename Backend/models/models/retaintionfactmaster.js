import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const Retaintionfactmaster = sequelize.define('retaintionfactmaster', {
    FacterID: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement : true
    },
    FactorValue: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    FromYear: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ToYear: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    FromFactor: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ToFactor: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    UpdatedBy: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    RentalValue: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'retaintionfactmaster',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "FacterID" },
        ]
      }
    ]
  });
export default Retaintionfactmaster
