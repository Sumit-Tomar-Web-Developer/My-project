import sequelize from '../config/connectionDB.js';
import PropertyMast from './propertymast.js';
import ApplyTaxesMaster from './applytaxesmaster.js';


// Define associations here
PropertyMast.hasMany(ApplyTaxesMaster, {
  foreignKey: 'OwnerID',
  as: 'appliedTaxes',
});
ApplyTaxesMaster.belongsTo(PropertyMast, {
  foreignKey: 'OwnerID',
  as: 'owner',
});

// Export models
export { PropertyMast, ApplyTaxesMaster};

// Export sequelize instance for use in other parts of the app
export default sequelize;
