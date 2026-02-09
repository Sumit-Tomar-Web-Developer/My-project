var DataTypes = require("sequelize").DataTypes;
var _activetaxesmaster = require("./activetaxesmaster");
var _activeyearmaster = require("./activeyearmaster");
var _admin_users = require("./admin_users");
var _appealmast = require("./appealmast");
var _applaypenaltycustomizations = require("./applaypenaltycustomizations");
var _applycustomizepenalty = require("./applycustomizepenalty");
var _applypenaltytaxesmaster = require("./applypenaltytaxesmaster");
var _applytaxesmaster = require("./applytaxesmaster");
var _applytaxesmasterprime = require("./applytaxesmasterprime");
var _assessmentmaster = require("./assessmentmaster");
var _assessmentrulesmaster = require("./assessmentrulesmaster");
var _bankmaster = require("./bankmaster");
var _billtransactiondetails = require("./billtransactiondetails");
var _billtransactiondetailsadvance = require("./billtransactiondetailsadvance");
var _combinedownerrenternames = require("./combinedownerrenternames");
var _constructiontypemaster = require("./constructiontypemaster");
var _courtresultmast = require("./courtresultmast");
var _customtaxesmast = require("./customtaxesmast");
var _depreciationmaster = require("./depreciationmaster");
var _floormaster = require("./floormaster");
var _floorsubmissiondetails = require("./floorsubmissiondetails");
var _floorsubmissiondetailsminusdata = require("./floorsubmissiondetailsminusdata");
var _floorsubmissionroomnodetails = require("./floorsubmissionroomnodetails");
var _hearingmast = require("./hearingmast");
var _jointownerdetails = require("./jointownerdetails");
var _maintenancemaster = require("./maintenancemaster");
var _mutationdetails = require("./mutationdetails");
var _mutationhistorydetails = require("./mutationhistorydetails");
var _oldconstructiontypemaster = require("./oldconstructiontypemaster");
var _oldfloormaster = require("./oldfloormaster");
var _oldpropertymast = require("./oldpropertymast");
var _oldtaxes = require("./oldtaxes");
var _oldtypeofusemaster = require("./oldtypeofusemaster");
var _openplotratemaster = require("./openplotratemaster");
var _policymast = require("./policymast");
var _propertydetailsnew = require("./propertydetailsnew");
var _propertydetailsold = require("./propertydetailsold");
var _propertyimagesmast = require("./propertyimagesmast");
var _propertymast = require("./propertymast");
var _propertysocialdetails = require("./propertysocialdetails");
var _propertytypemaster = require("./propertytypemaster");
var _ratechartmaster = require("./ratechartmaster");
var _ratemaster = require("./ratemaster");
var _retaintionfactmaster = require("./retaintionfactmaster");
var _retentiontaxmast = require("./retentiontaxmast");
var _taxmaster = require("./taxmaster");
var _taxnamemaster = require("./taxnamemaster");
var _taxpendingdetails = require("./taxpendingdetails");
var _transmast = require("./transmast");
var _transyearmast = require("./transyearmast");
var _typeofusemaster = require("./typeofusemaster");
var _typeofuseprimemaster = require("./typeofuseprimemaster");
var _user_admin = require("./user_admin");
var _users = require("./users");
var _zonemaster = require("./zonemaster");
var _zonesectiondetails = require("./zonesectiondetails");
var _zonesectionmaster = require("./zonesectionmaster");

function initModels(sequelize) {
  var activetaxesmaster = _activetaxesmaster(sequelize, DataTypes);
  var activeyearmaster = _activeyearmaster(sequelize, DataTypes);
  var admin_users = _admin_users(sequelize, DataTypes);
  var appealmast = _appealmast(sequelize, DataTypes);
  var applaypenaltycustomizations = _applaypenaltycustomizations(sequelize, DataTypes);
  var applycustomizepenalty = _applycustomizepenalty(sequelize, DataTypes);
  var applypenaltytaxesmaster = _applypenaltytaxesmaster(sequelize, DataTypes);
  var applytaxesmaster = _applytaxesmaster(sequelize, DataTypes);
  var applytaxesmasterprime = _applytaxesmasterprime(sequelize, DataTypes);
  var assessmentmaster = _assessmentmaster(sequelize, DataTypes);
  var assessmentrulesmaster = _assessmentrulesmaster(sequelize, DataTypes);
  var bankmaster = _bankmaster(sequelize, DataTypes);
  var billtransactiondetails = _billtransactiondetails(sequelize, DataTypes);
  var billtransactiondetailsadvance = _billtransactiondetailsadvance(sequelize, DataTypes);
  var combinedownerrenternames = _combinedownerrenternames(sequelize, DataTypes);
  var constructiontypemaster = _constructiontypemaster(sequelize, DataTypes);
  var courtresultmast = _courtresultmast(sequelize, DataTypes);
  var customtaxesmast = _customtaxesmast(sequelize, DataTypes);
  var depreciationmaster = _depreciationmaster(sequelize, DataTypes);
  var floormaster = _floormaster(sequelize, DataTypes);
  var floorsubmissiondetails = _floorsubmissiondetails(sequelize, DataTypes);
  var floorsubmissiondetailsminusdata = _floorsubmissiondetailsminusdata(sequelize, DataTypes);
  var floorsubmissionroomnodetails = _floorsubmissionroomnodetails(sequelize, DataTypes);
  var hearingmast = _hearingmast(sequelize, DataTypes);
  var jointownerdetails = _jointownerdetails(sequelize, DataTypes);
  var maintenancemaster = _maintenancemaster(sequelize, DataTypes);
  var mutationdetails = _mutationdetails(sequelize, DataTypes);
  var mutationhistorydetails = _mutationhistorydetails(sequelize, DataTypes);
  var oldconstructiontypemaster = _oldconstructiontypemaster(sequelize, DataTypes);
  var oldfloormaster = _oldfloormaster(sequelize, DataTypes);
  var oldpropertymast = _oldpropertymast(sequelize, DataTypes);
  var oldtaxes = _oldtaxes(sequelize, DataTypes);
  var oldtypeofusemaster = _oldtypeofusemaster(sequelize, DataTypes);
  var openplotratemaster = _openplotratemaster(sequelize, DataTypes);
  var policymast = _policymast(sequelize, DataTypes);
  var propertydetailsnew = _propertydetailsnew(sequelize, DataTypes);
  var propertydetailsold = _propertydetailsold(sequelize, DataTypes);
  var propertyimagesmast = _propertyimagesmast(sequelize, DataTypes);
  var propertymast = _propertymast(sequelize, DataTypes);
  var propertysocialdetails = _propertysocialdetails(sequelize, DataTypes);
  var propertytypemaster = _propertytypemaster(sequelize, DataTypes);
  var ratechartmaster = _ratechartmaster(sequelize, DataTypes);
  var ratemaster = _ratemaster(sequelize, DataTypes);
  var retaintionfactmaster = _retaintionfactmaster(sequelize, DataTypes);
  var retentiontaxmast = _retentiontaxmast(sequelize, DataTypes);
  var taxmaster = _taxmaster(sequelize, DataTypes);
  var taxnamemaster = _taxnamemaster(sequelize, DataTypes);
  var taxpendingdetails = _taxpendingdetails(sequelize, DataTypes);
  var transmast = _transmast(sequelize, DataTypes);
  var transyearmast = _transyearmast(sequelize, DataTypes);
  var typeofusemaster = _typeofusemaster(sequelize, DataTypes);
  var typeofuseprimemaster = _typeofuseprimemaster(sequelize, DataTypes);
  var user_admin = _user_admin(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var zonemaster = _zonemaster(sequelize, DataTypes);
  var zonesectiondetails = _zonesectiondetails(sequelize, DataTypes);
  var zonesectionmaster = _zonesectionmaster(sequelize, DataTypes);

  applytaxesmaster.belongsTo(assessmentmaster, { as: "Assessment", foreignKey: "AssessmentID"});
  assessmentmaster.hasMany(applytaxesmaster, { as: "applytaxesmasters", foreignKey: "AssessmentID"});
  assessmentrulesmaster.belongsTo(assessmentmaster, { as: "Assessment", foreignKey: "AssessmentID"});
  assessmentmaster.hasMany(assessmentrulesmaster, { as: "assessmentrulesmasters", foreignKey: "AssessmentID"});
  depreciationmaster.belongsTo(assessmentmaster, { as: "Assessment", foreignKey: "AssessmentId"});
  assessmentmaster.hasMany(depreciationmaster, { as: "depreciationmasters", foreignKey: "AssessmentId"});
  maintenancemaster.belongsTo(assessmentmaster, { as: "Assessment", foreignKey: "AssessmentId"});
  assessmentmaster.hasMany(maintenancemaster, { as: "maintenancemasters", foreignKey: "AssessmentId"});
  taxmaster.belongsTo(assessmentmaster, { as: "Assessment", foreignKey: "AssessmentId"});
  assessmentmaster.hasMany(taxmaster, { as: "taxmasters", foreignKey: "AssessmentId"});
  floorsubmissiondetails.belongsTo(constructiontypemaster, { as: "Construction", foreignKey: "ConstructionId"});
  constructiontypemaster.hasMany(floorsubmissiondetails, { as: "floorsubmissiondetails", foreignKey: "ConstructionId"});
  propertydetailsnew.belongsTo(constructiontypemaster, { as: "ConstructionType_constructiontypemaster", foreignKey: "ConstructionType"});
  constructiontypemaster.hasMany(propertydetailsnew, { as: "propertydetailsnews", foreignKey: "ConstructionType"});
  ratemaster.belongsTo(constructiontypemaster, { as: "Construction", foreignKey: "ConstructionID"});
  constructiontypemaster.hasMany(ratemaster, { as: "ratemasters", foreignKey: "ConstructionID"});
  floorsubmissiondetails.belongsTo(floormaster, { as: "Floor", foreignKey: "FloorID"});
  floormaster.hasMany(floorsubmissiondetails, { as: "floorsubmissiondetails", foreignKey: "FloorID"});
  propertydetailsnew.belongsTo(floormaster, { as: "Floor", foreignKey: "FloorID"});
  floormaster.hasMany(propertydetailsnew, { as: "propertydetailsnews", foreignKey: "FloorID"});
  ratemaster.belongsTo(floormaster, { as: "Floor", foreignKey: "FloorID"});
  floormaster.hasMany(ratemaster, { as: "ratemasters", foreignKey: "FloorID"});
  floorsubmissiondetailsminusdata.belongsTo(floorsubmissiondetails, { as: "FSD", foreignKey: "FSDID"});
  floorsubmissiondetails.hasMany(floorsubmissiondetailsminusdata, { as: "floorsubmissiondetailsminusdata", foreignKey: "FSDID"});
  propertydetailsold.belongsTo(oldconstructiontypemaster, { as: "OldConstructionType_oldconstructiontypemaster", foreignKey: "OldConstructionType"});
  oldconstructiontypemaster.hasMany(propertydetailsold, { as: "propertydetailsolds", foreignKey: "OldConstructionType"});
  propertydetailsold.belongsTo(oldfloormaster, { as: "OldFloor", foreignKey: "OldFloorID"});
  oldfloormaster.hasMany(propertydetailsold, { as: "propertydetailsolds", foreignKey: "OldFloorID"});
  propertydetailsold.belongsTo(oldtypeofusemaster, { as: "OldTypeOFUse_oldtypeofusemaster", foreignKey: "OldTypeOFUse"});
  oldtypeofusemaster.hasMany(propertydetailsold, { as: "propertydetailsolds", foreignKey: "OldTypeOFUse"});
  floorsubmissiondetails.belongsTo(propertydetailsnew, { as: "PDN", foreignKey: "PDNId"});
  propertydetailsnew.hasMany(floorsubmissiondetails, { as: "floorsubmissiondetails", foreignKey: "PDNId"});
  appealmast.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(appealmast, { as: "appealmasts", foreignKey: "OwnerID"});
  applaypenaltycustomizations.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerId"});
  propertymast.hasMany(applaypenaltycustomizations, { as: "applaypenaltycustomizations", foreignKey: "OwnerId"});
  applytaxesmaster.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(applytaxesmaster, { as: "applytaxesmasters", foreignKey: "OwnerID"});
  billtransactiondetailsadvance.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(billtransactiondetailsadvance, { as: "billtransactiondetailsadvances", foreignKey: "OwnerID"});
  courtresultmast.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(courtresultmast, { as: "courtresultmasts", foreignKey: "OwnerID"});
  customtaxesmast.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(customtaxesmast, { as: "customtaxesmasts", foreignKey: "OwnerID"});
  floorsubmissiondetails.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(floorsubmissiondetails, { as: "floorsubmissiondetails", foreignKey: "OwnerID"});
  hearingmast.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(hearingmast, { as: "hearingmasts", foreignKey: "OwnerID"});
  jointownerdetails.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(jointownerdetails, { as: "jointownerdetails", foreignKey: "OwnerID"});
  mutationdetails.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerId"});
  propertymast.hasMany(mutationdetails, { as: "mutationdetails", foreignKey: "OwnerId"});
  mutationhistorydetails.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(mutationhistorydetails, { as: "mutationhistorydetails", foreignKey: "OwnerID"});
  oldtaxes.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(oldtaxes, { as: "oldtaxes", foreignKey: "OwnerID"});
  propertydetailsnew.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(propertydetailsnew, { as: "propertydetailsnews", foreignKey: "OwnerID"});
  propertydetailsold.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(propertydetailsold, { as: "propertydetailsolds", foreignKey: "OwnerID"});
  propertyimagesmast.belongsTo(propertymast, { as: "owner", foreignKey: "ownerid"});
  propertymast.hasOne(propertyimagesmast, { as: "propertyimagesmast", foreignKey: "ownerid"});
  propertysocialdetails.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerId"});
  propertymast.hasOne(propertysocialdetails, { as: "propertysocialdetail", foreignKey: "OwnerId"});
  retentiontaxmast.belongsTo(propertymast, { as: "Owner", foreignKey: "OwnerID"});
  propertymast.hasMany(retentiontaxmast, { as: "retentiontaxmasts", foreignKey: "OwnerID"});
  propertydetailsnew.belongsTo(typeofusemaster, { as: "TypeOFUse_typeofusemaster", foreignKey: "TypeOFUse"});
  typeofusemaster.hasMany(propertydetailsnew, { as: "propertydetailsnews", foreignKey: "TypeOFUse"});
  ratemaster.belongsTo(typeofuseprimemaster, { as: "TypeOfUse", foreignKey: "TypeOfUseID"});
  typeofuseprimemaster.hasMany(ratemaster, { as: "ratemasters", foreignKey: "TypeOfUseID"});

  return {
    activetaxesmaster,
    activeyearmaster,
    admin_users,
    appealmast,
    applaypenaltycustomizations,
    applycustomizepenalty,
    applypenaltytaxesmaster,
    applytaxesmaster,
    applytaxesmasterprime,
    assessmentmaster,
    assessmentrulesmaster,
    bankmaster,
    billtransactiondetails,
    billtransactiondetailsadvance,
    combinedownerrenternames,
    constructiontypemaster,
    courtresultmast,
    customtaxesmast,
    depreciationmaster,
    floormaster,
    floorsubmissiondetails,
    floorsubmissiondetailsminusdata,
    floorsubmissionroomnodetails,
    hearingmast,
    jointownerdetails,
    maintenancemaster,
    mutationdetails,
    mutationhistorydetails,
    oldconstructiontypemaster,
    oldfloormaster,
    oldpropertymast,
    oldtaxes,
    oldtypeofusemaster,
    openplotratemaster,
    policymast,
    propertydetailsnew,
    propertydetailsold,
    propertyimagesmast,
    propertymast,
    propertysocialdetails,
    propertytypemaster,
    ratechartmaster,
    ratemaster,
    retaintionfactmaster,
    retentiontaxmast,
    taxmaster,
    taxnamemaster,
    taxpendingdetails,
    transmast,
    transyearmast,
    typeofusemaster,
    typeofuseprimemaster,
    user_admin,
    users,
    zonemaster,
    zonesectiondetails,
    zonesectionmaster,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
