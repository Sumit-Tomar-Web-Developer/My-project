// import { DataTypes } from 'sequelize';
// import sequelize from '../../config/connectionDB.js';
// import JoinOwnerDetails from './jointownerdetails.js'; // Adjusted the import statement

// const PropertyMutation = sequelize.define(
//   'PropertyMutation', // Changed model name to 'PropertyMutation'
//   {
//     NewPropertyNo: {
//       type: DataTypes.STRING(5),
//       allowNull: true,
//     },
//     NewPartitionNo: {
//       type: DataTypes.STRING(5),
//       allowNull: true,
//     },
//     OwnerId: {
//       type: DataTypes.INTEGER,
//       allowNull: false, // Updated to disallow null values
//       references: {
//         model: JoinOwnerDetails,
//         key: 'OwnerID',
//       },
//     },
//   },
//   {
//     tableName: 'propertymast',
//     timestamps: false,
//     indexes: [
//       {
//         name: 'PRIMARY',
//         unique: true,
//         using: 'BTREE',
//         fields: [{ name: 'OwnerID' }],
//       },
//     ],
//     primaryKey: 'OwnerID'
//   }
// );

// JoinOwnerDetails.hasOne(PropertyMutation, { foreignKey: 'OwnerId' }); // Corrected the association type and foreign key
// PropertyMutation.belongsTo(JoinOwnerDetails, { foreignKey: 'JODId' }); // Corrected the association type and foreign key

// export default PropertyMutation;
