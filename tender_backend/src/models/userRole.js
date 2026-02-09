module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('UserRole', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true },

    roleName: {
      type:DataTypes.STRING, 
      allowNull: false},

    roleDescription: {
      type:DataTypes.STRING
    },

    isActive: { 
      type: DataTypes.BOOLEAN, 
      defaultValue: true 
    },

    createdDate: {
      type: DataTypes.DATE,
      field: 'createddate',
      defaultValue: DataTypes.NOW
    },
    DLEmails: {
      type: DataTypes.STRING,
      field: 'dlemails',
      defaultValue: ''
    },

    createdBy:{
      type: DataTypes.STRING,
      defaultValue:'System'
    },

    updatedDate: {
      type: DataTypes.DATE,
      field: 'updateddate',
      defaultValue: DataTypes.NOW
    },
    
    updatedBy: {type:DataTypes.STRING,defaultValue:'System'}
  });
  UserRole.associate = models => {
    UserRole.hasMany(models.User, { foreignKey: 'userRoleId' });
  };
  return UserRole;
};