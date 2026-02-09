import CombinedOwnerName from '../../../models/models/combinedownerrenternames.js';
import PropertyMast from '../../../models/models/propertymast.js';
import { OldPropertyMast } from '../../../models/models/oldpropertymast.js';
import PropertyImageMast from '../../../models/models/propertyimagesmast.js';
import PropertyTypeMaster from '../../../models/models/propertytypemaster.js';
import { Op, QueryTypes, Sequelize, col, fn, literal } from 'sequelize';
import TransMast from '../../../models/models/transmast.js';
import PropertyDetailsNew from '../../../models/models/propertydetailsnew.js';
import HearingMast from '../../../models/models/hearingmast.js';
import AppealMast from '../../../models/models/appealmast.js';
import PropertySocialDetails from '../../../models/models/propertysocialdetails.js';
import sequelize from '../../../config/connectionDB.js';
import BillBookEntry from '../../../models/models/billbookentry.js';
import AssessmentMaster from '../../../models/models/assessmentmaster.js';
import BillTransactionDetails from '../../../models/models/billtransactiondetails.js';
import InvoiceNoMaster from '../../../models/models/invoicemaster.js';
import TypeofUseMaster from '../../../models/models/typeofusemaster.js';
import FloorSubmissionDetails from '../../../models/models/floorsubmissiondetails.js';
import ApplyTaxesMaster from '../../../models/models/applytaxesmaster.js';
import MutationDetails from '../../../models/models/mutationdetails.js';
import PropertyDetailsOld from '../../../models/models/propertydetailsold.js';
import { ApplyTaxMasterPrime } from '../../../models/models/applytaxesmasterprime.js';


//Missing Photo List 1
export const getMissingPhotoPlanList = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1: Fetch OwnerIDs
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: ['OwnerID'],
    });
    const ownerIds = owners.map(o => o.OwnerID);
    if (ownerIds.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 2: Fetch Combined Owner/Occupier names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OwnerName', 'MarathiOwnerName', 'OccupierName', 'MarathiOccupierName', 'RenterName', 'MarathiRenterName'],
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || o.OwnerName || "",
        occupierName: o.MarathiOccupierName || o.OccupierName || "",
        renterName: o.MarathiRenterName || o.RenterName || "",
      };
    });

    // Step 3: Fetch property data
    const properties = await PropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      include: [
        { model: PropertyImageMast, required: false },
        { model: OldPropertyMast, required: false },
      ],
    });

    // Step 4: Fetch property type descriptions
    const typeIds = [...new Set(properties.map(p => p.PropertyTypeID).filter(Boolean))];
    const types = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: typeIds } },
      attributes: ['PropertyTypeID', 'PropertyDescription'],
    });
    const typeMap = {};
    types.forEach(t => { typeMap[t.PropertyTypeID] = t.PropertyDescription; });

    // Step 5: Map response
    const result = properties.map(prop => {
      const img = prop.propertyimagesmast || {};
      const old = prop.oldpropertymast || {};
      const names = ownerNameMap[prop.OwnerID] || {};
      return {
        ownerId: prop.OwnerID,
        zone: prop.NewZoneNo || "",
        newWard: prop.NewWardNo || "",
        newProperty: prop.NewPropertyNo || "",
        newPart: prop.NewPartitionNo || "",
        oldWard: old.OldWardNo || "",
        oldProperty: old.OldPropertyNo || "",
        oldPart: old.OldPartitionNo || "",
        ownerName: names.ownerName,
        occupantName: names.occupierName,
        renterName: names.renterName,
        buildingName: prop.BuildingOrShopNameMarathi || "",
        propertyDesc: typeMap[prop.PropertyTypeID] || "",
        address: prop.Address || "",
        planPhoto: img.PlanPhoto ? "Yes" : "No",
        photoA: img.PropertyPhotoA ? "Yes" : "No",
        photoB: img.PropertyPhotoB ? "Yes" : "No",
        photoC: img.PropertyPhotoC ? "Yes" : "No",
        photoD: img.PropertyPhotoD ? "Yes" : "No",
      };
    });

    res.status(200).json({ success: true, totalRecords: result.length, data: result });

  } catch (error) {
    console.error("❌ Error fetching Missing Photo/Plan List:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Missing Plan List 2
export const getTransListByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get OwnerIDs + PropertyTypeIDs
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        'OwnerID',
        "NewZoneNo",
        'PropertyTypeID',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'Address',
        'BuildingOrShopNameMarathi',
      ],
    });

    const ownerIds = owners.map(o => o.OwnerID);
    const propertyTypeIds = owners.map(o => o.PropertyTypeID);

    if (ownerIds.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 2️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OwnerName', 'MarathiOwnerName', 'OccupierName', 'MarathiOccupierName'],
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || o.OwnerName || "",
        occupierName: o.MarathiOccupierName || o.OccupierName || "",
      };
    });

    // Step 3️⃣: Fetch Property Type Descriptions
    const propertyTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
      attributes: ['PropertyTypeID', 'PropertyDescription'],
    });

    const propertyTypeMap = {};
    propertyTypes.forEach(pt => {
      propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription || "";
    });

    // Step 4️⃣: Fetch TransMast
    const transRecords = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    // Step 5️⃣: Fetch OldPropertyMast
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      oldPropertyMap[op.OwnerID] = {
        oldWard: op.OldWardNo || "",
        oldProperty: op.OldPropertyNo || "",
        oldPart: op.OldPartitionNo || "",
                OldTotalTax: op.OldTotalTax || null,

        oldRV: op.OldRV || null,
        oldPropertyTax: op.OldPropertyTax || null,
        oldTotalTax: op.OldTotalTax || null,
      };
    });

    // Step 6️⃣: Fetch PropertyDetailsNew
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'Rent', 'CarpetAreaSqFeet', 'CarpetAreaSqMeter'],
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      const ownerId = pd.OwnerID;
      const rent = Number(pd.Rent) || 0;
      const sqft = Number(pd.CarpetAreaSqFeet) || 0;
      const sqm = Number(pd.CarpetAreaSqMeter) || 0;
    
      if (!propertyDetailsMap[ownerId]) {
        propertyDetailsMap[ownerId] = {
          rent,
          carpetAreaSqFeet: sqft,
          carpetAreaSqMeter: sqm,
        };
      } else {
        propertyDetailsMap[ownerId].rent += rent;
        propertyDetailsMap[ownerId].carpetAreaSqFeet += sqft;
        propertyDetailsMap[ownerId].carpetAreaSqMeter += sqm;
      }
    });

    // Step 7️⃣: Map Final Response
    const result = transRecords.map(tr => {
      const names = ownerNameMap[tr.OwnerID] || {};
      const oldProp = oldPropertyMap[tr.OwnerID] || {};
      const propertyInfo = owners.find(o => o.OwnerID === tr.OwnerID) || {};
      const propertyDesc = propertyTypeMap[propertyInfo.PropertyTypeID] || "";
      const propertyDetail = propertyDetailsMap[tr.OwnerID] || {}; 

      return {
        TId: tr.TId,
        ownerId: tr.OwnerID,
        ownerName: names.ownerName,
        occupierName: names.occupierName,
        financeYear: tr.FinanceYear,
        rateableValue: tr.RateableValue,
        propertyTax: tr.PropertyTax,
        educationTax: tr.EducationTax,
        employmentTax: tr.EmploymentTax,
        treeCess: tr.TreeCess,
        spEducationTax: tr.SpEducationTax,
        sanitation: tr.Sanitation,
        drainCess: tr.DrainCess,
        spWaterCess: tr.SpWaterCess,
        roadCess: tr.RoadCess,
        fireCess: tr.FireCess,
        lightCess: tr.LightCess,
        waterBenefit: tr.WaterBenefit,
        majorBuilding: tr.MajorBuilding,
        sewageDisposalCess: tr.SewageDisposalCess,
        waterBill: tr.WaterBill,
        taxTotal: tr.TaxTotal,
        maintenance: tr.Maintenance,
        interest: tr.Interest,
        remark: tr.Remark,

        newZoneNo:propertyInfo.NewZoneNo || "",
        newWardNo: propertyInfo.NewWardNo || "",
        newPropertyNo: propertyInfo.NewPropertyNo || "",
        newPart: propertyInfo.NewPartitionNo || "",
        address: propertyInfo.Address || "",
        buildingName: propertyInfo.BuildingOrShopNameMarathi || "",
        propertyDesc,

        rent: propertyDetail.rent,
        carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
        carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,

        oldWard: oldProp.oldWard,
        oldProperty: oldProp.oldProperty,
        oldPart: oldProp.oldPart,
        oldRV: oldProp.oldRV,
        oldPropertyTax: oldProp.oldPropertyTax,
        oldTotalTax: oldProp.oldTotalTax,
      };
    });

    // ✅ Response
    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error fetching TransMast List:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Missing Property Details List 6
export const getMissingOwnerList = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Input validation
    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide wardNos as a non-empty array",
      });
    }

    // ✅ Step 1: Get all OwnerIDs with OpenPlot = 0 and wardNos match
    const properties = await PropertyMast.findAll({
      where: {
        OpenPlot: 0,
        NewWardNo: { [Op.in]: wardNos },
      },
      attributes: [
        'OwnerID',
        'NewZoneNo',
        'NewWardNo',
        'NewPropertyNo',
        'OwnerName',
        'OwnerNameMarathi',
        'NewPartitionNo',
      ],
      raw: true,
    });

    if (!properties.length) {
      return res.status(404).json({
        success: false,
        message: "No records found in PropertyMast for the given wards with OpenPlot = 0",
      });
    }

    // ✅ Extract OwnerIDs from PropertyMast
    const ownerIDs = properties.map((p) => p.OwnerID);

    // ✅ Step 2: Find which OwnerIDs exist in PropertyDetailsNew
    const matchedOwners = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: ['OwnerID'],
      raw: true,
    });

    const matchedOwnerIDs = matchedOwners.map((o) => o.OwnerID);

    // ✅ Step 3: Filter out owners that are missing
    const missingOwners = properties.filter(
      (p) => !matchedOwnerIDs.includes(p.OwnerID)
    );

    // ✅ Step 4: Return full response
    return res.status(200).json({
      success: true,
      totalOwners: missingOwners.length,
      matchedOwners: matchedOwnerIDs.length,
      missingOwners: missingOwners.length,
      data: missingOwners,
    });
  } catch (error) {
    console.error("Error in getMissingOwnerList:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching missing owner list",
      error: error.message,
    });
  }
};
//Default Property List 4
export const getDefaultPropertyList = async (req, res) => {
 
    try {
      let { wardNos } = req.body;
  
      // ✅ Input validation
      if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
        return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
      }
      if (!Array.isArray(wardNos)) wardNos = [wardNos];
  
      // Step 1️⃣: Fetch PropertyMast for the ward(s)
      const properties = await PropertyMast.findAll({
        where: { NewWardNo: { [Op.in]: wardNos } },
        attributes: [
          'OwnerID', 'NewZoneNo', 'PropertyTypeID', 'NewWardNo',
          'NewPropertyNo', 'NewPartitionNo', 'Address', 'BuildingOrShopNameMarathi'
        ],
      });
  
      if (!properties.length) {
        return res.status(404).json({ success: true, totalRecords: 0, data: [] });
      }
  
      const ownerIds = properties.map(p => p.OwnerID);
      const propertyTypeIds = properties.map(p => p.PropertyTypeID);
  
      // Step 2️⃣: Fetch latest TransMast for each owner
      const transRecords = await TransMast.findAll({
        where: { OwnerID: { [Op.in]: ownerIds } },
        attributes: [
          'TId', 'OwnerID', 'FinanceYear', 'RateableValue', 'PropertyTax',
          'EducationTax', 'EmploymentTax', 'TreeCess', 'SpEducationTax', 'Sanitation',
          'DrainCess', 'SpWaterCess', 'RoadCess', 'FireCess', 'LightCess',
          'WaterBenefit', 'MajorBuilding', 'SewageDisposalCess', 'WaterBill',
          'TaxTotal', 'Maintenance', 'Interest', 'Remark'
        ],
        order: [['FinanceYear', 'DESC']] 
      });
  
      // Step 3️⃣: Map Owner Names
      const ownerNames = await CombinedOwnerName.findAll({
        where: { OwnerID: { [Op.in]: ownerIds } },
        attributes: ['OwnerID', 'MarathiOwnerName', 'MarathiRenterName']
      });
  
      const ownerNameMap = {};
      ownerNames.forEach(o => {
        ownerNameMap[o.OwnerID] = {
          ownerName: o.MarathiOwnerName || "",
          occupierName: o.MarathiRenterName || ""
        };
      });
  
      // Step 4️⃣: Property type descriptions
      const propertyTypes = await PropertyTypeMaster.findAll({
        where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
        attributes: ['PropertyTypeID', 'PropertyDescription']
      });
      const propertyTypeMap = {};
      propertyTypes.forEach(pt => {
        propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription || "";
      });
  
      // Step 5️⃣: OldPropertyMast mapping
      const oldProperties = await OldPropertyMast.findAll({
        where: { OwnerID: { [Op.in]: ownerIds } },
        attributes: ['OwnerID', 'OldWardNo', 'OldPropertyNo', 'OldPartitionNo', 'OldRV', 'OldPropertyTax', 'OldTotalTax']
      });
  
      const oldPropertyMap = {};
      oldProperties.forEach(op => {
        oldPropertyMap[op.OwnerID] = {
          oldWard: op.OldWardNo || "",
          oldProperty: op.OldPropertyNo || "",
          oldPart: op.OldPartitionNo || "",
          oldRV: op.OldRV || null,
          oldPropertyTax: op.OldPropertyTax || null,
          oldTotalTax: op.OldTotalTax || null
        };
      });
  
      // Step 6️⃣: Prepare final response
      const result = transRecords.map(tr => {
        const prop = properties.find(p => p.OwnerID === tr.OwnerID) || {};
        const names = ownerNameMap[tr.OwnerID] || {};
        const oldProp = oldPropertyMap[tr.OwnerID] || {};
        const propertyDesc = propertyTypeMap[prop.PropertyTypeID] || "";
  
        return {
          TId: tr.TId,
          ownerId: tr.OwnerID,
          ownerName: names.ownerName,
          occupierName: names.occupierName,
          financeYear: tr.FinanceYear,
          rateableValue: tr.RateableValue,
          propertyTax: tr.PropertyTax,
          educationTax: tr.EducationTax,
          employmentTax: tr.EmploymentTax,
          treeCess: tr.TreeCess,
          spEducationTax: tr.SpEducationTax,
          sanitation: tr.Sanitation,
          drainCess: tr.DrainCess,
          spWaterCess: tr.SpWaterCess,
          roadCess: tr.RoadCess,
          fireCess: tr.FireCess,
          lightCess: tr.LightCess,
          waterBenefit: tr.WaterBenefit,
          majorBuilding: tr.MajorBuilding,
          sewageDisposalCess: tr.SewageDisposalCess,
          waterBill: tr.WaterBill,
          taxTotal: tr.TaxTotal,
          maintenance: tr.Maintenance,
          interest: tr.Interest,
          remark: tr.Remark,
  
          newZoneNo: prop.NewZoneNo || "",
          newWardNo: prop.NewWardNo || "",
          newPropertyNo: prop.NewPropertyNo || "",
          newPart: prop.NewPartitionNo || "",
          address: prop.Address || "",
          buildingName: prop.BuildingOrShopNameMarathi || "",
          propertyDesc,
  
          oldWard: oldProp.oldWard,
          oldProperty: oldProp.oldProperty,
          oldPart: oldProp.oldPart,
          oldRV: oldProp.oldRV,
          oldPropertyTax: oldProp.oldPropertyTax,
          oldTotalTax: oldProp.oldTotalTax,
        };
      });
  
      return res.status(200).json({ success: true, totalRecords: result.length, data: result });
  
    } catch (error) {
      console.error("❌ Error in getTransListByWard:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
//Holder List 5
export const getHolderByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get Property Records
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        'OwnerID',
        'NewZoneNo',
        'PropertyTypeID',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'Address',
        'BuildingOrShopNameMarathi',
      ],
    });

    const ownerIds = owners.map(o => o.OwnerID);
    const propertyTypeIds = owners.map(o => o.PropertyTypeID);

    if (ownerIds.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerNames = await CombinedOwnerName.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        [Op.or]: [
          { OwnerName: { [Op.like]: '%Dharakk%' } },
          { MarathiOwnerName: { [Op.like]: '%धारक%' } },
        ],
      },
      attributes: ['OwnerID', 'OwnerName', 'MarathiOwnerName', 'OccupierName', 'MarathiOccupierName'],
    });

    // If no owner names match, return empty list early
    if (ownerNames.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const filteredOwnerIds = ownerNames.map(o => o.OwnerID);

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || o.OwnerName || "",
        occupierName: o.MarathiOccupierName || o.OccupierName || "",
      };
    });

    // Step 3️⃣: Property Type Master
    const propertyTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
      attributes: ['PropertyTypeID', 'PropertyDescription'],
    });

    const propertyTypeMap = {};
    propertyTypes.forEach(pt => {
      propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription || "";
    });

    // Step 4️⃣: TransMast
    const transRecords = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: filteredOwnerIds } },
    });

    // Step 5️⃣: OldPropertyMast
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: filteredOwnerIds } },
    });

    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      oldPropertyMap[op.OwnerID] = {
        oldWard: op.OldWardNo || "",
        oldProperty: op.OldPropertyNo || "",
        oldPart: op.OldPartitionNo || "",
        oldRV: op.OldRV || null,
        OldTotalTax: op.OldTotalTax || null,
        oldPropertyTax: op.OldPropertyTax || null,
        oldTotalTax: op.OldTotalTax || null,
      };
    });

    // Step 6️⃣: PropertyDetailsNew
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: filteredOwnerIds } },
      attributes: ['OwnerID', 'Rent', 'CarpetAreaSqFeet', 'CarpetAreaSqMeter'],
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      const ownerId = pd.OwnerID;
      const rent = Number(pd.Rent) || 0;
      const sqft = Number(pd.CarpetAreaSqFeet) || 0;
      const sqm = Number(pd.CarpetAreaSqMeter) || 0;
    
      if (!propertyDetailsMap[ownerId]) {
        propertyDetailsMap[ownerId] = {
          rent,
          carpetAreaSqFeet: sqft,
          carpetAreaSqMeter: sqm,
        };
      } else {
        propertyDetailsMap[ownerId].rent += rent;
        propertyDetailsMap[ownerId].carpetAreaSqFeet += sqft;
        propertyDetailsMap[ownerId].carpetAreaSqMeter += sqm;
      }
    });

    // Step 7️⃣: Combine All Data
    const result = transRecords.map(tr => {
      const names = ownerNameMap[tr.OwnerID] || {};
      const oldProp = oldPropertyMap[tr.OwnerID] || {};
      const propertyInfo = owners.find(o => o.OwnerID === tr.OwnerID) || {};
      const propertyDesc = propertyTypeMap[propertyInfo.PropertyTypeID] || "";
      const propertyDetail = propertyDetailsMap[tr.OwnerID] || {};

      return {
        TId: tr.TId,
        ownerId: tr.OwnerID,
        ownerName: names.ownerName,
        occupierName: names.occupierName,
        financeYear: tr.FinanceYear,
        rateableValue: tr.RateableValue,
        propertyTax: tr.PropertyTax,
        educationTax: tr.EducationTax,
        employmentTax: tr.EmploymentTax,
        treeCess: tr.TreeCess,
        spEducationTax: tr.SpEducationTax,
        sanitation: tr.Sanitation,
        drainCess: tr.DrainCess,
        spWaterCess: tr.SpWaterCess,
        roadCess: tr.RoadCess,
        fireCess: tr.FireCess,
        lightCess: tr.LightCess,
        waterBenefit: tr.WaterBenefit,
        majorBuilding: tr.MajorBuilding,
        sewageDisposalCess: tr.SewageDisposalCess,
        waterBill: tr.WaterBill,
        taxTotal: tr.TaxTotal,
        maintenance: tr.Maintenance,
        interest: tr.Interest,
        remark: tr.Remark,
        newZoneNo: propertyInfo.NewZoneNo || "",
        newWardNo: propertyInfo.NewWardNo || "",
        newPropertyNo: propertyInfo.NewPropertyNo || "",
        newPart: propertyInfo.NewPartitionNo || "",
        address: propertyInfo.Address || "",
        buildingName: propertyInfo.BuildingOrShopNameMarathi || "",
        propertyDesc,
        rent: propertyDetail.rent,
        carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
        carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,
        oldWard: oldProp.oldWard,
        oldProperty: oldProp.oldProperty,
        oldPart: oldProp.oldPart,
        oldRV: oldProp.oldRV,
        OldTotalTax: oldProp.OldTotalTax,
        oldPropertyTax: oldProp.oldPropertyTax,
        oldTotalTax: oldProp.oldTotalTax,
      };
    });

    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error fetching TransMast List:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//   Old Property Greater then Old Tax  8
export const getOldPropertyGreaterOldTaxByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Fetch Owners for given wards
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        'OwnerID',
        'NewZoneNo',
        'PropertyTypeID',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'Address',
        'BuildingOrShopNameMarathi',
      ],
    });

    if (owners.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = owners.map(o => o.OwnerID);
    const propertyTypeIds = owners.map(o => o.PropertyTypeID);

    // Step 2️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OwnerName', 'MarathiOwnerName', 'OccupierName', 'MarathiOccupierName'],
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || o.OwnerName || "",
        occupierName: o.MarathiOccupierName || o.OccupierName || "",
      };
    });

    // Step 3️⃣: Fetch Property Type Descriptions
    const propertyTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
      attributes: ['PropertyTypeID', 'PropertyDescription'],
    });

    const propertyTypeMap = {};
    propertyTypes.forEach(pt => {
      propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription || "";
    });

    // Step 4️⃣: Fetch TransMast
    const transRecords = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    // Step 5️⃣: Fetch OldPropertyMast
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      if (!oldPropertyMap[op.OwnerID]) oldPropertyMap[op.OwnerID] = [];
      oldPropertyMap[op.OwnerID].push({
        oldWard: op.OldWardNo || "",
        oldProperty: op.OldPropertyNo || "",
        oldPart: op.OldPartitionNo || "",
        oldRV: op.OldRV || null,
        oldPropertyTax: op.OldPropertyTax || null,
        oldTotalTax: op.OldTotalTax || null,
      });
    });

    // Step 6️⃣: Fetch PropertyDetailsNew
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'Rent', 'CarpetAreaSqFeet', 'CarpetAreaSqMeter'],
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      const ownerId = pd.OwnerID;
      const rent = Number(pd.Rent) || 0;
      const sqft = Number(pd.CarpetAreaSqFeet) || 0;
      const sqm = Number(pd.CarpetAreaSqMeter) || 0;

      if (!propertyDetailsMap[ownerId]) {
        propertyDetailsMap[ownerId] = { rent, carpetAreaSqFeet: sqft, carpetAreaSqMeter: sqm };
      } else {
        propertyDetailsMap[ownerId].rent += rent;
        propertyDetailsMap[ownerId].carpetAreaSqFeet += sqft;
        propertyDetailsMap[ownerId].carpetAreaSqMeter += sqm;
      }
    });

    const result = transRecords.map(tr => {
      const names = ownerNameMap[tr.OwnerID] || {};
      const propertyInfo = owners.find(o => o.OwnerID === tr.OwnerID) || {};
      const propertyDesc = propertyTypeMap[propertyInfo.PropertyTypeID] || "";
      const propertyDetail = propertyDetailsMap[tr.OwnerID] || {};

      // Filter old properties where oldPropertyTax > oldTotalTax
      const oldProps = (oldPropertyMap[tr.OwnerID] || []).filter(
        op => op.oldPropertyTax !== null && op.oldTotalTax !== null && op.oldPropertyTax > op.oldTotalTax
      );

      // Only return if there is at least one qualifying old property
      if (oldProps.length === 0) return null;

      // Pick the first qualifying old property
      const oldProp = oldProps[0];

      return {
        TId: tr.TId,
        ownerId: tr.OwnerID,
        ownerName: names.ownerName,
        occupierName: names.occupierName,
        financeYear: tr.FinanceYear,
        rateableValue: tr.RateableValue,
        propertyTax: tr.PropertyTax,
        educationTax: tr.EducationTax,
        employmentTax: tr.EmploymentTax,
        treeCess: tr.TreeCess,
        spEducationTax: tr.SpEducationTax,
        sanitation: tr.Sanitation,
        drainCess: tr.DrainCess,
        spWaterCess: tr.SpWaterCess,
        roadCess: tr.RoadCess,
        fireCess: tr.FireCess,
        lightCess: tr.LightCess,
        waterBenefit: tr.WaterBenefit,
        majorBuilding: tr.MajorBuilding,
        sewageDisposalCess: tr.SewageDisposalCess,
        waterBill: tr.WaterBill,
        taxTotal: tr.TaxTotal,
        maintenance: tr.Maintenance,
        interest: tr.Interest,
        remark: tr.Remark,

        newZoneNo: propertyInfo.NewZoneNo || "",
        newWardNo: propertyInfo.NewWardNo || "",
        newPropertyNo: propertyInfo.NewPropertyNo || "",
        newPart: propertyInfo.NewPartitionNo || "",
        address: propertyInfo.Address || "",
        buildingName: propertyInfo.BuildingOrShopNameMarathi || "",
        propertyDesc,

        rent: propertyDetail.rent,
        carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
        carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,

        oldWard: oldProp.oldWard,
        oldProperty: oldProp.oldProperty,
        oldPart: oldProp.oldPart,
        oldRV: oldProp.oldRV,
        oldPropertyTax: oldProp.oldPropertyTax,
        oldTotalTax: oldProp.oldTotalTax,
      };
    }).filter(item => item !== null); 

    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error fetching Old Tax Greater Old RV List:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Old Tax Greater Then Old Rv 7
export const getOldTaxGreaterOldRvByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Fetch Owners for given wards
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        'OwnerID',
        'NewZoneNo',
        'PropertyTypeID',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'Address',
        'BuildingOrShopNameMarathi',
      ],
    });

    if (owners.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = owners.map(o => o.OwnerID);
    const propertyTypeIds = owners.map(o => o.PropertyTypeID);

    // Step 2️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OwnerName', 'MarathiOwnerName', 'OccupierName', 'MarathiOccupierName'],
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || o.OwnerName || "",
        occupierName: o.MarathiOccupierName || o.OccupierName || "",
      };
    });

    // Step 3️⃣: Fetch Property Type Descriptions
    const propertyTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
      attributes: ['PropertyTypeID', 'PropertyDescription'],
    });

    const propertyTypeMap = {};
    propertyTypes.forEach(pt => {
      propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription || "";
    });

    // Step 4️⃣: Fetch TransMast
    const transRecords = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    // Step 5️⃣: Fetch OldPropertyMast
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      if (!oldPropertyMap[op.OwnerID]) oldPropertyMap[op.OwnerID] = [];
      oldPropertyMap[op.OwnerID].push({
        oldWard: op.OldWardNo || "",
        oldProperty: op.OldPropertyNo || "",
        oldPart: op.OldPartitionNo || "",
        oldRV: op.OldRV || null,
        oldPropertyTax: op.OldPropertyTax || null,
        oldTotalTax: op.OldTotalTax || null,
      });
    });

    // Step 6️⃣: Fetch PropertyDetailsNew
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'Rent', 'CarpetAreaSqFeet', 'CarpetAreaSqMeter'],
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      const ownerId = pd.OwnerID;
      const rent = Number(pd.Rent) || 0;
      const sqft = Number(pd.CarpetAreaSqFeet) || 0;
      const sqm = Number(pd.CarpetAreaSqMeter) || 0;

      if (!propertyDetailsMap[ownerId]) {
        propertyDetailsMap[ownerId] = { rent, carpetAreaSqFeet: sqft, carpetAreaSqMeter: sqm };
      } else {
        propertyDetailsMap[ownerId].rent += rent;
        propertyDetailsMap[ownerId].carpetAreaSqFeet += sqft;
        propertyDetailsMap[ownerId].carpetAreaSqMeter += sqm;
      }
    });

    const result = transRecords.map(tr => {
      const names = ownerNameMap[tr.OwnerID] || {};
      const propertyInfo = owners.find(o => o.OwnerID === tr.OwnerID) || {};
      const propertyDesc = propertyTypeMap[propertyInfo.PropertyTypeID] || "";
      const propertyDetail = propertyDetailsMap[tr.OwnerID] || {};

      // Filter old properties where oldPropertyTax > oldRV
      const oldProps = (oldPropertyMap[tr.OwnerID] || []).filter(
        op => op.oldTotalTax !== null && op.oldRV !== null && op.oldTotalTax > op.oldRV
      );

      // Only return if there is at least one qualifying old property
      if (oldProps.length === 0) return null;

      // Pick the first qualifying old property
      const oldProp = oldProps[0];

      return {
        TId: tr.TId,
        ownerId: tr.OwnerID,
        ownerName: names.ownerName,
        occupierName: names.occupierName,
        financeYear: tr.FinanceYear,
        rateableValue: tr.RateableValue,
        propertyTax: tr.PropertyTax,
        educationTax: tr.EducationTax,
        employmentTax: tr.EmploymentTax,
        treeCess: tr.TreeCess,
        spEducationTax: tr.SpEducationTax,
        sanitation: tr.Sanitation,
        drainCess: tr.DrainCess,
        spWaterCess: tr.SpWaterCess,
        roadCess: tr.RoadCess,
        fireCess: tr.FireCess,
        lightCess: tr.LightCess,
        waterBenefit: tr.WaterBenefit,
        majorBuilding: tr.MajorBuilding,
        sewageDisposalCess: tr.SewageDisposalCess,
        waterBill: tr.WaterBill,
        taxTotal: tr.TaxTotal,
        maintenance: tr.Maintenance,
        interest: tr.Interest,
        remark: tr.Remark,

        newZoneNo: propertyInfo.NewZoneNo || "",
        newWardNo: propertyInfo.NewWardNo || "",
        newPropertyNo: propertyInfo.NewPropertyNo || "",
        newPart: propertyInfo.NewPartitionNo || "",
        address: propertyInfo.Address || "",
        buildingName: propertyInfo.BuildingOrShopNameMarathi || "",
        propertyDesc,

        rent: propertyDetail.rent,
        carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
        carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,

        oldWard: oldProp.oldWard,
        oldProperty: oldProp.oldProperty,
        oldPart: oldProp.oldPart,
        oldRV: oldProp.oldRV,
        oldPropertyTax: oldProp.oldPropertyTax,
        oldTotalTax: oldProp.oldTotalTax,
      };
    }).filter(item => item !== null); 

    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error fetching Old Tax Greater Old RV List:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Zero Tax Property List 3
export const getOldTaxZeroBothByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Fetch owners by wards
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "PropertyTypeID",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "Address",
        "BuildingOrShopNameMarathi",
      ],
    });

    if (owners.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = owners.map(o => o.OwnerID);
    const propertyTypeIds = owners.map(o => o.PropertyTypeID);

    // Step 2️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "OwnerName", "MarathiOwnerName", "OccupierName", "MarathiOccupierName"],
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || o.OwnerName || "",
        occupierName: o.MarathiOccupierName || o.OccupierName || "",
      };
    });

    // Step 3️⃣: Fetch Property Type Descriptions
    const propertyTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
      attributes: ["PropertyTypeID", "PropertyDescription"],
    });

    const propertyTypeMap = {};
    propertyTypes.forEach(pt => {
      propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription || "";
    });

    // Step 4️⃣: Fetch TransMast Records
    const transRecords = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    // Step 5️⃣: Fetch OldPropertyMast Records
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      if (!oldPropertyMap[op.OwnerID]) oldPropertyMap[op.OwnerID] = [];
      oldPropertyMap[op.OwnerID].push({
        oldWard: op.OldWardNo || "",
        oldProperty: op.OldPropertyNo || "",
        oldPart: op.OldPartitionNo || "",
        oldRV: Number(op.OldRV) || 0,
        oldPropertyTax: Number(op.OldPropertyTax) || 0,
        oldTotalTax: Number(op.OldTotalTax) || 0,
      });
    });

    // Step 6️⃣: Fetch PropertyDetailsNew for area & rent
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "Rent", "CarpetAreaSqFeet", "CarpetAreaSqMeter"],
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      const ownerId = pd.OwnerID;
      const rent = Number(pd.Rent) || 0;
      const sqft = Number(pd.CarpetAreaSqFeet) || 0;
      const sqm = Number(pd.CarpetAreaSqMeter) || 0;

      if (!propertyDetailsMap[ownerId]) {
        propertyDetailsMap[ownerId] = { rent, carpetAreaSqFeet: sqft, carpetAreaSqMeter: sqm };
      } else {
        propertyDetailsMap[ownerId].rent += rent;
        propertyDetailsMap[ownerId].carpetAreaSqFeet += sqft;
        propertyDetailsMap[ownerId].carpetAreaSqMeter += sqm;
      }
    });

    // Step 7️⃣: Filter only those where BOTH old and trans taxes are zero
    const result = transRecords
      .map(tr => {
        const names = ownerNameMap[tr.OwnerID] || {};
        const propertyInfo = owners.find(o => o.OwnerID === tr.OwnerID) || {};
        const propertyDesc = propertyTypeMap[propertyInfo.PropertyTypeID] || "";
        const propertyDetail = propertyDetailsMap[tr.OwnerID] || {};

        // 🧩 Filter OldPropertyMast entries where all tax fields are 0
        const oldProps = (oldPropertyMap[tr.OwnerID] || []).filter(
          op =>
            (op.oldRV === 0 || op.oldRV === null) &&
            (op.oldPropertyTax === 0 || op.oldPropertyTax === null) &&
            (op.oldTotalTax === 0 || op.oldTotalTax === null)
        );

        // 🧩 Check if TransMast tax values are all 0
        const isTransAllZero =
          (Number(tr.RateableValue) || 0) === 0 &&
          (Number(tr.PropertyTax) || 0) === 0 &&
          (Number(tr.TaxTotal) || 0) === 0;

        // 🧩 Include only if both old and trans taxes are 0
        if (oldProps.length === 0 || !isTransAllZero) return null;

        const oldProp = oldProps[0];

        return {
          TId: tr.TId,
          ownerId: tr.OwnerID,
          ownerName: names.ownerName,
          occupierName: names.occupierName,
          financeYear: tr.FinanceYear,
          rateableValue: tr.RateableValue,
          propertyTax: tr.PropertyTax,
          taxTotal: tr.TaxTotal,

          newZoneNo: propertyInfo.NewZoneNo || "",
          newWardNo: propertyInfo.NewWardNo || "",
          newPropertyNo: propertyInfo.NewPropertyNo || "",
          newPart: propertyInfo.NewPartitionNo || "",
          address: propertyInfo.Address || "",
          buildingName: propertyInfo.BuildingOrShopNameMarathi || "",
          propertyDesc,

          rent: propertyDetail.rent,
          carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
          carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,

          oldWard: oldProp.oldWard,
          oldProperty: oldProp.oldProperty,
          oldPart: oldProp.oldPart,
          oldRV: oldProp.oldRV,
          oldPropertyTax: oldProp.oldPropertyTax,
          oldTotalTax: oldProp.oldTotalTax,
        };
      })
      .filter(item => item !== null);

    // ✅ Final Response
    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error fetching Old Tax Zero Both List:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Properties in Auto Hearing List 12
export const getHearingList = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }

    const wardArray = Array.isArray(wardNos) ? wardNos : [wardNos];

    // Step 1️⃣: Fetch hearing records ward-wise
    const hearingList = await HearingMast.findAll({
      where: {
        WardNo: { [Op.in]: wardArray }
      },
    });

    if (!hearingList.length) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = hearingList.map(h => h.OwnerID);

    // Step 2️⃣: Fetch Owner + Property details
    const propertyData = await PropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'NewWardNo', 'NewPropertyNo', 'NewPartitionNo']
    });

    const propertyMap = {};
    propertyData.forEach(p => {
      propertyMap[p.OwnerID] = {
        newWard: p.NewWardNo,
        newProperty: p.NewPropertyNo,
        newPart: p.NewPartitionNo
      };
    });

    // Step 3️⃣: Fetch Old Property details
    const oldData = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OldWardNo', 'OldPropertyNo', 'OldPartitionNo']
    });

    const oldMap = {};
    oldData.forEach(o => {
      oldMap[o.OwnerID] = {
        oldWard: o.OldWardNo,
        oldProperty: o.OldPropertyNo,
        oldPart: o.OldPartitionNo
      };
    });

    // Step 4️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OwnerName', 'MarathiOwnerName', 'RenterName', 'MarathiRenterName', 'OccupierName', 'MarathiOccupierName']
    });

    const nameMap = {};
    ownerNames.forEach(o => {
      nameMap[o.OwnerID] = {
        ownerName:  o.OwnerName || "",
        ownerNameMarathi: o.MarathiOwnerName || "",

        renterName: o.RenterName || "",              
              renterNameMarathi: o.MarathiRenterName || ""

      };
    });

    // Step 5️⃣: Combine Final Data
    const finalData = hearingList.map(h => {
      const prop = propertyMap[h.OwnerID] || {};
      const old = oldMap[h.OwnerID] || {};
      const name = nameMap[h.OwnerID] || {};

      return {
        hearingID: h.hearingmastID,
        ownerID: h.OwnerID,
        newWardNo: prop.newWard || "",
        newPropertyNo: prop.newProperty || "",
        newPart: prop.newPart || "",
        oldWard: old.oldWard || "",
        oldProperty: old.oldProperty || "",
        oldPart: old.oldPart || "",
        ownerName: name.ownerName || "",
        ownerNameMarathi: name.ownerNameMarathi || "",
        renterName: name.renterName || "",
        renterNameMarathi: name.renterNameMarathi || "",
        status: h.Reason || "Hearing",
      };
    });

    // ✅ Response
    res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData
    });

  } catch (error) {
    console.error("❌ Error fetching hearing list:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Properties in Auto Appeal Committee List 13
export const getAppealCommitteeList = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }

    const wardArray = Array.isArray(wardNos) ? wardNos : [wardNos];

    // Step 1️⃣: Fetch PropertyMast owners for selected ward(s)
    const propertyData = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardArray } },
      attributes: ['OwnerID', 'NewWardNo', 'NewPropertyNo', 'NewPartitionNo']
    });

    const ownerIds = propertyData.map(p => p.OwnerID);
    if (ownerIds.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const propertyMap = {};
    propertyData.forEach(p => {
      propertyMap[p.OwnerID] = {
        newWard: p.NewWardNo,
        newProperty: p.NewPropertyNo,
        newPart: p.NewPartitionNo
      };
    });

    // Step 2️⃣: Fetch AppealMast records only for these OwnerIDs with reason='appeal commmit'
    const appealList = await AppealMast.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        Reason:'appeal committee'
      }
    });

    // Step 3️⃣: Fetch Old Property details
    const oldData = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OldWardNo', 'OldPropertyNo', 'OldPartitionNo']
    });

    const oldMap = {};
    oldData.forEach(o => {
      oldMap[o.OwnerID] = {
        oldWard: o.OldWardNo,
        oldProperty: o.OldPropertyNo,
        oldPart: o.OldPartitionNo
      };
    });

    // Step 4️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OwnerName', 'MarathiOwnerName', 'RenterName', 'MarathiRenterName']
    });

    const nameMap = {};
    ownerNames.forEach(o => {
      nameMap[o.OwnerID] = {
        ownerName: o.OwnerName || "",
        ownerNameMarathi: o.MarathiOwnerName || "",
        renterName: o.RenterName || "",
        renterNameMarathi: o.MarathiRenterName || ""
      };
    });

    // Step 5️⃣: Combine Final Data
    const finalData = appealList.map(a => {
      const prop = propertyMap[a.OwnerID] || {};
      const old = oldMap[a.OwnerID] || {};
      const name = nameMap[a.OwnerID] || {};

      return {
        appealID: a.appealmastID,
        ownerID: a.OwnerID,
        newWardNo: prop.newWard || "",
        newPropertyNo: prop.newProperty || "",
        newPart: prop.newPart || "",
        oldWard: old.oldWard || "",
        oldProperty: old.oldProperty || "",
        oldPart: old.oldPart || "",
        ownerName: name.ownerName || "",
        ownerNameMarathi: name.ownerNameMarathi || "",
        renterName: name.renterName || "",
        renterNameMarathi: name.renterNameMarathi || "",
        status: a.Reason || "Appeal Committee"
      };
    });

    res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData
    });

  } catch (error) {
    console.error("❌ Error fetching appeal committee list by ward:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Property With Current Appeal Status List 11
export const getAppealCurrentListByReason = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }

    // 1️⃣ Get all OwnerIDs for the selected wards
    const owners = await PropertyMast.findAll({
      attributes: ['OwnerID'],
      where: { NewWardNo: wardNos }
    });

    if (!owners || owners.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = owners.map(o => o.OwnerID);

    // 2️⃣ Fetch Property + Appeal + CombinedOwnerName
    const propertyData = await PropertyMast.findAll({
      include: [
        { model: CombinedOwnerName, required: true },
        { model: AppealMast, required: false },
        { model: OldPropertyMast, required: true }

      ],
      where: { OwnerID: ownerIds }
    });
    // const oldData = await OldPropertyMast.findAll({
    //   where: { OwnerID: ownerIds },
    //   attributes: ['OwnerID', 'OldWardNo', 'OldPropertyNo', 'OldPartitionNo']
    // });
    // const oldMap = {};
    // oldData.forEach(o => {
    //   oldMap[o.OwnerID] = {
    //     oldWard: o.OldWardNo,
    //     oldProperty: o.OldPropertyNo,
    //     oldPart: o.OldPartitionNo
    //   };
    // });
    // 3️⃣ Call SP in parallel with limited concurrency
    const concurrencyLimit = 10; 
    const netRV = [];
    
    const runBatch = async (batch) => {
      return Promise.all(
        batch.map(async (OwnerId) => {
          const connection = await sequelize.connectionManager.getConnection();
          try {
            const [result] = await sequelize.query(
              "CALL prcOverAllNetTaxes(:OwnerId)",
              { replacements: { OwnerId }, connection }
            );

            const hasNetData = result && Object.keys(result).length > 0 && result.NetTotal !== undefined;

            return {
              OwnerId,
              netRV: result || {},
              Status: hasNetData ? "Net" : "",
        //          oldWard: oldProp.oldWard || "",
        // oldProperty: oldProp.oldProperty || "",
        // oldPart: oldProp.oldPart || "",
            };
          } catch (spError) {
            console.error(`Error calling SP for OwnerId ${OwnerId}:`, spError);
            return { OwnerId, netRV: {}, Status: "" };
          } finally {
            await sequelize.connectionManager.releaseConnection(connection);
          }
        })
      );
    };

    // Process in batches to avoid too many connections
    for (let i = 0; i < ownerIds.length; i += concurrencyLimit) {
      const batch = ownerIds.slice(i, i + concurrencyLimit);
      const batchResult = await runBatch(batch);
      netRV.push(...batchResult);
    }

    const responseData = propertyData.map((pd) => {
      const ownerNetRV = netRV.find((n) => n.OwnerId === pd.OwnerID);
    
      const netRVWithReason = ownerNetRV && ownerNetRV.netRV
        ? { ...ownerNetRV.netRV, Reason: "Net" } 
        : { // SP returned nothing, default to 0
            OwnerID: pd.OwnerID,
            PropertyTax: 0,
            EducationTax: 0,
            SpEducationTax: 0,
            EmploymentTax: 0,
            TreeCess: 0,
            FireCess: 0,
            LightCess: 0,
            DrainCess: 0,
            RoadCess: 0,
            Sanitation: 0,
            SpWaterCess: 0,
            WaterBenefitTax: 0,
            WaterBill: 0,
            MajorBuildingTax: 0,
            SewageDispCess: 0,
            Tax1: 0,
            Total: 0,
            Reason: "Net"
          };
    
          return {
            ...pd.toJSON(),
            netRV: netRVWithReason,
            Status: ownerNetRV?.Status || "",
            Reason: ownerNetRV ? "Net" : (pd.appealmasts?.[0]?.Reason || "")
          };
    });
    

    // ✅ Return response
    res.status(200).json({
      success: true,
      totalRecords: responseData.length,
      data: responseData
    });

  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while getting property/appeal data."
    });
  }
};
//Construction List 10
export const getConstructionListByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get OwnerIDs + PropertyTypeIDs
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        'OwnerID',
        'PropertyTypeID',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'Address',
        'BuildingOrShopNameMarathi',
      ],
    });

    const ownerIds = owners.map(o => o.OwnerID);
    const propertyTypeIds = owners.map(o => o.PropertyTypeID);

    if (ownerIds.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 2️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OwnerName', 'MarathiOwnerName', 'OccupierName', 'MarathiOccupierName'],
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName:  o.OwnerName || "",
        occupierName:  o.OccupierName || "",
      MarathiOwnerName: o.MarathiOwnerName || "",
      RenterName: o.RenterName || "",
      MarathiOccupierName: o.MarathiOccupierName || "",
      OccupierName: o.OccupierName || "",

      };
    });

    // Step 3️⃣: Fetch Property Type Descriptions
    const propertyTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
      attributes: ['PropertyTypeID', 'PropertyDescription'],
    });

    const propertyTypeMap = {};
    propertyTypes.forEach(pt => {
      propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription || "";
    });

    // Step 4️⃣: Fetch TransMast
    const transRecords = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    // Step 5️⃣: Fetch OldPropertyMast
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      oldPropertyMap[op.OwnerID] = {
        oldWard: op.OldWardNo || "",
        oldProperty: op.OldPropertyNo || "",
        oldPart: op.OldPartitionNo || "",
        oldRV: op.OldRV || null,
        oldPropertyTax: op.OldPropertyTax || null,
        oldTotalTax: op.OldTotalTax || null,
      };
    });

    // Step 6️⃣: Fetch PropertyDetailsNew
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'Rent', 'CarpetAreaSqFeet', 'CarpetAreaSqMeter','ConstructionType'],
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      propertyDetailsMap[pd.OwnerID] = {
        rent: pd.Rent || 0,
        carpetAreaSqFeet: pd.CarpetAreaSqFeet || 0,
        carpetAreaSqMeter: pd.CarpetAreaSqMeter || 0,
        constructionType: pd.ConstructionType || "",
      };
    });

    // Step 7️⃣: Map Final Response
    const result = transRecords.map(tr => {
      const names = ownerNameMap[tr.OwnerID] || {};
      const oldProp = oldPropertyMap[tr.OwnerID] || {};
      const propertyInfo = owners.find(o => o.OwnerID === tr.OwnerID) || {};
      const propertyDesc = propertyTypeMap[propertyInfo.PropertyTypeID] || "";
      const propertyDetail = propertyDetailsMap[tr.OwnerID] || {}; 

      return {
        TId: tr.TId,
        ownerId: tr.OwnerID,
        ownerName: names.ownerName,
        occupierName: names.occupierName,
        marathiOwnerName: names.marathiOwnerName,
        renterName: names.renterName,
        marathiOccupierName: names.marathiOccupierName,
        
        financeYear: tr.FinanceYear,
        rateableValue: tr.RateableValue,
        propertyTax: tr.PropertyTax,
        educationTax: tr.EducationTax,
        employmentTax: tr.EmploymentTax,
        treeCess: tr.TreeCess,
        spEducationTax: tr.SpEducationTax,
        sanitation: tr.Sanitation,
        drainCess: tr.DrainCess,
        spWaterCess: tr.SpWaterCess,
        roadCess: tr.RoadCess,
        fireCess: tr.FireCess,
        lightCess: tr.LightCess,
        waterBenefit: tr.WaterBenefit,
        majorBuilding: tr.MajorBuilding,
        sewageDisposalCess: tr.SewageDisposalCess,
        waterBill: tr.WaterBill,
        taxTotal: tr.TaxTotal,
        maintenance: tr.Maintenance,
        interest: tr.Interest,
        remark: tr.Remark,

        newWardNo: propertyInfo.NewWardNo || "",
        newPropertyNo: propertyInfo.NewPropertyNo || "",
        newPart: propertyInfo.NewPartitionNo || "",
        address: propertyInfo.Address || "",
        buildingName: propertyInfo.BuildingOrShopNameMarathi || "",
        propertyDesc,

        rent: propertyDetail.rent,
        carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
        carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,
        constructionType: propertyDetail.constructionType,
        oldWard: oldProp.oldWard,
        oldProperty: oldProp.oldProperty,
        oldPart: oldProp.oldPart,
        oldRV: oldProp.oldRV,
        oldPropertyTax: oldProp.oldPropertyTax,
        oldTotalTax: oldProp.oldTotalTax,
      };
    });

    // ✅ Response
    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error fetching TransMast List:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Properties having zero carpet area 15
export const getWardWiseZeroCarpetOwners = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Fetch owners by wards
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "PropertyTypeID",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "Address",
        "BuildingOrShopNameMarathi",
      ],
    });

    if (owners.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = owners.map(o => o.OwnerID);
    const propertyTypeIds = owners.map(o => o.PropertyTypeID);

    // Step 2️⃣: Fetch Owner + Renter Names (English & Marathi)
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: [
        "OwnerID",
        "OwnerName",
        "MarathiOwnerName",
        "OccupierName",
        "MarathiOccupierName",
        "RenterName",
        "MarathiRenterName"
      ],
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.OwnerName || "",
        ownerNameMarathi: o.MarathiOwnerName || "",
        occupierName: o.OccupierName || "",
        occupierNameMarathi: o.MarathiOccupierName || "",
        renterName: o.RenterName || "",
        renterNameMarathi: o.MarathiRenterName || "",
      };
    });

    // Step 3️⃣: Fetch Property Type Descriptions
    const propertyTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
      attributes: ["PropertyTypeID", "PropertyDescription"],
    });

    const propertyTypeMap = {};
    propertyTypes.forEach(pt => {
      propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription || "";
    });

    // Step 4️⃣: Fetch OldPropertyMast Records
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      if (!oldPropertyMap[op.OwnerID]) oldPropertyMap[op.OwnerID] = [];
      oldPropertyMap[op.OwnerID].push({
        oldWard: op.OldWardNo || "",
        oldProperty: op.OldPropertyNo || "",
        oldPart: op.OldPartitionNo || "",
        oldRV: Number(op.OldRV) || 0,
        oldPropertyTax: Number(op.OldPropertyTax) || 0,
        oldTotalTax: Number(op.OldTotalTax) || 0,
      });
    });

    // Step 5️⃣: Fetch PropertyDetailsNew for area & rent
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds }, CarpetAreaSqFeet: 0 },
      attributes: ["OwnerID", "Rent", "CarpetAreaSqFeet", "CarpetAreaSqMeter"],
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      const ownerId = pd.OwnerID;
      const rent = Number(pd.Rent) || 0;
      const sqft = Number(pd.CarpetAreaSqFeet) || 0;
      const sqm = Number(pd.CarpetAreaSqMeter) || 0;

      if (!propertyDetailsMap[ownerId]) {
        propertyDetailsMap[ownerId] = { rent, carpetAreaSqFeet: sqft, carpetAreaSqMeter: sqm };
      } else {
        propertyDetailsMap[ownerId].rent += rent;
        propertyDetailsMap[ownerId].carpetAreaSqFeet += sqft;
        propertyDetailsMap[ownerId].carpetAreaSqMeter += sqm;
      }
    });

    // Step 6️⃣: Combine owners with zero carpet area details
    const result = owners
      .filter(o => propertyDetailsMap[o.OwnerID]) 
      .map(o => {
        const names = ownerNameMap[o.OwnerID] || {};
        const propertyDesc = propertyTypeMap[o.PropertyTypeID] || "";
        const propertyDetail = propertyDetailsMap[o.OwnerID] || {};
        const oldProps = oldPropertyMap[o.OwnerID] || [];

        return {
          ownerId: o.OwnerID,

          // Owner + Renter Names
          ownerName: names.ownerName,
          ownerNameMarathi: names.ownerNameMarathi,
          occupierName: names.occupierName,
          occupierNameMarathi: names.occupierNameMarathi,
          renterName: names.renterName,
          renterNameMarathi: names.renterNameMarathi,

          newZoneNo: o.NewZoneNo || "",
          newWardNo: o.NewWardNo || "",
          newPropertyNo: o.NewPropertyNo || "",
          newPart: o.NewPartitionNo || "",
          address: o.Address || "",
          buildingName: o.BuildingOrShopNameMarathi || "",
          propertyDesc,

          rent: propertyDetail.rent,
          carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
          carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,

          oldProperties: oldProps
        };
      });

    // ✅ Final Response
    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error fetching Ward Wise Zero Carpet Owners:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Toilet Count 18
export const getWardWiseOwnerSocialDetails = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Fetch owners by wards
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: ["OwnerID", "NewZoneNo", "NewWardNo", "NewPropertyNo", "NewPartitionNo", "Address"]
    });

    if (owners.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = owners.map(o => o.OwnerID);

    // Step 2️⃣: Fetch Owner + Occupier + Renter Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: [
        "OwnerID",
        "OwnerName",
        "MarathiOwnerName",
        "OccupierName",
        "MarathiOccupierName",
        "RenterName",
        "MarathiRenterName"
      ]
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.OwnerName || "",
        ownerNameMarathi: o.MarathiOwnerName || "",
        occupierName: o.OccupierName || "",
        occupierNameMarathi: o.MarathiOccupierName || "",
        renterName: o.RenterName || "",
        renterNameMarathi: o.MarathiRenterName || "",
      };
    });

    // Step 3️⃣: Fetch Social Details
    const socialDetails = await PropertySocialDetails.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "ToiletSeatCountResidential", "ToiletSeatCountNonResidential"]
    });

    const socialMap = {};
    socialDetails.forEach(sd => {
      socialMap[sd.OwnerID] = {
        toiletResidential: sd.ToiletSeatCountResidential || 0,
        toiletNonResidential: sd.ToiletSeatCountNonResidential || 0
      };
    });

    // Step 4️⃣: Final Response
    const result = owners.map(o => {
      const names = ownerNameMap[o.OwnerID] || {};
      const social = socialMap[o.OwnerID] || {};

      return {
        ownerId: o.OwnerID,
        newZoneNo: o.NewZoneNo,
        newWardNo: o.NewWardNo,
        newPropertyNo: o.NewPropertyNo,
        newPart: o.NewPartitionNo,
        address: o.Address,

        ownerName: names.ownerName,
        ownerNameMarathi: names.ownerNameMarathi,

        occupierName: names.occupierName,
        occupierNameMarathi: names.occupierNameMarathi,

        renterName: names.renterName,
        renterNameMarathi: names.renterNameMarathi,

        toiletSeatResidential: social.toiletResidential,
        toiletSeatNonResidential: social.toiletNonResidential
      };
    });

    return res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Properties without rent 19
export const getWardWiseZeroRentOccupierList = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // 🧾 Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get OwnerIDs for given wards
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: ["OwnerID", "NewWardNo", "NewPropertyNo"]
    });

    if (owners.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = owners.map(o => o.OwnerID);

    // Step 2️⃣: Get only Rent = 0 and OccupierYesNo = 1
    const details = await PropertyDetailsNew.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        Rent: 0,
        OccupierYesNo: 1
      },
      attributes: ["OwnerID", "Rent", "OccupierYesNo"]
    });

    if (details.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const rentOwnerIds = details.map(d => d.OwnerID);

    // Step 3️⃣: Get owner and occupier names
    const names = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: rentOwnerIds } },
      attributes: [
        "OwnerID",
        "OwnerName",
        "OccupierName",
        "MarathiOwnerName",
        "MarathiOccupierName"
      ]
    });

    const nameMap = {};
    names.forEach(n => {
      nameMap[n.OwnerID] = {
        OwnerName: n.OwnerName || "",
        OwnerNameMarathi: n.MarathiOwnerName || "",
        OccupierName: n.OccupierName || "",
        OccupierNameMarathi: n.MarathiOccupierName || ""
      };
    });

    // Step 4️⃣: Combine data
    const result = details.map(d => {
      const wardInfo = owners.find(o => o.OwnerID === d.OwnerID) || {};
      const nameInfo = nameMap[d.OwnerID] || {};

      return {
        OwnerID: d.OwnerID,
        NewWardNo: wardInfo.NewWardNo,
        NewPropertyNo: wardInfo.NewPropertyNo,
        Rent: d.Rent,
        OccupierYesNo: "Yes",
        OwnerName: nameInfo.OwnerName,
        OwnerNameMarathi: nameInfo.OwnerNameMarathi,
        OccupierName: nameInfo.OccupierName,
        OccupierNameMarathi: nameInfo.OccupierNameMarathi
      };
    });

    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result
    });

  } catch (error) {
    console.error("❌ Error fetching ward-wise zero rent occupier list:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Apply Properties without old Property tax and old total tax 
export const getOldTaxZeroByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // 🧾 Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get OwnerIDs from PropertyMast for given wards
    const propertyRecords = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: ["OwnerID", "NewWardNo", "NewPropertyNo", "NewPartitionNo"]
    });

    if (propertyRecords.length === 0) {
      return res.status(404).json({
        success: true,
        totalRecords: 0,
        data: []
      });
    }

    const ownerIds = propertyRecords.map((p) => p.OwnerID);

    // Step 2️⃣: Get OldPropertyMast records where tax fields are zero
    const oldProperties = await OldPropertyMast.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        OldPropertyTax: 0,
        OldTotalTax: 0
      },
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ]
    });

    if (oldProperties.length === 0) {
      return res.status(404).json({
        success: true,
        totalRecords: 0,
        data: []
      });
    }

    const filteredOwnerIds = oldProperties.map((o) => o.OwnerID);

    // Step 3️⃣: Get CombinedOwnerName details for filtered OwnerIDs
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: filteredOwnerIds } },
      attributes: [
        "OwnerID",
        "OwnerName",
        "MarathiOwnerName",
        "RenterName",
        "MarathiRenterName"
      ]
    });

    const ownerNameMap = {};
    ownerNames.forEach((o) => {
      ownerNameMap[o.OwnerID] = {
        OwnerName: o.OwnerName || "",
        MarathiOwnerName: o.MarathiOwnerName || "",
        RenterName: o.RenterName || "",
        MarathiRenterName: o.MarathiRenterName || ""
      };
    });

    // Step 4️⃣: Combine all data
    const result = oldProperties.map((op) => {
      const propertyInfo = propertyRecords.find((p) => p.OwnerID === op.OwnerID) || {};
      const nameInfo = ownerNameMap[op.OwnerID] || {};

      return {
        OwnerID: op.OwnerID,
        OwnerName: nameInfo.OwnerName,
        MarathiOwnerName: nameInfo.MarathiOwnerName,
        RenterName: nameInfo.RenterName,
        MarathiRenterName: nameInfo.MarathiRenterName,

        NewWardNo: propertyInfo.NewWardNo || "",
        NewPropertyNo: propertyInfo.NewPropertyNo || "",
        NewPartitionNo: propertyInfo.NewPartitionNo || "",

        OldWardNo: op.OldWardNo || "",
        OldPropertyNo: op.OldPropertyNo || "",
        OldPartitionNo: op.OldPartitionNo || "",
        OldRV: Number(op.OldRV) || 0,
        OldPropertyTax: Number(op.OldPropertyTax) || 0,
        OldTotalTax: Number(op.OldTotalTax) || 0
      };
    });

    // ✅ Final Response
    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result
    });

  } catch (error) {
    console.error("❌ Error fetching old tax zero by ward:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//Duplicate Property List 23
export const getDuplicatePropertyByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No"
      });
    }

    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Fetch all records for given wards
    const records = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
       
      ]
    });

    if (records.length === 0) {
      return res.status(404).json({
        success: true,
        totalRecords: 0,
        data: []
      });
    }

    // Step 2️⃣: Detect duplicates based on Ward + Property + Partition
    const keyMap = new Map();
    const duplicates = [];

    for (const rec of records) {
      const key = `${rec.NewWardNo}-${rec.NewPropertyNo}-${rec.NewPartitionNo}`;
      if (keyMap.has(key)) {
        // Add both current and previous if not already added
        const prev = keyMap.get(key);
        if (!duplicates.some(d => d.OwnerID === prev.OwnerID)) {
          duplicates.push(prev);
        }
        duplicates.push(rec);
      } else {
        keyMap.set(key, rec);
      }
    }

    // Step 3️⃣: Format response
    const result = duplicates.map(d => ({
      OwnerID: d.OwnerID,
      NewZoneNo: d.NewZoneNo,
      NewWardNo: d.NewWardNo,
      NewPropertyNo: d.NewPropertyNo,
      NewPartitionNo: d.NewPartitionNo,
       }));

    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result
    });

  } catch (error) {
    console.error("❌ Error fetching duplicate properties by ward:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//Old RV has value but Net tax is Zero
export const getOldRVHasValueButNetTaxZero = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No"
      });
    }

    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Fetch owners by ward
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "Address",
        "BuildingOrShopNameMarathi"
      ]
    });

    if (owners.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = owners.map(o => o.OwnerID);

    // Step 2️⃣: Fetch Old Property details
    const oldProperties = await OldPropertyMast.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        OldRV: { [Op.gt]: 0 } 
      },
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ]
    });

    if (oldProperties.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const oldOwnerIds = [...new Set(oldProperties.map(o => o.OwnerID))];

    // Step 3️⃣: Fetch TransMast for those owners where tax is all 0
    const transRecords = await TransMast.findAll({
      where: {
        OwnerID: { [Op.in]: oldOwnerIds },
        [Op.and]: [
          { RateableValue: { [Op.eq]: 0 } },
          { PropertyTax: { [Op.eq]: 0 } },
          { TaxTotal: { [Op.eq]: 0 } }
        ]
      },
      attributes: ["OwnerID", "FinanceYear", "RateableValue", "PropertyTax", "TaxTotal"]
    });

    if (transRecords.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const transOwnerIds = [...new Set(transRecords.map(t => t.OwnerID))];

    // Step 4️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: transOwnerIds } },
      attributes: ["OwnerID", "OwnerName", "MarathiOwnerName", "OccupierName", "MarathiOccupierName"]
    });

    const nameMap = {};
    ownerNames.forEach(o => {
      nameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || o.OwnerName || "",
        occupierName: o.MarathiOccupierName || o.OccupierName || ""
      };
    });

    // Step 5️⃣: Combine all filtered results
    const result = transRecords.map(tr => {
      const propertyInfo = owners.find(o => o.OwnerID === tr.OwnerID) || {};
      const oldInfo = oldProperties.find(o => o.OwnerID === tr.OwnerID) || {};
      const names = nameMap[tr.OwnerID] || {};

      return {
        ownerId: tr.OwnerID,
        ownerName: names.ownerName,
        occupierName: names.occupierName,
        newZoneNo: propertyInfo.NewZoneNo,
        newWardNo: propertyInfo.NewWardNo,
        newPropertyNo: propertyInfo.NewPropertyNo,
        newPartitionNo: propertyInfo.NewPartitionNo,
        address: propertyInfo.Address,
        buildingName: propertyInfo.BuildingOrShopNameMarathi,
        oldWardNo: oldInfo.OldWardNo,
        oldPropertyNo: oldInfo.OldPropertyNo,
        oldPartitionNo: oldInfo.OldPartitionNo,
        oldRV: oldInfo.OldRV,
        oldPropertyTax: oldInfo.OldPropertyTax,
        oldTotalTax: oldInfo.OldTotalTax,
        rateableValue: tr.RateableValue,
        propertyTax: tr.PropertyTax,
        taxTotal: tr.TaxTotal,
        financeYear: tr.FinanceYear
      };
    });

    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result
    });

  } catch (error) {
    console.error("❌ Error fetching Old RV > 0 but Net Tax = 0 list:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//Properties without renter 26
export const getPropertiesWithoutRenter = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Step 0: Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No",
      });
    }

    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get OwnerIDs for selected wards
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "Address",
        "BuildingOrShopNameMarathi",
      ],
    });

    if (owners.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = owners.map((o) => o.OwnerID);

    // Step 2️⃣: Get property details for those owners where Renter is missing
    const propertiesWithoutRenter = await PropertyDetailsNew.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        [Op.and]: [
          { [Op.or]: [{ RenterName: { [Op.is]: null } }, { RenterName: { [Op.eq]: "" } }] },
          { [Op.or]: [{ RenterNameMarathi: { [Op.is]: null } }, { RenterNameMarathi: { [Op.eq]: "" } }] },
        ],
      },
      attributes: [
        "OwnerID",
        "Rent",
        "RenterNameMarathi",
        "RenterName",
        "OccupierNameMarathi",
        "OccupierName",
        "OccupierYesNo",
      ],
    });

    if (propertiesWithoutRenter.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const noRenterOwnerIds = [
      ...new Set(propertiesWithoutRenter.map((p) => p.OwnerID)),
    ];

    // Step 3️⃣: Get owner names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: noRenterOwnerIds } },
      attributes: [
        "OwnerID",
        "OwnerName",
        "MarathiOwnerName",
        "OccupierName",
        "MarathiOccupierName",
      ],
    });

    const nameMap = {};
    ownerNames.forEach((o) => {
      nameMap[o.OwnerID] = {
        ownerName: o.OwnerName || "",
        occupierName:  o.OccupierName || "",
        ownerNameMarathi: o.MarathiOwnerName || "",
        occupierNameMarathi: o.MarathiOccupierName ||  "",
      };
    });

    // Step 4️⃣: Combine everything
    const result = propertiesWithoutRenter.map((prop) => {
      const propertyInfo = owners.find((o) => o.OwnerID === prop.OwnerID) || {};
      const names = nameMap[prop.OwnerID] || {};

      return {
        OwnerID: prop.OwnerID,
        OwnerName: names.ownerName,
        ownerNameMarathi: names.ownerNameMarathi,
        
        OccupierName: names.occupierName,
        NewZoneNo: propertyInfo.NewZoneNo,
        NewWardNo: propertyInfo.NewWardNo,
        NewPropertyNo: propertyInfo.NewPropertyNo,
        NewPartitionNo: propertyInfo.NewPartitionNo,
        Address: propertyInfo.Address,
        BuildingName: propertyInfo.BuildingOrShopNameMarathi,
        Rent: prop.Rent,
        RenterName: prop.RenterName || "",
        RenterNameMarathi: prop.RenterNameMarathi || "",
        OccupierYesNo: prop.OccupierYesNo === true ? "Yes" : "No",
      };
    });

    // ✅ Final response
    return res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error fetching properties without renter:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//34 apply
export const getOpenPlotWithoutDetails = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Provide at least one Ward No" });
    }

    if (!Array.isArray(wardNos)) wardNos = [wardNos];
    const wardListStr = wardNos.join(",");

    // SP call
    const result = await sequelize.query(
      "CALL GetOpenPlotsWithoutDetails(?)",
      {
        replacements: [wardListStr],
        type: sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    // Sometimes SP returns array inside array
    const data = Array.isArray(result[0]) ? result[0] : result;

    res.status(200).json({
      success: true,
      totalRecords: data.length,
      data
    });

  } catch (error) {
    console.error("❌ Error fetching Open Plot Without Details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


//Combine Property List 17
export const getCombinedPropertiesByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Fetch properties with CombPropRemark='yes'
    const properties = await PropertyMast.findAll({
      where: {
        CombPropRemark: 'yes',
        NewWardNo: { [Op.in]: wardNos }
      },
      attributes: [
        'OwnerID',
        'NewZoneNo',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'OwnerName',
        'OccupierName',
        'PropertyRemark',
        'PropertyRemarkTwo',
        'WadhGhatRemarkOne',
        'WadhGhatRemarkTwo',
        'WadhGhatRemarkThree',
        'CombPropRemark',
        'BuildingOrShopName',
        'BuildingOrShopNameMarathi',
      ],
      order: [
        ['NewWardNo', 'ASC'],
        ['NewPropertyNo', 'ASC'],
        ['NewPartitionNo', 'ASC'],
      ],
    });

    if (!properties || properties.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = properties.map(p => p.OwnerID);

    // Step 2️⃣: Fetch combined owner/renter names
    const combinedNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: [
        'OwnerID',
        'OwnerName',
        'MarathiOwnerName',
        'RenterName',
        'MarathiRenterName',
        'OccupierName',
        'MarathiOccupierName',
      ],
    });

    // Map combined names by OwnerID
    const combinedMap = {};
    combinedNames.forEach(c => {
      if (!combinedMap[c.OwnerID]) {
        combinedMap[c.OwnerID] = {
          ownerName: c.OwnerName || "",
          marathiOwnerName: c.MarathiOwnerName || "",
          renterName: c.RenterName || "",
          marathiRenterName: c.MarathiRenterName || "",
          occupierName: c.OccupierName || "",
          marathiOccupierName: c.MarathiOccupierName || "",
        };
      } else {
        combinedMap[c.OwnerID].renterName += c.RenterName ? `, ${c.RenterName}` : "";
        combinedMap[c.OwnerID].marathiRenterName += c.MarathiRenterName ? `, ${c.MarathiRenterName}` : "";
        combinedMap[c.OwnerID].occupierName += c.OccupierName ? `, ${c.OccupierName}` : "";
        combinedMap[c.OwnerID].marathiOccupierName += c.MarathiOccupierName ? `, ${c.MarathiOccupierName}` : "";
      }
    });

    // Step 3️⃣: Map final response
    const result = properties.map(p => {
      const names = combinedMap[p.OwnerID] || {};

      return {
        OwnerID: p.OwnerID,
        NewZoneNo: p.NewZoneNo,
        NewWardNo: p.NewWardNo,
        NewPropertyNo: p.NewPropertyNo,
        NewPartitionNo: p.NewPartitionNo,
        OwnerName: names.ownerName || p.OwnerName || "",
        MarathiOwnerName: names.marathiOwnerName || "",
        RenterName: names.renterName || "",
        MarathiRenterName: names.marathiRenterName || "",
        OccupierName: names.occupierName || p.OccupierName || "",
        MarathiOccupierName: names.marathiOccupierName || "",
        PropertyRemark: p.PropertyRemark || "",
        PropertyRemarkTwo: p.PropertyRemarkTwo || "",
        WadhGhatRemarkOne: p.WadhGhatRemarkOne || "",
        WadhGhatRemarkTwo: p.WadhGhatRemarkTwo || "",
        WadhGhatRemarkThree: p.WadhGhatRemarkThree || "",
        CombPropRemark: p.CombPropRemark || "",
        BuildingOrSocietyName: p.BuildingOrShopName || "",
        BuildingOrSocietyNameMarathi: p.BuildingOrShopNameMarathi || "",
      };
    });

    // ✅ Send response
    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error fetching combined property list:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Missing Address, Address in Marathi and Mobile No 21
export const getAddressMobileByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1: Fetch Properties in Ward
    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "PropertyTypeID",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "Address",
        "MobileNo"
      ],
    });

    const ownerIds = properties.map(p => p.OwnerID);
    if (ownerIds.length === 0) return res.status(404).json({ success: true, totalRecords: 0, data: [] });

    // Step 2: Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName", "OccupierName", "MarathiOccupierName"]
    });
    const ownerMap = {};
    ownerNames.forEach(o => {
      ownerMap[o.OwnerID] = {
        OwnerName: o.MarathiOwnerName || "",
        RenterName: o.MarathiRenterName || "",
        OccupierName: o.OccupierName || "",
        MarathiOccupierName: o.MarathiOccupierName || ""
      };
    });

    // Step 3: Old Property info
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo", "OldRV", "OldPropertyTax", "OldTotalTax"]
    });
    const oldMap = {};
    oldProperties.forEach(op => {
      oldMap[op.OwnerID] = {
        OldWardNo: op.OldWardNo || "",
        OldPropertyNo: op.OldPropertyNo || "",
        OldPartitionNo: op.OldPartitionNo || "",
        OldRV: op.OldRV || null,
        OldPropertyTax: op.OldPropertyTax || null,
        OldTotalTax: op.OldTotalTax || null,
      };
    });

    // Step 4: Property Type Descriptions
    const typeIds = [...new Set(properties.map(p => p.PropertyTypeID).filter(Boolean))];
    const types = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: typeIds } },
      attributes: ["PropertyTypeID", "PropertyDescription"]
    });
    const typeMap = {};
    types.forEach(t => typeMap[t.PropertyTypeID] = t.PropertyDescription);

    // Step 5: TransMast
    const transRecords = await TransMast.findAll({ where: { OwnerID: { [Op.in]: ownerIds } } });

    // Step 6: PropertyDetailsNew for Carpet/Rent
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "Rent", "CarpetAreaSqFeet", "CarpetAreaSqMeter"]
    });
    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      if (!propertyDetailsMap[pd.OwnerID]) propertyDetailsMap[pd.OwnerID] = { rent: 0, carpetAreaSqFeet: 0, carpetAreaSqMeter: 0 };
      propertyDetailsMap[pd.OwnerID].rent += Number(pd.Rent) || 0;
      propertyDetailsMap[pd.OwnerID].carpetAreaSqFeet += Number(pd.CarpetAreaSqFeet) || 0;
      propertyDetailsMap[pd.OwnerID].carpetAreaSqMeter += Number(pd.CarpetAreaSqMeter) || 0;
    });

    // Step 7: Merge all for response
    const result = transRecords.map(tr => {
      const propertyInfo = properties.find(p => p.OwnerID === tr.OwnerID) || {};
      const names = ownerMap[tr.OwnerID] || {};
      const oldProp = oldMap[tr.OwnerID] || {};
      const propertyDetail = propertyDetailsMap[tr.OwnerID] || {};
      const propertyDesc = typeMap[propertyInfo.PropertyTypeID] || "";

      return {
        TId: tr.TId,
        ownerId: tr.OwnerID,
        ownerName: names.OwnerName,
        occupierName: names.OccupierName,
        MarathiOccupierName:names.MarathiOccupierName,
        renterName: names.RenterName,
        financeYear: tr.FinanceYear,
        rateableValue: tr.RateableValue,
        propertyTax: tr.PropertyTax,
        educationTax: tr.EducationTax,
        employmentTax: tr.EmploymentTax,
        treeCess: tr.TreeCess,
        spEducationTax: tr.SpEducationTax,
        sanitation: tr.Sanitation,
        drainCess: tr.DrainCess,
        spWaterCess: tr.SpWaterCess,
        roadCess: tr.RoadCess,
        fireCess: tr.FireCess,
        lightCess: tr.LightCess,
        waterBenefit: tr.WaterBenefit,
        majorBuilding: tr.MajorBuilding,
        sewageDisposalCess: tr.SewageDisposalCess,
        waterBill: tr.WaterBill,
        taxTotal: tr.TaxTotal,
        maintenance: tr.Maintenance,
        interest: tr.Interest,
        remark: tr.Remark,

        newZoneNo: propertyInfo.NewZoneNo || "",
        newWardNo: propertyInfo.NewWardNo || "",
        newPropertyNo: propertyInfo.NewPropertyNo || "",
        newPart: propertyInfo.NewPartitionNo || "",
        address: propertyInfo.Address || "",
        buildingName: propertyInfo.BuildingOrShopNameMarathi || "",
        propertyDesc,
        MobileNo: propertyInfo.MobileNo || "",

        rent: propertyDetail.rent,
        carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
        carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,

        oldWard: oldProp.OldWardNo,
        oldProperty: oldProp.OldPropertyNo,
        oldPart: oldProp.OldPartitionNo,
        oldRV: oldProp.OldRV,
        oldPropertyTax: oldProp.OldPropertyTax,
        oldTotalTax: oldProp.OldTotalTax,
      };
    });

    res.status(200).json({ success: true, totalRecords: result.length, data: result });

  } catch (error) {
    console.error("❌ Error fetching combined TransMast data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//

//Old RV has value but Net tax is Zero 25

export const getPropertyWithNetTaxByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get OwnerIDs from PropertyMast in given wards
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos },
      CombPropRemark: { [Op.ne]: 'Yes' }  },
      attributes: [
        'OwnerID',
        'NewZoneNo',
        'PropertyTypeID',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'Address',
        'BuildingOrShopNameMarathi'
      ],
    });

    const ownerIds = owners.map(o => o.OwnerID);
    if (ownerIds.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 2️⃣: Filter OldPropertyMast with OldRV > 0
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds }, OldRV: { [Op.gt]: 0 } },
    });
    const oldOwnerIds = oldProperties.map(op => op.OwnerID);
    if (oldOwnerIds.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 3️⃣: Find latest FinanceYear dynamically
    const latestTrans = await TransMast.findOne({
      attributes: [[Sequelize.fn('MAX', Sequelize.col('FinanceYear')), 'latestYear']],
      where: { OwnerID: { [Op.in]: oldOwnerIds } },
    });
    const latestYear = latestTrans?.dataValues?.latestYear;
    if (!latestYear) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 4️⃣: Fetch TransMast with latestYear and RateableValue = 0
    const transRecords = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: oldOwnerIds }, FinanceYear: latestYear, RateableValue: 0 },
    });

    const finalOwnerIds = transRecords.map(tr => tr.OwnerID);
    if (finalOwnerIds.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 5️⃣: Fetch CombinedOwnerName
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: finalOwnerIds } },
      attributes: [
        'OwnerID', 'OwnerName', 'MarathiOwnerName',
        'OccupierName', 'MarathiOccupierName',
        'RenterName', 'MarathiRenterName'
      ],
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.OwnerName || "",
        marathiOwnerName: o.MarathiOwnerName || "",
        occupierName: o.OccupierName || "",
        marathiOccupierName: o.MarathiOccupierName || "",
        renterName: o.RenterName || "",
        marathiRenterName: o.MarathiRenterName || "",
      };
    });

    // Step 6️⃣: Fetch PropertyTypeMaster
    const propertyTypeIds = owners.map(o => o.PropertyTypeID);
    const propertyTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
      attributes: ['PropertyTypeID', 'PropertyDescription'],
    });
    const propertyTypeMap = {};
    propertyTypes.forEach(pt => {
      propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription || "";
    });

    // Step 7️⃣: Fetch PropertyDetailsNew (Rent & Carpet Area)
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: finalOwnerIds } },
      attributes: ['OwnerID', 'Rent', 'CarpetAreaSqFeet', 'CarpetAreaSqMeter'],
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      const ownerId = pd.OwnerID;
      const rent = Number(pd.Rent) || 0;
      const sqft = Number(pd.CarpetAreaSqFeet) || 0;
      const sqm = Number(pd.CarpetAreaSqMeter) || 0;

      if (!propertyDetailsMap[ownerId]) {
        propertyDetailsMap[ownerId] = { rent, carpetAreaSqFeet: sqft, carpetAreaSqMeter: sqm };
      } else {
        propertyDetailsMap[ownerId].rent += rent;
        propertyDetailsMap[ownerId].carpetAreaSqFeet += sqft;
        propertyDetailsMap[ownerId].carpetAreaSqMeter += sqm;
      }
    });

    // Step 8️⃣: Map final response
    const result = transRecords.map(tr => {
      const propertyInfo = owners.find(o => o.OwnerID === tr.OwnerID) || {};
      const oldProp = oldProperties.find(op => op.OwnerID === tr.OwnerID) || {};
      const names = ownerNameMap[tr.OwnerID] || {};
      const propertyDesc = propertyTypeMap[propertyInfo.PropertyTypeID] || "";
      const propertyDetail = propertyDetailsMap[tr.OwnerID] || { rent: 0, carpetAreaSqFeet: 0, carpetAreaSqMeter: 0 };

      return {
        TId: tr.TId,
        ownerId: tr.OwnerID,
        ownerName: names.ownerName,
        marathiOwnerName: names.marathiOwnerName,
        occupierName: names.occupierName,
        marathiOccupierName: names.marathiOccupierName,
        renterName: names.renterName,
        marathiRenterName: names.marathiRenterName,
        financeYear: tr.FinanceYear,
        rateableValue: tr.RateableValue,
        propertyTax: tr.PropertyTax,
        educationTax: tr.EducationTax,
        employmentTax: tr.EmploymentTax,
        treeCess: tr.TreeCess,
        spEducationTax: tr.SpEducationTax,
        sanitation: tr.Sanitation,
        drainCess: tr.DrainCess,
        spWaterCess: tr.SpWaterCess,
        roadCess: tr.RoadCess,
        fireCess: tr.FireCess,
        lightCess: tr.LightCess,
        waterBenefit: tr.WaterBenefit,
        majorBuilding: tr.MajorBuilding,
        sewageDisposalCess: tr.SewageDisposalCess,
        waterBill: tr.WaterBill,
        taxTotal: tr.TaxTotal,
        maintenance: tr.Maintenance,
        interest: tr.Interest,
        remark: tr.Remark,

        newZoneNo: propertyInfo.NewZoneNo || "",
        newWardNo: propertyInfo.NewWardNo || "",
        newPropertyNo: propertyInfo.NewPropertyNo || "",
        newPart: propertyInfo.NewPartitionNo || "",
        address: propertyInfo.Address || "",
        buildingName: propertyInfo.BuildingOrShopNameMarathi || "",
        propertyDesc,

        oldWard: oldProp.OldWardNo || "",
        oldProperty: oldProp.OldPropertyNo || "",
        oldPart: oldProp.OldPartitionNo || "",
        oldRV: oldProp.OldRV || null,
        oldPropertyTax: oldProp.OldPropertyTax || null,
        oldTotalTax: oldProp.OldTotalTax || null,

        rent: propertyDetail.rent,
        carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
        carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,
      };
    });

    // ✅ Send response
    res.status(200).json({ success: true, totalRecords: result.length, data: result });

  } catch (error) {
    console.error("❌ Error fetching Property with Net Tax:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//duplictae floor 24 

export const getDuplicatePropertyFloor = async (req, res) => {
  const { wardNos } = req.body;

  if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide wardNos as a non-empty array",
    });
  }

  const intWardNo = wardNos.map((item) => parseInt(item.trim()));

  try {
    // Step 1: Get PropertyMast rows for the given wards
    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: intWardNo } },
      attributes: ["OwnerID", "NewWardNo", "NewPropertyNo", "NewPartitionNo"],
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName","OwnerName", "MarathiRenterName","OccupierName", "MarathiOccupierName", "RenterName"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!properties.length) {
      return res.status(200).json({
        success: true,
        totalOwners: 0,
        data: [],
      });
    }

    const ownerIDs = properties.map((p) => p.OwnerID);

    // Step 2: Fetch all PropertyDetailsNew rows for these OwnerIDs
    const allRows = await PropertyDetailsNew.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        TypeOFUse: { [Op.ne]: "V" },
      },
      raw: true,
    });

    if (!allRows.length) {
      return res.status(200).json({
        success: true,
        totalOwners: 0,
        data: [],
      });
    }

    // Step 3: Count duplicates by OwnerID
    const ownerCountMap = {};
    allRows.forEach((row) => {
      ownerCountMap[row.OwnerID] = (ownerCountMap[row.OwnerID] || 0) + 1;
    });

    const duplicateOwnerIDs = Object.keys(ownerCountMap).filter(
      (id) => ownerCountMap[id] > 1
    );

    if (!duplicateOwnerIDs.length) {
      return res.status(200).json({
        success: true,
        totalOwners: 0,
        data: [],
      });
    }

    // Step 4: Merge PropertyMast + PropertyDetailsNew + Marathi names
    const formattedData = allRows
      .filter((row) => duplicateOwnerIDs.includes(row.OwnerID.toString()))
      .map((row) => {
        const prop = properties.find((p) => p.OwnerID === row.OwnerID);
        return {
          PDNId: row.PDNId,
          OwnerID: row.OwnerID,
          NewWardNo: prop?.NewWardNo || null,
          NewPropertyNo: prop?.NewPropertyNo || null,
          NewPartitionNo: prop?.NewPartitionNo || null,
          FloorID: row.FloorID,
          ConstructionYear: row.ConstructionYear,
          ConstructionType: row.ConstructionType,
          GroupId: row.GroupId,
          TypeOFUse: row.TypeOFUse,
          CarpetAreaSqFeet: row.CarpetAreaSqFeet,
          CarpetAreaSqMeter: row.CarpetAreaSqMeter,
          NoOfRooms: row.NoOfRooms,
          Registration: row.Registration,
          RenterYesNO: row.RenterYesNO,
          RenterName: row.RenterName,
          RenterNameMarathi: row.RenterNameMarathi,
          Rent: row.Rent,
          NonCalculateRent: row.NonCalculateRent,
          OccupierYesNo: row.OccupierYesNo === 1 ? "Yes" : "No",
          OccupierName: row.OccupierName,
          OccupierNameMarathi: row.OccupierNameMarathi,
          Wing: row.Wing,
          IsAgreement: row.IsAgreement,
          AgreementDate: row.AgreementDate,
          AgreementToDate: row.AgreementToDate,
          CreatedBy: row.CreatedBy,
          CreatedDate: row.CreatedDate,
          UpdatedBy: row.UpdatedBy,
          UpdatedDate: row.UpdatedDate,
          BuildUpAreaSqFeet: row.BuildUpAreaSqFeet,
          BuildUpAreaSqMeter: row.BuildUpAreaSqMeter,
          Room: row.Room,
          DuplicateCount: ownerCountMap[row.OwnerID] || 1,
          ownerName:prop?.combinedOwnerName?.OwnerName || "",
          MarathiOwnerName: prop?.combinedOwnerName?.MarathiOwnerName || "",
          MarathiRenterName: prop?.combinedOwnerName?.MarathiRenterName || "",
        };
      });

    return res.status(200).json({
      success: true,
      totalOwners: duplicateOwnerIDs.length,
      data: formattedData,
    });
  } catch (error) {
    console.error("Error in getDuplicatePropertyFloor:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching duplicate floor list",
      error: error.message,
    });
  }
};




//missing book bill 27
// export const getMissingInvoiceList = async (req, res) => {
//   try {
//     const { billBookNo, year } = req.body;

//     // Validation
//     if (!billBookNo || !year) {
//       return res.status(400).json({
//         success: false,
//         message: "Bill Book No and Year are required",
//       });
//     }

//     // Fetch data from billbookmaster
//     const bookData = await BillBookEntry.findAll({
//       where: {
//         BillBookNo: billBookNo,
//         Year: year
//       }
//     });

//     if (!bookData || bookData.length === 0) {
//       return res.status(200).json({
//         success: true,
//         totalRecords: 0,
//         data: [],
//         message: "No data found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       totalRecords: bookData.length,
//       data: bookData
//     });

//   } catch (error) {
//     console.error("BillBook fetch error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
export const getMissingInvoiceList = async (req, res) => {
  try {
    const { billBookNo, year } = req.body;

    if (!billBookNo || !year) {
      return res.status(400).json({ 
        success: false, 
        message: "BillBookNo and Year are required" 
      });
    }

    // 1️⃣ Fetch BillBookEntry row
    const billBook = await BillBookEntry.findOne({
      where: { BillBookNo: billBookNo, Year: year },
      attributes: ['ReceiptNoFrom', 'ReceiptNoTo', 'EmpName', 'BillBookNo', 'Year']
    });

    if (!billBook) {
      return res.status(404).json({ 
        success: false, 
        message: "BillBook not found" 
      });
    }

    const fromNo = parseInt(billBook.ReceiptNoFrom);
    const toNo = parseInt(billBook.ReceiptNoTo);

    // 2️⃣ Check existing invoice nos from table
    const usedInvoices = await BillTransactionDetails.findAll({
      where: { BillBookNo: billBookNo, FinanceYear: year },
      attributes: ['InvoiceNo'],
      raw: true
    });

    const usedInvoiceSet = new Set(
      usedInvoices
        .map(u => parseInt(u.InvoiceNo))
        .filter(n => !isNaN(n))
    );

    // 3️⃣ Find missing invoice numbers
    const missingInvoices = [];
    for (let i = fromNo; i <= toNo; i++) {
      if (!usedInvoiceSet.has(i)) {
        missingInvoices.push({
          Year: billBook.Year,
          BillBookNo: billBook.BillBookNo,
          ReceiptNo: i,
          EmpName: billBook.EmpName
        });
      }
    }

    // 4️⃣ Return response
    return res.status(200).json({
      success: true,
      totalRecords: missingInvoices.length,
      "data": missingInvoices
    });

  } catch (error) {
    console.error("❌ Error fetching missing invoices:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//Bill Book List 36
export const getBillBookNoByYear = async (req, res) => {
  try {
    const { Year } = req.body;

    if (!Year) {
      return res.status(400).json({
        success: false,
        message: "Year is required"
      });
    }

    const billBookData = await BillBookEntry.findAll({
      where: { Year },
      attributes: [
        "Year",
        "BillBookNo",
        "ReceiptNoFrom",
        "ReceiptNoTo",
        "EmpName",
        "Status"
      ],
      order: [["BillBookNo", "ASC"]]
    });

    const formatted = billBookData.map(item => ({
      "Year": item.Year,
      "BillBookNo": item.BillBookNo,
      "ReceiptNoFrom": item.ReceiptNoFrom,
      "ReceiptNoTo": item.ReceiptNoTo,
      "EmpName": item.EmpName,
      "Status": item.Status 
    }));

    res.status(200).json({
      success: true,
      totalRecords: formatted.length,
      "BillBook List": formatted
    });
  } catch (error) {
    console.error("❌ Error fetching BillBook by Year:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//36
export const getBillBookListByYear = async (req, res) => {
  try {
    const { year } = req.body;

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required",
      });
    }

    // Fetch distinct BillBookNo for the given year
    const billBooks = await BillBookEntry.findAll({
      attributes: [[
        // DISTINCT BillBookNo
        BillBookEntry.sequelize.fn('DISTINCT', BillBookEntry.sequelize.col('BillBookNo')),
        'BillBookNo'
      ]],
      where: {
        Year: year
      },
      order: [['BillBookNo', 'ASC']]
    });

    // Format data as array of strings
    const billBookList = billBooks.map(item => item.BillBookNo);

    return res.json({
      success: true,
      data: billBookList
    });

  } catch (error) {
    console.error("Error fetching Bill Book List:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// 28 Missing New and Old Floor type of use Information RenterYesNO: true, Rent: { [Op.ne]: 0 }
// export const getRenterPropertyReport = async (req, res) => {
//   try {
//     let { wardNos } = req.body;

//     // ✅ Validate input
//     if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
//       return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
//     }
//     if (!Array.isArray(wardNos)) wardNos = [wardNos];

//     // Step 1️⃣: Fetch properties in given wards
//     const properties = await PropertyMast.findAll({
//       where: { NewWardNo: { [Op.in]: wardNos } },
//       attributes: [
//         'OwnerID', 'NewZoneNo', 'NewWardNo', 'NewPropertyNo', 'NewPartitionNo',
//         'Address', 'BuildingOrShopNameMarathi', 'PropertyTypeID'
//       ]
//     });

//     const ownerIds = properties.map(p => p.OwnerID);
//     if (ownerIds.length === 0) {
//       return res.status(200).json({ success: true, totalRecords: 0, data: [] });
//     }

//     // Step 2️⃣: Fetch old properties (OldRV > 0)
//     const oldProperties = await OldPropertyMast.findAll({
//       where: { OwnerID: { [Op.in]: ownerIds }, OldRV: { [Op.gt]: 0 } },
//     });
//     const oldOwnerIds = oldProperties.map(op => op.OwnerID);
//     if (oldOwnerIds.length === 0) {
//       return res.status(200).json({ success: true, totalRecords: 0, data: [] });
//     }

//     // Step 3️⃣: Latest finance year
//     const latestTrans = await TransMast.findOne({
//       attributes: [[Sequelize.fn('MAX', Sequelize.col('FinanceYear')), 'latestYear']],
//       where: { OwnerID: { [Op.in]: oldOwnerIds } }
//     });
//     const latestYear = latestTrans?.dataValues?.latestYear;
//     if (!latestYear) {
//       return res.status(200).json({ success: true, totalRecords: 0, data: [] });
//     }

//     // Step 4️⃣: Fetch transactions with RateableValue = 0
//     const transRecords = await TransMast.findAll({
//       where: { OwnerID: { [Op.in]: oldOwnerIds }, FinanceYear: latestYear, RateableValue: 0 }
//     });

//     const finalOwnerIds = transRecords.map(tr => tr.OwnerID);
//     if (finalOwnerIds.length === 0) {
//       return res.status(200).json({ success: true, totalRecords: 0, data: [] });
//     }

//     // Step 5️⃣: Fetch owner names
//     const ownerNames = await CombinedOwnerName.findAll({
//       where: { OwnerID: { [Op.in]: finalOwnerIds } },
//       attributes: [
//         'OwnerID', 'OwnerName', 'MarathiOwnerName',
//         'OccupierName', 'MarathiOccupierName',
//         'RenterName', 'MarathiRenterName'
//       ]
//     });

//     const ownerNameMap = {};
//     ownerNames.forEach(o => {
//       ownerNameMap[o.OwnerID] = {
//         ownerName: o.OwnerName || "",
//         marathiOwnerName: o.MarathiOwnerName || "",
//         occupierName: o.OccupierName || "",
//         marathiOccupierName: o.MarathiOccupierName || "",
//         renterName: o.RenterName || "",
//         marathiRenterName: o.MarathiRenterName || ""
//       };
//     });

//     // Step 6️⃣: Fetch property types
//     const propertyTypeIds = properties.map(p => p.PropertyTypeID);
//     const propertyTypes = await PropertyTypeMaster.findAll({
//       where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
//       attributes: ['PropertyTypeID', 'PropertyDescription']
//     });

//     const propertyTypeMap = {};
//     propertyTypes.forEach(pt => {
//       propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription || "";
//     });

//     // Step 7️⃣: Fetch rent and area details
//     const propertyDetails = await PropertyDetailsNew.findAll({
//       where: { OwnerID: { [Op.in]: finalOwnerIds } },
//       attributes: ['OwnerID', 'Rent', 'CarpetAreaSqFeet', 'CarpetAreaSqMeter']
//     });

//     const propertyDetailsMap = {};
//     propertyDetails.forEach(pd => {
//       const ownerId = pd.OwnerID;
//       const rent = Number(pd.Rent) || 0;
//       const sqft = Number(pd.CarpetAreaSqFeet) || 0;
//       const sqm = Number(pd.CarpetAreaSqMeter) || 0;

//       if (!propertyDetailsMap[ownerId]) {
//         propertyDetailsMap[ownerId] = { rent, carpetAreaSqFeet: sqft, carpetAreaSqMeter: sqm };
//       } else {
//         propertyDetailsMap[ownerId].rent += rent;
//         propertyDetailsMap[ownerId].carpetAreaSqFeet += sqft;
//         propertyDetailsMap[ownerId].carpetAreaSqMeter += sqm;
//       }
//     });

//     // Step 8️⃣: Map final response
//     const result = transRecords.map(tr => {
//       const prop = properties.find(p => p.OwnerID === tr.OwnerID) || {};
//       const oldProp = oldProperties.find(op => op.OwnerID === tr.OwnerID) || {};
//       const names = ownerNameMap[tr.OwnerID] || {};
//       const propertyDesc = propertyTypeMap[prop.PropertyTypeID] || "";
//       const propertyDetail = propertyDetailsMap[tr.OwnerID] || { rent: 0, carpetAreaSqFeet: 0, carpetAreaSqMeter: 0 };

//       return {
//         ownerId: tr.OwnerID,
//         ownerName: names.ownerName,
//         marathiOwnerName: names.marathiOwnerName,
//         occupierName: names.occupierName,
//         marathiOccupierName: names.marathiOccupierName,
//         renterName: names.renterName,
//         marathiRenterName: names.marathiRenterName,
//         financeYear: tr.FinanceYear,
//         rateableValue: tr.RateableValue,
//         propertyTax: tr.PropertyTax,
//         oldRV: oldProp.OldRV || null,
//         oldPropertyTax: oldProp.OldPropertyTax || null,
//         oldTotalTax: oldProp.OldTotalTax || null,
//         newZoneNo: prop.NewZoneNo || "",
//         newWardNo: prop.NewWardNo || "",
//         newPropertyNo: prop.NewPropertyNo || "",
//         newPartitionNo: prop.NewPartitionNo || "",
//         address: prop.Address || "",
//         buildingName: prop.BuildingOrShopNameMarathi || "",
//         propertyDesc,
//         rent: propertyDetail.rent,
//         carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
//         carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,
//       };
//     });

//     // ✅ Send response
//     res.status(200).json({ success: true, totalRecords: result.length, data: result });

//   } catch (error) {
//     console.error("❌ Error fetching Renter Property Report:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

//apply 29
export const getRenterPropertyReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // STEP 1: Property List
    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        "OwnerID", "NewZoneNo", "NewWardNo", "NewPropertyNo", "NewPartitionNo",
        "Address", "BuildingOrShopNameMarathi", "PropertyTypeID"
      ]
    });

    const ownerIds = properties.map(x => x.OwnerID);
    if (ownerIds.length === 0)
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });

    // STEP 2: Old Property Data
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: [
        "OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo",
        "OldRV", "OldPropertyTax", "OldTotalTax"
      ]
    });

    const oldMap = {};
    oldProperties.forEach(op => {
      oldMap[op.OwnerID] = {
        oldWardNo: op.OldWardNo,
        oldPropertyNo: op.OldPropertyNo,
        oldPartitionNo: op.OldPartitionNo,
        oldRV: op.OldRV,
        oldPropertyTax: op.OldPropertyTax,
        oldTotalTax: op.OldTotalTax
      };
    });

    // STEP 3: Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"]
    });

    const ownerNameMap = {};
    ownerNames.forEach(x => ownerNameMap[x.OwnerID] = x);

    // STEP 4: Property Type
    const typeIds = properties.map(p => p.PropertyTypeID);
    const propTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: typeIds } }
    });

    const propTypeMap = {};
    propTypes.forEach(pt => propTypeMap[pt.PropertyTypeID] = pt.PropertyDescription);

    // STEP 5: Rent + Area + Taxes
    const details = await PropertyDetailsNew.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        RenterYesNO: true,
        Rent: { [Op.ne]: 0 }
      }
    });

    const detailMap = {};
    details.forEach(d => {
      if (!detailMap[d.OwnerID]) {
        detailMap[d.OwnerID] = {
          rent: 0,
          carpetArea: 0,
          rv: 0,
          propertyTax: 0,
          REducationTax: 0, CEducationTax: 0,
          REmploymentTax: 0, CEmploymentTax: 0,
          TreeCess: 0, SpEducationTax: 0,
          Sanitation: 0, DrainCess: 0,
          SpWaterCess: 0, RoadCess: 0,
          FireCess: 0, LightCess: 0,
          WaterBenefitTax: 0, MajorBuildingTax: 0,
          SewageDispCess: 0, WaterBill: 0,
          Tax1: 0
        };
      }

      detailMap[d.OwnerID].rent += Number(d.RentFromRenterPerMonth || 0);
      detailMap[d.OwnerID].carpetArea += Number(d.CarpetAreaSqFeet || 0);
      detailMap[d.OwnerID].rv += Number(d.RateableValue || 0);
      detailMap[d.OwnerID].propertyTax += Number(d.PropertyTax || 0);

      detailMap[d.OwnerID].REducationTax += Number(d.REducationTax || 0);
      detailMap[d.OwnerID].CEducationTax += Number(d.CEducationTax || 0);
      detailMap[d.OwnerID].REmploymentTax += Number(d.REmploymentTax || 0);
      detailMap[d.OwnerID].CEmploymentTax += Number(d.CEmploymentTax || 0);
      detailMap[d.OwnerID].TreeCess += Number(d.TreeCess || 0);
      detailMap[d.OwnerID].SpEducationTax += Number(d.SpEducationTax || 0);
      detailMap[d.OwnerID].Sanitation += Number(d.Sanitation || 0);
      detailMap[d.OwnerID].DrainCess += Number(d.DrainCess || 0);
      detailMap[d.OwnerID].SpWaterCess += Number(d.SpWaterCess || 0);
      detailMap[d.OwnerID].RoadCess += Number(d.RoadCess || 0);
      detailMap[d.OwnerID].FireCess += Number(d.FireCess || 0);
      detailMap[d.OwnerID].LightCess += Number(d.LightCess || 0);
      detailMap[d.OwnerID].WaterBenefitTax += Number(d.WaterBenefitTax || 0);
      detailMap[d.OwnerID].MajorBuildingTax += Number(d.MajorBuildingTax || 0);
      detailMap[d.OwnerID].SewageDispCess += Number(d.SewageDispCess || 0);
      detailMap[d.OwnerID].WaterBill += Number(d.WaterBill || 0);
      detailMap[d.OwnerID].Tax1 += Number(d.Tax1 || 0);
    });

    // STEP 6: Final Output with both filters
    const data = properties
      .filter(pm => detailMap[pm.OwnerID] && propTypeMap[pm.PropertyTypeID]) 
      .map(pm => {
        const o = oldMap[pm.OwnerID] || {};
        const nm = ownerNameMap[pm.OwnerID] || {};
        const d = detailMap[pm.OwnerID];

        const proposedTotal =
          Math.round(d.propertyTax) +
          Math.round(d.REducationTax + d.CEducationTax) +
          Math.round(d.REmploymentTax + d.CEmploymentTax) +
          Math.round(d.TreeCess + d.SpEducationTax) +
          Math.round(d.Sanitation + d.DrainCess) +
          Math.round(d.SpWaterCess + d.RoadCess) +
          Math.round(d.FireCess + d.LightCess) +
          Math.round(d.WaterBenefitTax + d.MajorBuildingTax) +
          Math.round(d.SewageDispCess + d.WaterBill) +
          Math.round(d.Tax1);

        return {
          ownerIds: pm.OwnerID,
          newZoneNo: pm.NewZoneNo,
          newWardNo: pm.NewWardNo,
          newPropertyNo: pm.NewPropertyNo,
          newPartitionNo: pm.NewPartitionNo,

          oldWardNo: o.oldWardNo || "",
          oldPropertyNo: o.oldPropertyNo || "",
          oldPartitionNo: o.oldPartitionNo || "",

          marathiOwnerName: nm.MarathiOwnerName || "",
          marathiRenterName: nm.MarathiRenterName || "",

          buildingName: pm.BuildingOrShopNameMarathi,
          address: pm.Address,
          propertyDescription: propTypeMap[pm.PropertyTypeID] || "",

          carpetArea: d.carpetArea,
          rent: d.rent,

          oldRV: o.oldRV || 0,
          oldPropertyTax: o.oldPropertyTax || 0,
          oldTotalTax: o.oldTotalTax || 0,

          proposedRV: d.rv,
          proposedTax: d.propertyTax,
          proposedTotalTax: proposedTotal
        };
      });

    return res.status(200).json({
      success: true,
      totalRecords: data.length,
      data
    });

  } catch (error) {
    console.error("Error in getRenterPropertyReport:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//apply 30
export const getPropertiesWithRenterHavingRent = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Step 0: Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No",
      });
    }

    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get OwnerIDs for selected wards
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "Address",
        "BuildingOrShopNameMarathi",
      ],
    });

    if (owners.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = owners.map((o) => o.OwnerID);

    // Step 2️⃣: Get property details where RenterYesNO = true AND (Rent > 0 OR NonCalculateRent > 0)
    const propertiesWithRenter = await PropertyDetailsNew.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        RenterYesNO: true,
        [Op.or]: [
          { Rent: { [Op.gt]: 0 } },
          { NonCalculateRent: { [Op.gt]: 0 } },
        ],
      },
      attributes: [
        "OwnerID",
        "Rent",
        "NonCalculateRent",
        "RenterName",
        "RenterNameMarathi",
        "OccupierName",
        "OccupierNameMarathi",
        "OccupierYesNo",
      ],
    });

    if (propertiesWithRenter.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIdSet = [...new Set(propertiesWithRenter.map((p) => p.OwnerID))];

    // Step 3️⃣: Get owner names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIdSet } },
      attributes: [
        "OwnerID",
        "OwnerName",
        "MarathiOwnerName",
        "OccupierName",
        "MarathiOccupierName",
      ],
    });

    const nameMap = {};
    ownerNames.forEach((o) => {
      nameMap[o.OwnerID] = {
        ownerName: o.OwnerName || "",
        occupierName: o.OccupierName || "",
        ownerNameMarathi: o.MarathiOwnerName || "",
        occupierNameMarathi: o.MarathiOccupierName || "",
      };
    });

    // Step 4️⃣: Combine everything
    const result = propertiesWithRenter.map((prop) => {
      const propertyInfo = owners.find((o) => o.OwnerID === prop.OwnerID) || {};
      const names = nameMap[prop.OwnerID] || {};

      return {
        OwnerID: prop.OwnerID,
        OwnerName: names.ownerName,
        ownerNameMarathi: names.ownerNameMarathi,

        OccupierName: names.occupierName,
        OccupierNameMarathi: names.occupierNameMarathi,
        OccupierYesNo: prop.OccupierYesNo === true ? "Yes" : "No",

        NewZoneNo: propertyInfo.NewZoneNo,
        NewWardNo: propertyInfo.NewWardNo,
        NewPropertyNo: propertyInfo.NewPropertyNo,
        NewPartitionNo: propertyInfo.NewPartitionNo,
        Address: propertyInfo.Address,
        BuildingName: propertyInfo.BuildingOrShopNameMarathi,

        Rent: prop.Rent,
        NonCalculateRent: prop.NonCalculateRent,
        RenterName: prop.RenterName || "",
        RenterNameMarathi: prop.RenterNameMarathi || "",
      };
    });

    // ✅ Final response
    return res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });
  } catch (error) {
    console.error("❌ Error fetching properties with renter:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//cancel invoiec 32
// export const getCanceledInvoiceList = async (req, res) => {
//   try {
//     const { billBookNo, year } = req.body;

//     if (!billBookNo || !year) {
//       return res.status(400).json({
//         success: false,
//         message: "billBookNo and year both are required"
//       });
//     }

//     const data = await BillBookEntry.findAll({
//       attributes: [
//         'BillBookNo',
//         'ReceiptNoFrom',
//         'ReceiptNoTo',

//         'Remark',
//         'EmpName',
//         'Year'
//       ],
//       where: {
//         Status: 0,        
//         BillBookNo: billBookNo,
//         Year: year
//       },
//       order: [['ReceiptNoFrom', 'ASC']]
//     });

//     return res.json({
//       success: true,
//       data
//     });

//   } catch (error) {
//     console.error("Error fetching Cancel Invoice List:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };
export const getCanceledInvoiceList = async (req, res) => {
  try {
    const { billBookNo, year } = req.body;

    if (!billBookNo || !year) {
      return res.status(400).json({
        success: false,
        message: "BillBookNo and Year are required"
      });
    }

    // Fetch only cancelled billbook range
    const billBook = await BillBookEntry.findOne({
      where: { BillBookNo: billBookNo, Year: year, Status: 0 },
      attributes: ['ReceiptNoFrom', 'ReceiptNoTo', 'EmpName', 'BillBookNo', 'Year']
    });

    if (!billBook) {
      return res.status(200).json({
        success: true,
        totalRecords: 0,
        "Canceled Invoice Lists": []
      });
    }

    const { ReceiptNoFrom, ReceiptNoTo } = billBook;

    // Cancelled invoices from InvoiceNoMaster
    const canceledInvoices = await InvoiceNoMaster.findAll({
      where: {
        BillBookNo: billBookNo,
        Year: year,
        Status: 1
      },
      attributes: ['InvoiceNo', 'Reason']
    });

    const formatResponse = canceledInvoices.map(inv => ({
      Year: billBook.Year,
      BillBookNo: billBook.BillBookNo,
      ReceiptNo: inv.InvoiceNo,
      EmpName: billBook.EmpName,
      Reason: inv.Reason
    }));

    res.status(200).json({
      success: true,
      totalRecords: formatResponse.length,
      "data": formatResponse
    });

  } catch (error) {
    console.error("Cancel Invoice API Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



//open plot 33
export const getOpenPlotPropertiesByWard = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Fetch OpenPlot properties from PropertyMast
    const properties = await PropertyMast.findAll({
      where: {
        OpenPlot: 1,
        NewWardNo: { [Op.in]: wardNos }
      },
      attributes: [
        'OwnerID',
        'NewZoneNo',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'PlotArea',
        'OpenPlotRenterName'
      ]
    });

    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIds = properties.map(p => p.OwnerID);

    // Step 2️⃣: Fetch OpenPlot renter/occupier info from PropertyDetailsNew
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: [
        'OwnerID',
        'RenterName',
        
      ]
    });

    const detailsMap = {};
    propertyDetails.forEach(d => {
      detailsMap[d.OwnerID] = {
        RenterName: d.RenterName ?? null,

           };
    });

    // Step 3️⃣: Fetch latest FinanceYear tax from TransMast
    const latestYear = await TransMast.max('FinanceYear');

    const trans = await TransMast.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        FinanceYear: latestYear
      },
      attributes: ['OwnerID', 'RateableValue', 'TaxTotal']
    });

    const transMap = {};
    trans.forEach(t => {
      transMap[t.OwnerID] = {
        ProposedRateableValue: t.RateableValue || 0,
        ProposedTax: t.TaxTotal || 0
      };
    });

    // Step 4️⃣: Fetch Marathi Owner/Renter names from CombinedOwnerName
    const combined = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID','OwnerName','OccupierName', 'MarathiOwnerName', 'MarathiRenterName']
    });

    const nameMap = {};
    combined.forEach(c => {
      nameMap[c.OwnerID] = {
        MarathiOwnerName: c.MarathiOwnerName || "",
        MarathiRenterName: c.MarathiRenterName || "",
        OwnerName:c.OwnerName ||"",
        OccupierName:c.OccupierName || ""
     };
    });

    // Step 5️⃣: Fetch OldPropertyMast for OldWard/OldProperty/OldPartition
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OldWardNo', 'OldPropertyNo', 'OldPartitionNo']
    });

    const oldMap = {};
    oldProperties.forEach(op => {
      oldMap[op.OwnerID] = {
        OldWardNo: op.OldWardNo ?? null,
        OldPropertyNo: op.OldPropertyNo ?? null,
        OldPartitionNo: op.OldPartitionNo ?? null
      };
    });

    // Step 6️⃣: Map all together
    const result = properties.map(p => {
      const det = detailsMap[p.OwnerID] || {};
      const tx = transMap[p.OwnerID] || {};
      const nm = nameMap[p.OwnerID] || {};
      const oldProp = oldMap[p.OwnerID] || {};

      return {
        ownerIds: p.OwnerID,
        NewWardNo: p.NewWardNo,
        NewPropertyNo: p.NewPropertyNo,
        NewPartitionNo: p.NewPartitionNo,
        OpenPlotRenterName:p.OpenPlotRenterName,
        OldWardNo: oldProp.OldWardNo,
        OldPropertyNo: oldProp.OldPropertyNo,
        OldPartitionNo: oldProp.OldPartitionNo,

        MarathiOwnerName: nm.MarathiOwnerName,
        MarathiRenterName: nm.MarathiRenterName,
        OwnerName:nm.OwnerName,
        OccupierName:nm.OccupierName,
        // OpenPlotRenterName: det.OpenPlotRenterName,
        // OpenPlotOccupierName: det.OpenPlotOccupierName,
        // OpenPlotOccupierMarathiName: det.OpenPlotOccupierMarathiName,
        RenterName: det.RenterName,
        PlotArea: p.PlotArea || 0,

        ProposedRateableValue: tx.ProposedRateableValue || 0,
        ProposedTax: tx.ProposedTax || 0,

        IsOpenPlot: "Yes"
      };
    });

    // ✅ Send response
    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result
    });

  } catch (error) {
    console.error("❌ Error fetching Open Plot properties:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Apply Old Property Without Old Tax and Old RV 09
export const getNoTaxZeroRVOldPropertie = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Step 0: Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No",
      });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get latest finance year
    const latestFinanceYear = await AssessmentMaster.max("MaxYear", {
      where: { ActiveStatus: 1 },
    });

    // Step 2️⃣: Get OwnerIDs from PropertyMast excluding combined properties
    const owners = await PropertyMast.findAll({
      where: {
        NewWardNo: { [Op.in]: wardNos },
        CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
      },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "Address",
        "BuildingOrShopNameMarathi",
      ],
    });

    const ownerIds = owners.map(o => o.OwnerID);
    if (ownerIds.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 3️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: [
        "OwnerID",
        "OwnerName",
        "MarathiOwnerName",
        "OccupierName",
        "MarathiOccupierName",
      ],
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || o.OwnerName || "",
        occupierName: o.MarathiOccupierName || o.OccupierName || "",
      };
    });

    // Step 4️⃣: Fetch OldPropertyMast with zero tax and valid old property
    const oldProperties = await OldPropertyMast.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        OldTotalTax: 0,
        OldPropertyNo: { [Op.notLike]: "%New%" }
      },
    });

    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      oldPropertyMap[op.OwnerID] = {
        oldWard: op.OldWardNo || "",
        oldProperty: op.OldPropertyNo || "",
        oldPart: op.OldPartitionNo || "",
        oldRV: op.OldRV || 0,
        oldPropertyTax: op.OldPropertyTax || 0,
        oldTotalTax: op.OldTotalTax || 0,
      };
    });

    // Step 5️⃣: Filter by construction year from PropertyDetailsNew
    const recentProperties = await PropertyDetailsNew.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        ConstructionYear: { [Op.gte]: latestFinanceYear },
      },
      attributes: ["OwnerID"],
      raw: true,
    });

    const includedOwnerIds = recentProperties.map(p => p.OwnerID);

    // Step 6️⃣: Map final response
    const result = owners
      .filter(o => includedOwnerIds.includes(o.OwnerID) && oldPropertyMap[o.OwnerID])
      .map(o => {
        const names = ownerNameMap[o.OwnerID] || {};
        const oldProp = oldPropertyMap[o.OwnerID] || {};

        return {
          ownerId: o.OwnerID,
          ownerName: names.ownerName,
          occupierName: names.occupierName,

          newZoneNo: o.NewZoneNo,
          newWardNo: o.NewWardNo,
          newPropertyNo: o.NewPropertyNo,
          newPart: o.NewPartitionNo,
          address: o.Address,
          buildingName: o.BuildingOrShopNameMarathi,

          oldWard: oldProp.oldWard,
          oldProperty: oldProp.oldProperty,
          oldPart: oldProp.oldPart,
          oldRV: oldProp.oldRV,
          oldPropertyTax: oldProp.oldPropertyTax,
          oldTotalTax: oldProp.oldTotalTax,
        };
      });

    // ✅ Step 7️⃣: Return response
    return res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error fetching No Tax Zero RV Old Properties:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// //apply Properties with missing floor details 14
export const getOpenPlotProperties = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // Step 0: Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No",
      });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1: Fetch properties from PropertyMast
    const properties = await PropertyMast.findAll({
      where: {
        NewWardNo: { [Op.in]: wardNos },
        OpenPlot: 1,
        CombPropRemark: {
          [Op.notIn]: ["Yes", "yes"],
          [Op.notLike]: "%comb%"
        }      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: true,
        },
        {
          model: PropertyTypeMaster,
          attributes: ["PropertyDescription"],
          where: { PropertyDescription: { [Op.ne]: "प्लॉट" } },
          required: true,
        },
      ],
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      order: [
        ["NewWardNo", "ASC"],
        ["NewPropertyNo", "ASC"],
        ["NewPartitionNo", "ASC"],
      ],
      raw: false,
    });

    // Step 2: Get all OwnerIDs from PropertyDetailsNew to exclude
    const propertyDetailsOwners = await PropertyDetailsNew.findAll({
      attributes: ["OwnerID"],
      raw: true,
    });
    const ownerIdsInDetails = propertyDetailsOwners.map((p) => p.OwnerID);

    // Step 3: Fetch OldPropertyMast for OldWard/OldProperty/OldPartition
    const oldProperties = await OldPropertyMast.findAll({
      attributes: ["OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo"],
      raw: true,
    });
    const oldMap = {};
    oldProperties.forEach((op) => {
      oldMap[op.OwnerID] = {
        OldWardNo: op.OldWardNo || "",
        OldPropertyNo: op.OldPropertyNo || "",
        OldPartitionNo: op.OldPartitionNo || "",
      };
    });

    // Step 4: Prepare final result
    const finalResult = properties
      .filter((p) => !ownerIdsInDetails.includes(p.OwnerID))
      .map((p) => {
        const oldProp = oldMap[p.OwnerID] || {};
        return {
          ownerIDs: p.OwnerID,
          newZoneNo: p.NewZoneNo,
          newWardNo: p.NewWardNo,
          newPropertyNo: p.NewPropertyNo,
          newPart: p.NewPartitionNo,
          OldWardNo: oldProp.OldWardNo || "",
          OldPropertyNo: oldProp.OldPropertyNo || "",
          OldPartitionNo: oldProp.OldPartitionNo || "",
          ownerName: p.CombinedOwnerNames?.[0]?.MarathiOwnerName || "",
          renterName: p.CombinedOwnerNames?.[0]?.MarathiRenterName || "",
          buildingName: p.BuildingOrShopNameMarathi || "",
          propertyDesc: p.PropertyTypeMaster?.PropertyDescription || "",
          address: p.OwnerPatta || "",
          totalArea: null,
          rent: null,
          oldRV: null,
          oldPropertyTax: null,
          oldTotalTax: null,
          proposedRV: null,
          proposedPropertyTax: null,
          proposedTotalTax: null,
        };
      });

    // Step 5: Return response
    return res.status(200).json({
      success: true,
      totalRecords: finalResult.length,
      data: finalResult,
    });
  } catch (error) {
    console.error("❌ Error fetching open plot properties:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Properties without old Property tax and old total tax 20
//  Missing Toilet 22 apply
export const getMissingToiletData = async (req, res) => {
  const { wardNos } = req.body;

  // Validation
  if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNos.map((item) => parseInt(item.trim()));

  try {
    const result = await PropertyMast.findAll({
      where: {
        NewWardNo: { [Op.in]: intWardNo },
      },

      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "NewToiletNo",
        "commToiletNo",
      ],

      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName","OwnerName","RenterName"],
        },
        {
          model: OldPropertyMast,
          attributes: ["OldWardNo", "OldPropertyNo", "OldPartitionNo"],
        },
        {
          model: PropertyTypeMaster,
          attributes: ["PropertyDescription"],
          required: true,
        },
           {
              model: PropertyDetailsNew,
              where: {
                TypeOFUse: {
                  [Op.or]: [{ [Op.eq]: "V" }, { [Op.like]: "%W%" }],
                },
              },
              attributes: ["TypeOFUse"],
              required: true,
            },
      ],

      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    // ---------- FORMAT OUTPUT ----------
    const formattedData = result.map((p) => ({
      OwnerID: p?.OwnerID || "",
      NewZoneNo: p?.NewZoneNo || "",
      NewWardNo: p?.NewWardNo || "",
      NewPropertyNo: p?.NewPropertyNo || "",
      NewPartitionNo: p?.NewPartitionNo || "",

      OldWardNo: p?.oldPropertyMast?.OldWardNo || "",
      OldPropertyNo: p?.oldPropertyMast?.OldPropertyNo || "",
      OldPartitionNo: p?.oldPropertyMast?.OldPartitionNo || "",

      MarathiOwnerName: p?.combinedOwnerName?.MarathiOwnerName || "",
      MarathiRenterName: p?.combinedOwnerName?.MarathiRenterName || "",
      RenterName:p?.combinedOwnerName?.RenterName || "",
      OwnerName:p?.combinedOwnerName?.OwnerName || "",
      BuildingOrShopNameMarathi: p?.BuildingOrShopNameMarathi || "",
      PropertyDescription: p?.propertyTypeMaster?.PropertyDescription || "",
      OwnerPatta: p?.OwnerPatta || "",

      NewtoiletAvailable: p?.NewToiletNo > 0 ? "Yes" : "No",
      commToiletAvailable: p?.commToiletNo > 0 ? "Yes" : "No",
    }));

    if (formattedData.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    return res.json(formattedData);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server error while fetching toilet data",
    });
  }
};


//Comparison of old and new RV in parentage 38 apply
// export const getCommercialUCReport = async (req, res) => {
//   try {
//     let { wardNos } = req.body;

//     if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide Ward Numbers",
//       });
//     }

//     // Step1️⃣: Get Properties
//     const properties = await PropertyMast.findAll({
//       attributes: [
//         "OwnerID",
//         "NewZoneNo",
//         "NewWardNo",
//         "NewPropertyNo",
//         "NewPartitionNo",
//         "BuildingOrShopNameMarathi",
//         "OwnerPatta",
//         "PropertyTypeID",
//       ],
//       where: {
//         NewWardNo: { [Op.in]: wardNos }
//       },
//       raw: true,
//       nest: true
//     });

//     if (!properties.length) {
//       return res.status(200).json({
//         success: true,
//         totalRecords: 0,
//         data: [],
//       });
//     }

//     const ownerIDs = properties.map(p => p.OwnerID);

//     // Step2️⃣: Get Owner Names
//     const ownerNames = await CombinedOwnerName.findAll({
//       attributes: [
//         "OwnerID",
//         "MarathiOwnerName",
//         "MarathiRenterName"
//       ],
//       where: { OwnerID: { [Op.in]: ownerIDs } },
//       raw: true
//     });

//     const ownerMap = {};
//     ownerNames.forEach(n => {
//       ownerMap[n.OwnerID] = {
//         MarathiOwnerName: n.MarathiOwnerName,
//         MarathiRenterName: n.MarathiRenterName,
//       };
//     });

//     // Step3️⃣: Old Property Data
//     const oldData = await OldPropertyMast.findAll({
//       attributes: ["OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo"],
//       where: { OwnerID: { [Op.in]: ownerIDs } },
//       raw: true
//     });

//     const ownerOldData = {};
//     oldData.forEach(od => {
//       ownerOldData[od.OwnerID] = {
//         OldWardNo: od.OldWardNo,
//         OldPropertyNo: od.OldPropertyNo,
//         OldPartitionNo: od.OldPartitionNo
//       };
//     });

//     // Step4️⃣: PropertyType Name
//     const propertyTypes = await PropertyTypeMaster.findAll({
//       attributes: ["PropertyTypeID", "PropertyDescription"],
//       raw: true
//     });

//     const typeMap = {};
//     propertyTypes.forEach(t => {
//       typeMap[t.PropertyTypeID] = t.PropertyDescription;
//     });

//     // Step5️⃣: Get Only UC/UCC Records from PDN
//     const pdns = await PropertyDetailsNew.findAll({
//       where: {
//         OwnerID: { [Op.in]: ownerIDs },
//         TypeOFUse: { [Op.in]: ["UC", "UCC"] },
//       },
//       attributes: [
//         "OwnerID",
//         [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
//         [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
//       ],
//       group: ["OwnerID"],
//       raw: true
//     });

//     const pdnMap = {};
//     const validUCIDs = [];

//     pdns.forEach(p => {
//       pdnMap[p.OwnerID] = {
//         TotalArea: p.TotalArea || 0,
//         TotalRent: p.TotalRent || 0,
//       };
//       validUCIDs.push(p.OwnerID);
//     });

//     // ❌ Filter out owners without UC/UCC use
//     const filteredProperties = properties.filter(pm => validUCIDs.includes(pm.OwnerID));

//     if (!filteredProperties.length) {
//       return res.status(200).json({
//         success: true,
//         totalRecords: 0,
//         data: [],
//       });
//     }

//     // Step6️⃣: Latest Tax Year Records
//     const latestYear = await TransMast.max("FinanceYear");
//     const trans = await TransMast.findAll({
//       where: {
//         OwnerID: { [Op.in]: validUCIDs },
//         FinanceYear: latestYear
//       },
//       attributes: ["OwnerID", "RateableValue", "PropertyTax", "TaxTotal"],
//       raw: true
//     });

//     const taxMap = {};
//     trans.forEach(t => {
//       taxMap[t.OwnerID] = {
//         RateableValue: t.RateableValue || 0,
//         PropertyTax: t.PropertyTax || 0,
//         TaxTotal: t.TaxTotal || 0,
//       };
//     });

//     // Step7️⃣: Final Mapping
//     let finalResult = filteredProperties.map(pm => ({
//       ownerIDs: pm.OwnerID,
//       NewZoneNo: pm.NewZoneNo,
//       WardNo: pm.NewWardNo,
//       PropertyNo: pm.NewPropertyNo,
//       PartitionNo: pm.NewPartitionNo,

//       OldWardNo: ownerOldData[pm.OwnerID]?.OldWardNo || "",
//       OldPropertyNo: ownerOldData[pm.OwnerID]?.OldPropertyNo || "",
//       OldPartitionNo: ownerOldData[pm.OwnerID]?.OldPartitionNo || "",

//       MarathiOwnerName: ownerMap[pm.OwnerID]?.MarathiOwnerName || "",
//       MarathiRenterName: ownerMap[pm.OwnerID]?.MarathiRenterName || "",
//       ImaratName: pm.BuildingOrShopNameMarathi || "",
//       PropertyDescription: typeMap[pm.PropertyTypeID] || "",
//       Address: pm.OwnerPatta || "",

//       TotalArea: pdnMap[pm.OwnerID]?.TotalArea || 0,
//       TotalRent: pdnMap[pm.OwnerID]?.TotalRent || 0,

//       ProposedRV: taxMap[pm.OwnerID]?.RateableValue || 0,
//       ProposedPropertyTax: taxMap[pm.OwnerID]?.PropertyTax || 0,
//       ProposedTotalTax: taxMap[pm.OwnerID]?.TaxTotal || 0,
//     }));

//     // Step8️⃣: Sorting Alphanumeric
//     finalResult.sort((a, b) =>
//       a.WardNo - b.WardNo ||
//       a.PropertyNo - b.PropertyNo ||
//       a.PartitionNo - b.PartitionNo
//     );

//     res.status(200).json({
//       success: true,
//       totalRecords: finalResult.length,
//       data: finalResult,
//     });

//   } catch (error) {
//     console.error("❌ UC/UCC Report API Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

export const getCommercialUCReport = async (req, res) => {
  try {
    let { wardNos, percentage } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Ward Numbers",
      });
    }

    if (percentage === undefined || percentage === null || percentage === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide Percentage value",
      });
    }

    percentage = parseFloat(percentage);

    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "PropertyTypeID",
      ],
      where: {
        NewWardNo: { [Op.in]: wardNos }
      },
      raw: true,
      nest: true
    });

    if (!properties.length) {
      return res.status(200).json({
        success: true,
        totalRecords: 0,
        data: [],
      });
    }

    const ownerIDs = properties.map(p => p.OwnerID);

    // ---------------- STEP 2: OWNER NAMES ----------------
    const ownerNames = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const ownerMap = {};
    ownerNames.forEach(n => {
      ownerMap[n.OwnerID] = {
        MarathiOwnerName: n.MarathiOwnerName,
        MarathiRenterName: n.MarathiRenterName,
      };
    });

    // ---------------- STEP 3: OLD PROPERTY DATA ----------------
    const oldData = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const ownerOldData = {};
    oldData.forEach(od => {
      ownerOldData[od.OwnerID] = {
        OldWardNo: od.OldWardNo,
        OldPropertyNo: od.OldPropertyNo,
        OldPartitionNo: od.OldPartitionNo,
        OldRV: od.OldRV || 0,
        OldPropertyTax: od.OldPropertyTax || 0,
        OldTotalTax: od.OldTotalTax || 0
      };
    });

    // ---------------- STEP 4: PROPERTY TYPE ----------------
    const propertyTypes = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true
    });

    const typeMap = {};
    propertyTypes.forEach(t => {
      typeMap[t.PropertyTypeID] = t.PropertyDescription;
    });

    // ---------------- STEP 5: ONLY UC / UCC RECORDS ----------------
    const pdns = await PropertyDetailsNew.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        TypeOFUse: { [Op.in]: ["UC", "UCC"] },
      },
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
      ],
      group: ["OwnerID"],
      raw: true
    });

    const pdnMap = {};
    const validUCIDs = [];
    pdns.forEach(p => {
      pdnMap[p.OwnerID] = {
        TotalArea: p.TotalArea || 0,
        TotalRent: p.TotalRent || 0,
      };
      validUCIDs.push(p.OwnerID);
    });

    // Filter only UC/UCC owners
    const filteredProperties = properties.filter(pm => validUCIDs.includes(pm.OwnerID));

    if (!filteredProperties.length) {
      return res.status(200).json({
        success: true,
        totalRecords: 0,
        data: [],
      });
    }

    // ---------------- STEP 6: LATEST YEAR TAX ----------------
    const latestYear = await TransMast.max("FinanceYear");
    const trans = await TransMast.findAll({
      where: {
        OwnerID: { [Op.in]: validUCIDs },
        FinanceYear: latestYear
      },
      attributes: ["OwnerID", "RateableValue", "PropertyTax", "TaxTotal"],
      raw: true
    });

    const taxMap = {};
    trans.forEach(t => {
      taxMap[t.OwnerID] = {
        RateableValue: t.RateableValue || 0,
        PropertyTax: t.PropertyTax || 0,
        TaxTotal: t.TaxTotal || 0,
      };
    });

    // ---------------- STEP 7: FINAL MAPPING + % FILTER ----------------
    let finalResult = filteredProperties
      .map(pm => {

        const oldRV = ownerOldData[pm.OwnerID]?.OldRV || 0;
        const newRV = taxMap[pm.OwnerID]?.RateableValue || 0;

        // Calculate Percentage
        const RVChangePercent =
          oldRV > 0 ? ((newRV - oldRV) / oldRV) * 100 : null;

        // 🔥 APPLY % FILTER (same as old NTIS UI)
        if (RVChangePercent === null || RVChangePercent < percentage) {
          return null;
        }

        return {
          ownerIDs: pm.OwnerID,
          NewZoneNo: pm.NewZoneNo,
          WardNo: pm.NewWardNo,
          PropertyNo: pm.NewPropertyNo,
          PartitionNo: pm.NewPartitionNo,

          OldWardNo: ownerOldData[pm.OwnerID]?.OldWardNo || "",
          OldPropertyNo: ownerOldData[pm.OwnerID]?.OldPropertyNo || "",
          OldPartitionNo: ownerOldData[pm.OwnerID]?.OldPartitionNo || "",

          MarathiOwnerName: ownerMap[pm.OwnerID]?.MarathiOwnerName || "",
          MarathiRenterName: ownerMap[pm.OwnerID]?.MarathiRenterName || "",
          ImaratName: pm.BuildingOrShopNameMarathi || "",
          PropertyDescription: typeMap[pm.PropertyTypeID] || "",
          Address: pm.OwnerPatta || "",

          TotalArea: pdnMap[pm.OwnerID]?.TotalArea || 0,
          TotalRent: pdnMap[pm.OwnerID]?.TotalRent || 0,

          ProposedRV: newRV,
          ProposedPropertyTax: taxMap[pm.OwnerID]?.PropertyTax || 0,
          ProposedTotalTax: taxMap[pm.OwnerID]?.TaxTotal || 0,

          OldRV: oldRV,
          OldPropertyTax: ownerOldData[pm.OwnerID]?.OldPropertyTax || 0,
          OldTotalTax: ownerOldData[pm.OwnerID]?.OldTotalTax || 0,

          RVChangePercent: RVChangePercent.toFixed(2)
        };
      })
      .filter(item => item !== null);

    // ---------------- STEP 8: SORTING ----------------
    finalResult.sort((a, b) =>
      a.WardNo - b.WardNo ||
      a.PropertyNo - b.PropertyNo ||
      a.PartitionNo - b.PartitionNo
    );

    // ---------------- SEND RESPONSE ----------------
    res.status(200).json({
      success: true,
      totalRecords: finalResult.length,
      data: finalResult,
    });

  } catch (error) {
    console.error("❌ UC/UCC Report API Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//under construction apply..
export const getUnderConstructionReport = async (req, res) => {
  try {
    const { wardNos } = req.body;
    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide Ward Numbers" });
    }

    // ---------------- STEP 1: PROPERTIES ----------------
    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "PropertyTypeID"
      ],
      where: { NewWardNo: { [Op.in]: wardNos } },
      raw: true
    });
    if (!properties.length) return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    const ownerIDs = properties.map(p => p.OwnerID);

    // ---------------- STEP 2: OWNER NAMES ----------------
    const ownerNames = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName","MarathiOccupierName"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });
    const ownerMap = {};
    ownerNames.forEach(o => {
      ownerMap[o.OwnerID] = { MarathiOwnerName: o.MarathiOwnerName, MarathiRenterName: o.MarathiRenterName };
    });

    // ---------------- STEP 3: OLD PROPERTY DATA ----------------
    const oldData = await OldPropertyMast.findAll({
      attributes: ["OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo", "OldRV", "OldPropertyTax", "OldTotalTax"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });
    const oldMap = {};
    oldData.forEach(o => {
      oldMap[o.OwnerID] = {
        OldWardNo: o.OldWardNo,
        OldPropertyNo: o.OldPropertyNo,
        OldPartitionNo: o.OldPartitionNo,
        OldRV: o.OldRV || 0,
        OldPropertyTax: o.OldPropertyTax || 0,
        OldTotalTax: o.OldTotalTax || 0
      };
    });

    // ---------------- STEP 4: PROPERTY TYPES ----------------
    const types = await PropertyTypeMaster.findAll({ attributes: ["PropertyTypeID", "PropertyDescription"], raw: true });
    const typeMap = {};
    types.forEach(t => typeMap[t.PropertyTypeID] = t.PropertyDescription);

    // ---------------- STEP 5: UC/UCC RECORDS ----------------
    const pdns = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs }, TypeOFUse: { [Op.in]: ["UC", "UCC"] } },
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
      ],
      group: ["OwnerID"],
      raw: true
    });
    const pdnMap = {};
    const validUCIDs = [];
    pdns.forEach(p => {
      pdnMap[p.OwnerID] = { TotalArea: p.TotalArea || 0, TotalRent: p.TotalRent || 0 };
      validUCIDs.push(p.OwnerID);
    });

    // ---------------- STEP 6: LATEST TAX PER OWNER ----------------
    const trans = await TransMast.findAll({
      attributes: [
        "OwnerID",
        "RateableValue",
        "PropertyTax",
        "TaxTotal",
        "FinanceYear",
        [Sequelize.literal(`ROW_NUMBER() OVER(PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
      ],
      where: { OwnerID: { [Op.in]: validUCIDs } },
      raw: true
    });
    const taxMap = {};
    trans.forEach(t => {
      if (t.rn === 1) {
        taxMap[t.OwnerID] = {
          RateableValue: t.RateableValue || 0,
          PropertyTax: t.PropertyTax || 0,
          TaxTotal: t.TaxTotal || 0
        };
      }
    });

    // ---------------- STEP 7: FINAL RESULT ----------------
    const finalResult = properties
      .filter(p => validUCIDs.includes(p.OwnerID))
      .map(p => ({
        ownerID: p.OwnerID,
        NewZoneNo: p.NewZoneNo,
        WardNo: p.NewWardNo,
        PropertyNo: p.NewPropertyNo,
        PartitionNo: p.NewPartitionNo,
        OldWardNo: oldMap[p.OwnerID]?.OldWardNo || "",
        OldPropertyNo: oldMap[p.OwnerID]?.OldPropertyNo || "",
        OldPartitionNo: oldMap[p.OwnerID]?.OldPartitionNo || "",
        MarathiOwnerName: ownerMap[p.OwnerID]?.MarathiOwnerName || "",
        MarathiRenterName: ownerMap[p.OwnerID]?.MarathiRenterName || "",
        MarathiOccupierName:ownerMap[p.OwnerID]?.MarathiOccupierName || "",
        ImaratName: p.BuildingOrShopNameMarathi || "",
        PropertyDescription: typeMap[p.PropertyTypeID] || "",
        Address: p.OwnerPatta || "",
        TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
        TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0,
        ProposedRV: taxMap[p.OwnerID]?.RateableValue || 0,
        ProposedPropertyTax: taxMap[p.OwnerID]?.PropertyTax || 0,
        ProposedTotalTax: taxMap[p.OwnerID]?.TaxTotal || 0,
        OldRV: oldMap[p.OwnerID]?.OldRV || 0,
        OldPropertyTax: oldMap[p.OwnerID]?.OldPropertyTax || 0,
        OldTotalTax: oldMap[p.OwnerID]?.OldTotalTax || 0
      }));

    // ---------------- STEP 8: SORT ----------------
    finalResult.sort((a, b) =>
      a.WardNo.localeCompare(b.WardNo) ||
      a.PropertyNo.localeCompare(b.PropertyNo) ||
      a.PartitionNo.localeCompare(b.PartitionNo)
    );

    res.status(200).json({ success: true, totalRecords: finalResult.length, data: finalResult });
  } catch (err) {
    console.error("UC/UCC Report API Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
//Property Description Mismatch Property apply...
export const getPropertyReportMismatch = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Ward Numbers",
      });
    }

    // STEP 1: Fetch properties for wards with Status = 1
    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "PropertyTypeID",
        "Status"
      ],
      where: { NewWardNo: { [Op.in]: wardNos }, Status: 1 },
      raw: true,
    });

    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = properties.map(p => p.OwnerID);

    // STEP 2: Fetch owner names
    const ownerNames = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true,
    });

    const ownerMap = {};
    ownerNames.forEach(o => {
      ownerMap[o.OwnerID] = {
        MarathiOwnerName: o.MarathiOwnerName,
        MarathiRenterName: o.MarathiRenterName
      };
    });

    // STEP 3: Aggregate area & rent
    const pdns = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      group: ["OwnerID"],
      having: Sequelize.literal("SUM(CarpetAreaSqFeet) > 0"),
      raw: true,
    });

    const pdnMap = {};
    pdns.forEach(p => {
      pdnMap[p.OwnerID] = {
        TotalArea: +p.TotalArea || 0,
        TotalRent: +p.TotalRent || 0
      };
    });

    // STEP 4: PropertyType map (both Type and Description)
    const types = await PropertyTypeMaster.findAll({ raw: true });
    const typeMapDesc = {}; // For display
    const typeMapCode = {}; // For filtering
    types.forEach(t => {
      typeMapDesc[t.PropertyTypeID] = t.PropertyDescription; 
      typeMapCode[t.PropertyTypeID] = t.Type;              
    });

    // STEP 5: Latest finance year tax
    const trans = await TransMast.findAll({
      attributes: [
        "OwnerID",
        "RateableValue",
        "PropertyTax",
        "TaxTotal",
        "EmploymentTax",
        "FinanceYear",
        [Sequelize.literal(`ROW_NUMBER() OVER(PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const taxMap = {};
    trans.forEach(t => {
      if (t.rn === 1) {
        taxMap[t.OwnerID] = {
          ProposedRV: +t.RateableValue || 0,
          ProposedPropertyTax: +t.PropertyTax || 0,
          ProposedTotalTax: +t.TaxTotal || 0,
          EmploymentTax: +t.EmploymentTax || 0
        };
      }
    });

    // STEP 6: Apply EmploymentTax logic using Type code
    const filteredOwnerIDs = properties
      .filter(p => {
        const tax = taxMap[p.OwnerID];
        if (!tax) return false;
        const typeCode = typeMapCode[p.PropertyTypeID] || "";
        return (
          (["R", "N"].includes(typeCode) && tax.EmploymentTax > 0) ||
          (["C", "I", "R-C", "R-I", "I-C"].includes(typeCode) && tax.EmploymentTax <= 0)
        );
      })
      .map(p => p.OwnerID);

    // STEP 7: Final result mapping (with PropertyDescription)
    const finalResult = properties
      .filter(p => filteredOwnerIDs.includes(p.OwnerID))
      .map(p => ({
        OwnerID: p.OwnerID,
        NewZoneNo: p.NewZoneNo,
        WardNo: p.NewWardNo,
        PropertyNo: p.NewPropertyNo,
        PartitionNo: p.NewPartitionNo,
        MarathiOwnerName: ownerMap[p.OwnerID]?.MarathiOwnerName || "",
        MarathiRenterName: ownerMap[p.OwnerID]?.MarathiRenterName || "",
        ImaratName: p.BuildingOrShopNameMarathi || "",
        Address: p.OwnerPatta || "",
        Type: typeMapCode[p.PropertyTypeID] || "",
        PropertyDescription: typeMapDesc[p.PropertyTypeID] || "",
        TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
        TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0,
        ProposedRV: taxMap[p.OwnerID]?.ProposedRV || 0,
        ProposedPropertyTax: taxMap[p.OwnerID]?.ProposedPropertyTax || 0,
        ProposedTotalTax: taxMap[p.OwnerID]?.ProposedTotalTax || 0
      }));

    // STEP 8: AlphaNum sort
    const alphaNum = str => str ? str.replace(/\d+/g, n => n.padStart(10, "0")) : "";
    finalResult.sort((a, b) =>
      alphaNum(a.WardNo).localeCompare(alphaNum(b.WardNo)) ||
      alphaNum(a.PropertyNo).localeCompare(alphaNum(b.PropertyNo)) ||
      alphaNum(a.PartitionNo).localeCompare(alphaNum(b.PartitionNo))
    );

    // STEP 9: Return
    return res.status(200).json({
      success: true,
      totalRecords: finalResult.length,
      data: finalResult
    });

  } catch (err) {
    console.error("Mismatch Report API Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

//Bank , Tower , office without Rent apply..
export const getSpecialPropertyWithoutRent = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    const specialTypes = [
      'बँक/वित्तीय संस्था',
      'मोबाईल टॉवर',
      'कार्यालय',
      'वसतिगृह'
    ];

    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      include: [
        {
          model: PropertyTypeMaster,
          attributes: ['PropertyTypeID', 'PropertyDescription'],
          where: { PropertyDescription: { [Op.in]: specialTypes } } 
        }
      ],
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "PropertyTypeID",
        "Address"
      ]
    });

    const ownerIds = properties.map(p => p.OwnerID);

    if (ownerIds.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 2️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'MarathiOwnerName', 'MarathiOccupierName']
    });
    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || "",
        renterName: o.MarathiRenterName || ""
      };
    });

    // Step 3️⃣: Fetch PropertyDetailsNew and sum rent & area
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds }, RenterYesNO: 1 },
      attributes: ['OwnerID', 'Rent', 'CarpetAreaSqFeet', 'CarpetAreaSqMeter']
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      if (Number(pd.Rent) <= 0) {
        const ownerId = pd.OwnerID;
        const rent = Number(pd.Rent) || 0;
        const sqft = Number(pd.CarpetAreaSqFeet) || 0;
        const sqm = Number(pd.CarpetAreaSqMeter) || 0;
        if (!propertyDetailsMap[ownerId]) {
          propertyDetailsMap[ownerId] = { rent, carpetAreaSqFeet: sqft, carpetAreaSqMeter: sqm };
        } else {
          propertyDetailsMap[ownerId].rent += rent;
          propertyDetailsMap[ownerId].carpetAreaSqFeet += sqft;
          propertyDetailsMap[ownerId].carpetAreaSqMeter += sqm;
        }
      }
    });

    // Step 4️⃣: Fetch OldPropertyMast
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'OldWardNo', 'OldPropertyNo', 'OldPartitionNo', 'OldRV', 'OldPropertyTax', 'OldTotalTax']
    });
    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      oldPropertyMap[op.OwnerID] = {
        oldWard: op.OldWardNo || "",
        oldProperty: op.OldPropertyNo || "",
        oldPart: op.OldPartitionNo || "",
        oldRV: op.OldRV || null,
        oldPropertyTax: op.OldPropertyTax || null,
        oldTotalTax: op.OldTotalTax || null
      };
    });

    // Step 5️⃣: Fetch TransMast for latest FinanceYear
    const transRecords = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'RateableValue', 'PropertyTax', 'TaxTotal', 'FinanceYear']
    });

    const transMap = {};
    transRecords.forEach(tr => {
      const existing = transMap[tr.OwnerID];
      if (!existing || tr.FinanceYear > existing.FinanceYear) {
        transMap[tr.OwnerID] = {
          rateableValue: tr.RateableValue,
          propertyTax: tr.PropertyTax,
          taxTotal: tr.TaxTotal,
          financeYear: tr.FinanceYear
        };
      }
    });

    // Step 6️⃣: Merge final response
    const result = properties
      .filter(p => propertyDetailsMap[p.OwnerID])
      .map(p => {
        const names = ownerNameMap[p.OwnerID] || {};
        const oldProp = oldPropertyMap[p.OwnerID] || {};
        const trans = transMap[p.OwnerID] || {};
        const propDetail = propertyDetailsMap[p.OwnerID] || {};

        return {
          ownerId: p.OwnerID,
          ownerName: names.ownerName,
          MarathiOccupierName: names.MarathiOccupierName,
          newZoneNo: p.NewZoneNo,
          newWardNo: p.NewWardNo,
          newPropertyNo: p.NewPropertyNo,
          newPart: p.NewPartitionNo,
          address: p.Address,
          buildingName: p.BuildingOrShopNameMarathi,
          propertyDesc: p.PropertyTypeMaster.PropertyDescription,
          rent: propDetail.rent,
          carpetAreaSqFeet: propDetail.carpetAreaSqFeet,
          carpetAreaSqMeter: propDetail.carpetAreaSqMeter,
          oldWard: oldProp.oldWard,
          oldProperty: oldProp.oldProperty,
          oldPart: oldProp.oldPart,
          oldRV: oldProp.oldRV,
          oldPropertyTax: oldProp.oldPropertyTax,
          oldTotalTax: oldProp.oldTotalTax,
          rateableValue: trans.rateableValue,
          propertyTax: trans.propertyTax,
          taxTotal: trans.taxTotal,
          financeYear: trans.financeYear
        };
      });

    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result
    });

  } catch (error) {
    console.error("❌ Special Property Without Rent API Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Total Tax is greter than 100000 apply..
export const getHighTaxPropertiesReport = async (req, res) => {
  try {
    const { wardNos } = req.body;
    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide Ward Numbers" });
    }

    // ---------------- STEP 1: PROPERTIES ----------------
    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
       
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "PropertyTypeID",
        
      ],
      where: { NewWardNo: { [Op.in]: wardNos } },
      raw: true
    });

    if (!properties.length) return res.status(200).json({ success: true, totalRecords: 0, data: [] });

    const ownerIDs = properties.map(p => p.OwnerID);

    // ---------------- STEP 2: OWNER NAMES ----------------
    const ownerNames = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const ownerMap = {};
    ownerNames.forEach(o => {
      ownerMap[o.OwnerID] = { MarathiOwnerName: o.MarathiOwnerName, MarathiRenterName: o.MarathiRenterName };
    });

    // ---------------- STEP 3: PROPERTY TYPES ----------------
    const types = await PropertyTypeMaster.findAll({ attributes: ["PropertyTypeID", "PropertyDescription"], raw: true });
    const typeMap = {};
    types.forEach(t => typeMap[t.PropertyTypeID] = t.PropertyDescription);

    // ---------------- STEP 4: PROPERTY DETAILS (SUM AREA & RENT) ----------------
    const pdns = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
      ],
      include: [
        {
          model: TypeofUseMaster,
          as: "typeofUseMaster",
          attributes: [],
        }
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      group: ["OwnerID"],
      raw: true
    });

    const pdnMap = {};
    pdns.forEach(p => {
      pdnMap[p.OwnerID] = { TotalArea: p.TotalArea || 0, TotalRent: p.TotalRent || 0 };
    });
     // ⭐ STEP 4: Fetch OldPropertyMast
const oldProperties = await OldPropertyMast.findAll({
  where: { OwnerID: { [Op.in]: ownerIDs } },
  raw: true
});

const oldPropertyMap = {};
oldProperties.forEach(op => {
  oldPropertyMap[op.OwnerID] = {
    OldWardNo: op.OldWardNo || "",
    OldPropertyNo: op.OldPropertyNo || "",
    OldPartitionNo: op.OldPartitionNo || "",
    OldRV: op.OldRV || 0,
    OldPropertyTax: op.OldPropertyTax || 0,
    OldTotalTax: op.OldTotalTax || 0
  };
});

    // ---------------- STEP 5: LATEST TAX PER OWNER ----------------
    const trans = await TransMast.findAll({
      attributes: [
        "OwnerID",
        "RateableValue",
        "PropertyTax",
        "TaxTotal",
        "FinanceYear",
        [Sequelize.literal(`ROW_NUMBER() OVER(PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
      ],
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        TaxTotal: { [Op.gte]: 100000 }   // TaxTotal >= 100k
      },
      raw: true
    });

    const taxMap = {};
    trans.forEach(t => {
      if (t.rn === 1) {
        taxMap[t.OwnerID] = {
          ProposedRV: t.RateableValue || 0,
          ProposedPropertyTax: t.PropertyTax || 0,
          ProposedTotalTax: t.TaxTotal || 0
        };
      }
    });

    // ---------------- STEP 6: FINAL RESULT ----------------
    const finalResult = properties
      .filter(p => taxMap[p.OwnerID])  
      .map(p => ({
        ownerID: p.OwnerID,
        NewZoneNo: p.NewZoneNo,
        WardNo: p.NewWardNo,
        PropertyNo: p.NewPropertyNo,
        PartitionNo: p.NewPartitionNo,
        // OldWardNo: p.OldWardNo || "",
        // OldPropertyNo: p.OldPropertyNo || "",
        // OldPartitionNo: p.OldPartitionNo || "",
        MarathiOwnerName: ownerMap[p.OwnerID]?.MarathiOwnerName || "",
        MarathiRenterName: ownerMap[p.OwnerID]?.MarathiRenterName || "",
        ImaratName: p.BuildingOrShopNameMarathi || "",
        PropertyDescription: typeMap[p.PropertyTypeID] || "",
        Address: p.MarathiOwnerPatta || "",
        TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
        TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0,
        ProposedRV: taxMap[p.OwnerID]?.ProposedRV || 0,
        ProposedPropertyTax: taxMap[p.OwnerID]?.ProposedPropertyTax || 0,
        ProposedTotalTax: taxMap[p.OwnerID]?.ProposedTotalTax || 0,
    OldWardNo: oldPropertyMap[p.OwnerID]?.OldWardNo || "",
    OldPropertyNo: oldPropertyMap[p.OwnerID]?.OldPropertyNo || "",
    OldPartitionNo: oldPropertyMap[p.OwnerID]?.OldPartitionNo || "",
    OldRV: oldPropertyMap[p.OwnerID]?.OldRV || 0,
    OldPropertyTax: oldPropertyMap[p.OwnerID]?.OldPropertyTax || 0,
    OldTotalTax: oldPropertyMap[p.OwnerID]?.OldTotalTax || 0,

      }));

    // ---------------- STEP 7: SORT ----------------
    finalResult.sort((a, b) =>
      a.NewZoneNo.localeCompare(b.NewZoneNo) ||
      a.WardNo.localeCompare(b.WardNo) ||
      a.PropertyNo.localeCompare(b.PropertyNo) ||
      a.PartitionNo.localeCompare(b.PartitionNo)
    );

    res.status(200).json({ success: true, totalRecords: finalResult.length, data: finalResult });

  } catch (err) {
    console.error("High Tax Properties API Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
//Total Tax in Between Given Range apply..
export const getPropertyTaxRangeReport = async (req, res) => {
  try {
    const { PropertyTypeID, fromProperty, toProperty } = req.body;

    if (!fromProperty || !toProperty) {
      return res.status(400).json({ success: false, message: "Property number range required" });
    }

    // ---------------- STEP 1️⃣ FILTER PROPERTIES ----------------
    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "PropertyTypeID"
      ],
      where: {
        [Op.and]: [
          // Numeric comparison of NewPropertyNo
          Sequelize.where(
            Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"),
            { [Op.between]: [fromProperty, toProperty] }
          ),
          // Filter by PropertyTypeID if provided
          ...(PropertyTypeID?.length > 0
            ? [{ PropertyTypeID: { [Op.in]: PropertyTypeID } }]
            : [])
        ]
      },
      raw: true
    });

    if (!properties.length) 
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });

    const ownerIDs = properties.map(p => p.OwnerID);

    // ---------------- STEP 2️⃣ OWNER NAMES ----------------
    const ownerNames = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const ownerMap = {};
    ownerNames.forEach(o => {
      ownerMap[o.OwnerID] = { MarathiOwnerName: o.MarathiOwnerName, MarathiRenterName: o.MarathiRenterName };
    });
 // ---------------- STEP  oldOWNER NAMES ----------------
 const oldProp = await OldPropertyMast.findAll({
  attributes: ["OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo", "OldRV", "OldPropertyTax", "OldTotalTax"],
  where: { OwnerID: { [Op.in]: ownerIDs } },
  raw: true
});

const oldMap = {};
oldProp.forEach(o => {
  oldMap[o.OwnerID] = { 
    OldWardNo: o.OldWardNo,
    OldPropertyNo: o.OldPropertyNo,
    OldPartitionNo: o.OldPartitionNo,
    OldRV: o.OldRV || 0,
    OldPropertyTax: o.OldPropertyTax || 0,
    OldTotalTax: o.OldTotalTax || 0
    };
});
    // ---------------- STEP 3️⃣ PROPERTY TYPE NAMES ----------------
    const types = await PropertyTypeMaster.findAll({ raw: true });
    const typeMap = {};
    types.forEach(t => typeMap[t.PropertyTypeID] = t.PropertyDescription);

    // ---------------- STEP 4️⃣ PROPERTY DETAILS → SUM AREA + RENT ----------------
    const pdns = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      group: ["OwnerID"],
      raw: true
    });

    const pdnMap = {};
    pdns.forEach(p => pdnMap[p.OwnerID] = p);

    // ---------------- STEP 5️⃣ LATEST TAX PER OWNER ----------------
    const trans = await TransMast.findAll({
      attributes: [
        "OwnerID",
        "RateableValue",
        "PropertyTax",
        "TaxTotal",
        "FinanceYear",
        [Sequelize.literal(`ROW_NUMBER() OVER (PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const taxMap = {};
    trans.forEach(t => {
      if (t.rn === 1) {
        taxMap[t.OwnerID] = {
          ProposedRV: t.RateableValue || 0,
          ProposedPropertyTax: t.PropertyTax || 0,
          ProposedTotalTax: t.TaxTotal || 0
        };
      }
    });

    // ---------------- STEP 6️⃣ FINAL RESULT MERGE ----------------
    const finalResult = properties.map(p => ({
      ownerID: p.OwnerID,
      NewZoneNo: p.NewZoneNo,
      WardNo: p.NewWardNo,
      PropertyNo: p.NewPropertyNo,
      PartitionNo: p.NewPartitionNo || "",
      OwnerName: ownerMap[p.OwnerID]?.MarathiOwnerName || "",
      RenterName: ownerMap[p.OwnerID]?.MarathiRenterName || "",
      ImaratName: p.BuildingOrShopNameMarathi || "",
      OwnerPatta:p.OwnerPatta || "",
      PropertyDescription: typeMap[p.PropertyTypeID] || "",
      TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
      TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0,
      ProposedRV: taxMap[p.OwnerID]?.ProposedRV || 0,
      ProposedPropertyTax: taxMap[p.OwnerID]?.ProposedPropertyTax || 0,
      ProposedTotalTax: taxMap[p.OwnerID]?.ProposedTotalTax || 0,
      OldWardNo: oldMap[p.OwnerID]?.OldWardNo || "",
      OldPropertyNo: oldMap[p.OwnerID]?.OldPropertyNo || "",
      OldPartitionNo: oldMap[p.OwnerID]?.OldPartitionNo || "",
      OldRV: oldMap[p.OwnerID]?.OldRV || 0,
      OldPropertyTax: oldMap[p.OwnerID]?.OldPropertyTax || 0,
      OldTotalTax: oldMap[p.OwnerID]?.OldTotalTax || 0,
    
    }));

    // ---------------- STEP 7️⃣ SORTING ----------------
    finalResult.sort((a, b) =>
      Number(a.WardNo.replace(/\D/g,'')) - Number(b.WardNo.replace(/\D/g,'')) || 
      Number(a.PropertyNo) - Number(b.PropertyNo) || 
      (a.PartitionNo || "").localeCompare(b.PartitionNo || "")
    );

    return res.status(200).json({
      success: true,
      totalRecords: finalResult.length,
      data: finalResult
    });

  } catch (error) {
    console.error("Tax Range Report Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//Properties having old propery no but it's old Tax and Old RV is zero //Only Properties with OldPropertyNo not blank & not “new”,OldTotalTax = '', null, 0,OldRV = '', null, 0 ,Combined properties excluded (CombPropRemark <> ‘Yes’),Group by Owner → Sum CarpetArea + Rent
export const getPropertiesWithZeroOldTax = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide ward No(s)",
      });
    }

    // ---------------- STEP 1️⃣: Get Properties from PropertyMast ----------------
    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "PropertyTypeID"
      ],
      where: {
        NewWardNo: { [Op.in]: wardNos },
        CombPropRemark: { [Op.ne]: "Yes" }
      },
      raw: true
    });

    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = properties.map(p => p.OwnerID);

    // ---------------- STEP 2️⃣: Get Old Tax Details from OldPropertyMast ----------------
    const oldDetails = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        OldTotalTax: { [Op.gt]: 0 } // OldTotalTax > 0 as per SQL
      },
      raw: true
    });

    if (!oldDetails.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const oldMap = {};
    oldDetails.forEach(o => oldMap[o.OwnerID] = o);

    // ---------------- STEP 3️⃣: Filter Properties having OldTax ----------------
    const filteredProp = properties.filter(p => oldMap[p.OwnerID]);
    const filteredOwnerIDs = filteredProp.map(p => p.OwnerID);

    // ---------------- STEP 4️⃣: Get Owner & Renter Names ----------------
    const ownerNames = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      raw: true
    });

    const ownerMap = {};
    ownerNames.forEach(o => ownerMap[o.OwnerID] = o);

    // ---------------- STEP 5️⃣: Sum Area & Rent from PropertyDetailsNew ----------------
    const pdns = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      group: ["OwnerID"],
      raw: true
    });

    const pdnMap = {};
    pdns.forEach(p => pdnMap[p.OwnerID] = p);

    // ---------------- STEP 6️⃣: Latest Proposed Tax from TransMast ----------------
    const transData = await TransMast.findAll({
      attributes: [
        "OwnerID",
        "RateableValue",
        "PropertyTax",
        "TaxTotal",
        "FinanceYear",
        [Sequelize.literal(`ROW_NUMBER() OVER (PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
      ],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      raw: true
    });

    const taxMap = {};
    transData.forEach(t => {
      if (t.rn === 1 && t.TaxTotal <= 0) {  
        taxMap[t.OwnerID] = t;
      }
    });

    // ---------------- STEP 7️⃣: Final Merge ----------------
    const final = filteredProp
      .filter(p => taxMap[p.OwnerID]) 
      .map(p => {
        const old = oldMap[p.OwnerID] || {};
        const tax = taxMap[p.OwnerID] || {};
        return {
          ownerID: p.OwnerID,
          NewZoneNo: p.NewZoneNo,
          WardNo: p.NewWardNo,
          PropertyNo: p.NewPropertyNo,
          PartitionNo: p.NewPartitionNo || "",

          OldWardNo: old.OldWardNo || "",
          OldPropertyNo: old.OldPropertyNo || "",
          OldPartitionNo: old.OldPartitionNo || "",
          OldRV: old.OldRV || 0,
          OldPropertyTax: old.OldPropertyTax || 0,
          OldTotalTax: old.OldTotalTax || 0,

          OwnerName: ownerMap[p.OwnerID]?.MarathiOwnerName || "",
          RenterName: ownerMap[p.OwnerID]?.MarathiRenterName || "",
          ImaratName: p.BuildingOrShopNameMarathi || "",
          PropertyDescription: "", 
          Address: p.OwnerPatta || "",
          TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
          TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0,

          ProposedRV: tax.RateableValue || 0,
          ProposedPropertyTax: tax.PropertyTax || 0,
          ProposedTotalTax: tax.TaxTotal || 0
        };
      });

    // ---------------- STEP 8️⃣: Sorting ----------------
    final.sort((a, b) => {
      return a.WardNo.localeCompare(b.WardNo, undefined, { numeric: true }) ||
        a.PropertyNo.localeCompare(b.PropertyNo, undefined, { numeric: true }) ||
        a.PartitionNo.localeCompare(b.PartitionNo, undefined, { numeric: true });
    });

    return res.status(200).json({
      success: true,
      totalRecords: final.length,
      data: final
    });

  } catch (err) {
    console.error("Error in getPropertiesWithZeroOldTax:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


//Property have old Tax but Net Tax is Zero apply
export const getPropertiesOldTaxNewTaxMissing = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide NewWardNo(s)",
      });
    }

    // STEP 1️⃣: Get OwnerIDs ward wise
    const properties = await PropertyMast.findAll({
      attributes: ["OwnerID", "NewZoneNo", "NewWardNo", "NewPropertyNo", "NewPartitionNo"],
      where: {
        NewWardNo: { [Op.in]: wardNos },
        CombPropRemark: { [Op.ne]: "Yes" }
      },
      raw: true
    });

    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = properties.map(p => p.OwnerID);

    // STEP 2️⃣: Old Tax Exists Check
    const oldDetails = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        OldTotalTax: { [Op.notIn]: ["", null, 0] }
      },
      raw: true
    });

    const oldMap = {};
    oldDetails.forEach(o => oldMap[o.OwnerID] = o);

    const validOwners = oldDetails.map(o => o.OwnerID);

    // STEP 3️⃣: Latest Proposed Tax - should be missing
    const transData = await TransMast.findAll({
      attributes: [
        "OwnerID",
        "FinanceYear",
        "TaxTotal",
        [Sequelize.literal(`ROW_NUMBER() OVER (PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
      ],
      where: { OwnerID: { [Op.in]: validOwners } },
      raw: true
    });

    const noNewTaxOwners = transData
      .filter(t => t.rn === 1 && (t.TaxTotal === "" || t.TaxTotal === null))
      .map(t => t.OwnerID);

    const finalOwners = properties.filter(p => noNewTaxOwners.includes(p.OwnerID));

    const filteredOwnerIDs = finalOwners.map(p => p.OwnerID);

    if (!filteredOwnerIDs.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // STEP 4️⃣: Names
    const names = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      raw: true
    });

    const nameMap = {};
    names.forEach(o => nameMap[o.OwnerID] = o);

    // STEP 5️⃣: Area & Rent SUM
    const pdns = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      group: ["OwnerID"],
      raw: true
    });

    const pdnMap = {};
    pdns.forEach(p => pdnMap[p.OwnerID] = p);

    // Step 6️⃣: Final Merge
    const final = finalOwners.map(p => {
      const old = oldMap[p.OwnerID] || {};
      return {
        ownerID: p.OwnerID,
        NewZoneNo: p.NewZoneNo,
        NewWardNo: p.NewWardNo,
        NewPropertyNo: p.NewPropertyNo,
        NewPartitionNo: p.NewPartitionNo || "",

        OldWardNo: old.OldWardNo || "",
        OldPropertyNo: old.OldPropertyNo || "",
        OldPartitionNo: old.OldPartitionNo || "",
        OldRV: old.OldRV || 0,
        OldPropertyTax: old.OldPropertyTax || 0,
        OldTotalTax: old.OldTotalTax || 0,

        OwnerName: nameMap[p.OwnerID]?.MarathiOwnerName || "",
        RenterName: nameMap[p.OwnerID]?.MarathiRenterName || "",
        TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
        TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0
      }
    });

    final.sort((a, b) => {
      return a.NewWardNo.localeCompare(b.NewWardNo, undefined, { numeric: true }) ||
        a.NewPropertyNo.localeCompare(b.NewPropertyNo, undefined, { numeric: true }) ||
        a.NewPartitionNo.localeCompare(b.NewPartitionNo, undefined, { numeric: true });
    });

    return res.status(200).json({
      success: true,
      totalRecords: final.length,
      data: final
    });

  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
//Missing Plot area list
export const getMissingPlotAreaList = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide NewWardNo(s)",
      });
    }

    // STEP 1️⃣: Get properties ward wise
    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "PropertyTypeID"
      ],
     
    where: {
      NewWardNo: { [Op.in]: wardNos },
      [Op.or]: [
        { PlotArea: null },
        { PlotArea: '' },
        { PlotArea: 0 }
      ]
    },
    raw: true
  });
    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = properties.map(p => p.OwnerID);

    // STEP 2️⃣: Get OldPropertyMast details
    const oldDetails = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const oldMap = {};
    oldDetails.forEach(o => oldMap[o.OwnerID] = o);

    // STEP 3️⃣: Owner & Renter Names
    const ownerNames = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const ownerMap = {};
    ownerNames.forEach(o => ownerMap[o.OwnerID] = o);

    // STEP 4️⃣: Property Type Description
    const propertyTypes = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true
    });

    const propertyTypeMap = {};
    propertyTypes.forEach(pt => propertyTypeMap[pt.PropertyTypeID] = pt.PropertyDescription);

    // STEP 5️⃣: Final Merge
    const final = properties.map(p => {
      const old = oldMap[p.OwnerID] || {};

      return {
        OwnerID: p.OwnerID,
        NewZoneNo: p.NewZoneNo,
        WardNo: p.NewWardNo,
        PropertyNo: p.NewPropertyNo,
        PartitionNo: p.NewPartitionNo || "",

        OldWardNo: old.OldWardNo || "",
        OldPropertyNo: old.OldPropertyNo || "",
        OldPartitionNo: old.OldPartitionNo || "",
        OldRV: old.OldRV || 0,
        OldPropertyTax: old.OldPropertyTax || 0,
        OldTotalTax: old.OldTotalTax || 0,

        OwnerName: ownerMap[p.OwnerID]?.MarathiOwnerName || "",
        RenterName: ownerMap[p.OwnerID]?.MarathiRenterName || "",
        ImaratName: p.BuildingOrShopNameMarathi || "",
        PropertyDescription: propertyTypeMap[p.PropertyTypeID] || "",
        Address: p.OwnerPatta || ""
      };
    });

    // STEP 6️⃣: Sort like SQL query
    final.sort((a, b) => {
      return a.WardNo.localeCompare(b.WardNo, undefined, { numeric: true }) ||
             a.PropertyNo.localeCompare(b.PropertyNo, undefined, { numeric: true }) ||
             a.PartitionNo.localeCompare(b.PartitionNo, undefined, { numeric: true });
    });

    return res.status(200).json({
      success: true,
      totalRecords: final.length,
      data: final
    });

  } catch (err) {
    console.error("Error in getMissingPlotAreaListQueryWise:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


//Zero tax Open Plot 48


// export const getMissingZeroTaxBuildingNameList = async (req, res) => {
//   try {
//     const { wardNos } = req.body;

//     if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide NewWardNo(s)",
//       });
//     }

//     // STEP 1️⃣: Get properties ward wise with OpenPlot = 1
//     const properties = await PropertyMast.findAll({
//       attributes: [
//         "OwnerID",
//         "NewZoneNo",
//         "NewWardNo",
//         "NewPropertyNo",
//         "NewPartitionNo",
//         "PropertyTypeID",
//         "BuildingOrShopNameMarathi",
//         "OwnerPatta",
//         "OpenPlot"
//       ],
   
//       where: {
//         NewWardNo: { [Op.in]: wardNos },
//         OpenPlot: 1 
//       },
//       raw: true
//     });

//     if (!properties.length) {
//       return res.status(200).json({ success: true, totalRecords: 0, data: [] });
//     }

//     const ownerIDs = properties.map(p => p.OwnerID);

//     // STEP 2️⃣: OldPropertyMast details
//     const oldDetails = await OldPropertyMast.findAll({
//       attributes: [
//         "OwnerID",
//         "OldWardNo",
//         "OldPropertyNo",
//         "OldPartitionNo",
//         "OldRV",
//         "OldPropertyTax",
//         "OldTotalTax"
//       ],
//       where: { OwnerID: { [Op.in]: ownerIDs } },
//       raw: true
//     });

//     const oldMap = {};
//     oldDetails.forEach(o => oldMap[o.OwnerID] = o);

//     // STEP 3️⃣: Latest proposed tax (TransMast) with TaxTotal = 0
//     const transData = await TransMast.findAll({
//       attributes: [
//         "OwnerID",
//         "FinanceYear",
//         "RateableValue",
//         "PropertyTax",
//         "TaxTotal",
//         [Sequelize.literal(`ROW_NUMBER() OVER (PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
//       ],
//       where: {
//         OwnerID: { [Op.in]: ownerIDs }
//       },
//       raw: true
//     });

//     // Filter only latest row per OwnerID where TaxTotal = 0
//     const latestTaxMap = {};
//     transData.forEach(t => {
//       if (t.rn === 1 && t.TaxTotal === 0) {
//         latestTaxMap[t.OwnerID] = t;
//       }
//     });

//     // STEP 4️⃣: Filter properties that have TaxTotal = 0
//     const filteredProperties = properties.filter(p => latestTaxMap[p.OwnerID]);

//     const filteredOwnerIDs = filteredProperties.map(p => p.OwnerID);

//     // STEP 5️⃣: Owner/Renter Names
//     const names = await CombinedOwnerName.findAll({
//       attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName","MarathiOccupierName"],
//       where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
//       raw: true
//     });

//     const nameMap = {};
//     names.forEach(n => nameMap[n.OwnerID] = n);

//     // STEP 6️⃣: PropertyDetailsNew SUM (Area & Rent)
//     const pdns = await PropertyDetailsNew.findAll({
//       attributes: [
//         "OwnerID",
//         [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
//         [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
//       ],
//       where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
//       group: ["OwnerID"],
//       raw: true
//     });

//     const pdnMap = {};
//     pdns.forEach(p => pdnMap[p.OwnerID] = p);

//     // STEP 7️⃣: Merge final
//     const final = filteredProperties.map(p => {
//       const old = oldMap[p.OwnerID] || {};
//       const ft = latestTaxMap[p.OwnerID] || {};
//       return {
//         OwnerID: p.OwnerID,
//         NewZoneNo: p.NewZoneNo,
//         NewWardNo: p.NewWardNo,
//         NewPropertyNo: p.NewPropertyNo,
//         NewPartitionNo: p.NewPartitionNo || "",
//         OldWardNo: old.OldWardNo || "",
//         OldPropertyNo: old.OldPropertyNo || "",
//         OldPartitionNo: old.OldPartitionNo || "",
//         OldRV: old.OldRV || 0,
//         OldPropertyTax: old.OldPropertyTax || 0,
//         OldTotalTax: old.OldTotalTax || 0,
//         OwnerName: nameMap[p.OwnerID]?.MarathiOwnerName || "",
//         RenterName: nameMap[p.OwnerID]?.MarathiRenterName || "",
//         MarathiOccupierName:nameMap[p.OwnerID]?.MarathiOccupierName || "",
//         BuildingOrShopName: p.BuildingOrShopNameMarathi || "",
//         OwnerPatta: p.OwnerPatta || "",
//         TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
//         TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0,
//         RateableValue: ft.RateableValue || 0,
//         PropertyTax: ft.PropertyTax || 0,
//         TaxTotal: ft.TaxTotal || 0
//       };
//     });

//     // STEP 8️⃣: Sort
//     final.sort((a, b) =>
//       a.NewWardNo.localeCompare(b.NewWardNo, undefined, { numeric: true }) ||
//       a.NewPropertyNo.localeCompare(b.NewPropertyNo, undefined, { numeric: true }) ||
//       a.NewPartitionNo.localeCompare(b.NewPartitionNo, undefined, { numeric: true })
//     );

//     return res.status(200).json({
//       success: true,
//       totalRecords: final.length,
//       data: final
//     });

//   } catch (err) {
//     console.log("Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
export const getMissingZeroTaxBuildingNameList = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide NewWardNo(s)",
      });
    }

    // STEP 1️⃣: Get properties ward wise with OpenPlot = 1
    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "PropertyTypeID",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "OpenPlot"
      ],
      where: {
        NewWardNo: { [Op.in]: wardNos },
        OpenPlot: 1
      },
      raw: true
    });

    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = properties.map(p => p.OwnerID);

    // STEP 2️⃣: Old Property Details
    const oldDetails = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const oldMap = {};
    oldDetails.forEach(o => {
      oldMap[o.OwnerID] = {
        OldWardNo: o.OldWardNo || "",
        OldPropertyNo: o.OldPropertyNo || "",
        OldPartitionNo: o.OldPartitionNo || "",
        OldRV: o.OldRV || 0,
        OldPropertyTax: o.OldPropertyTax || 0,
        OldTotalTax: o.OldTotalTax || 0
      };
    });

    // STEP 3️⃣: Latest Proposed Tax (TaxTotal must be 0)
    const transData = await TransMast.findAll({
      attributes: [
        "OwnerID",
        "FinanceYear",
        "RateableValue",
        "PropertyTax",
        "TaxTotal",
        [Sequelize.literal(`ROW_NUMBER() OVER (PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const latestTaxMap = {};
    transData.forEach(t => {
      if (t.rn === 1 && t.TaxTotal === 0) {
        latestTaxMap[t.OwnerID] = {
          RateableValue: t.RateableValue || 0,
          PropertyTax: t.PropertyTax || 0,
          TaxTotal: t.TaxTotal || 0
        };
      }
    });

    // FILTER only those properties whose latest tax = 0
    const filteredProperties = properties.filter(
      p => latestTaxMap[p.OwnerID]
    );

    if (!filteredProperties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const filteredOwnerIDs = filteredProperties.map(p => p.OwnerID);

    // STEP 4️⃣: Owner Names
    const names = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName", "MarathiOccupierName"],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      raw: true
    });

    const nameMap = {};
    names.forEach(n => nameMap[n.OwnerID] = n);

    // STEP 5️⃣: SUM Area + Rent
    const pdns = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"],
      ],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      group: ["OwnerID"],
      raw: true
    });

    const pdnMap = {};
    pdns.forEach(p => pdnMap[p.OwnerID] = p);

    // STEP 6️⃣: Property Type Description
    const typeData = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true
    });

    const typeMap = {};
    typeData.forEach(t => {
      typeMap[t.PropertyTypeID] = t.PropertyDescription;
    });

    // STEP 7️⃣: FINAL OUTPUT MERGE
    const final = filteredProperties.map(p => {
      const old = oldMap[p.OwnerID] || {};
      const ft = latestTaxMap[p.OwnerID] || {};

      return {
        OwnerID: p.OwnerID,
        NewZoneNo: p.NewZoneNo,
        NewWardNo: p.NewWardNo,
        NewPropertyNo: p.NewPropertyNo,
        NewPartitionNo: p.NewPartitionNo || "",

        OldWardNo: old.OldWardNo,
        OldPropertyNo: old.OldPropertyNo,
        OldPartitionNo: old.OldPartitionNo,
        OldRV: old.OldRV,
        OldPropertyTax: old.OldPropertyTax,
        OldTotalTax: old.OldTotalTax,

        OwnerName: nameMap[p.OwnerID]?.MarathiOwnerName || "",
        RenterName: nameMap[p.OwnerID]?.MarathiRenterName || "",
        MarathiOccupierName: nameMap[p.OwnerID]?.MarathiOccupierName || "",

        BuildingOrShopName: p.BuildingOrShopNameMarathi || "",
        OwnerPatta: p.OwnerPatta || "",

        // ⭐ Property Description Added
        PropertyDescription: typeMap[p.PropertyTypeID] || "",

        TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
        TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0,

        RateableValue: ft.RateableValue,
        PropertyTax: ft.PropertyTax,
        TaxTotal: ft.TaxTotal
      };
    });

    // STEP 8️⃣: SORT (same as SQL ORDER BY alpha numeric)
    final.sort((a, b) =>
      a.NewWardNo.localeCompare(b.NewWardNo, undefined, { numeric: true }) ||
      a.NewPropertyNo.localeCompare(b.NewPropertyNo, undefined, { numeric: true }) ||
      a.NewPartitionNo.localeCompare(b.NewPartitionNo, undefined, { numeric: true })
    );

    return res.status(200).json({
      success: true,
      totalRecords: final.length,
      data: final
    });

  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// //mission shopname 49
// export const getMissingBuildingShopNameList = async (req, res) => {
//   try {
//     const { wardNos } = req.body;

//     if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide NewWardNo(s)",
//       });
//     }

//     // STEP 1️⃣: Get properties ward wise with Type='C'
//     const properties = await PropertyMast.findAll({
//       attributes: [
//         "OwnerID",
//         "NewZoneNo",
//         "NewWardNo",
//         "NewPropertyNo",
//         "NewPartitionNo",
//         "PropertyTypeID",
//         "BuildingOrShopNameMarathi",
//         "OwnerPatta"
//       ],
//       include: [
//         {
//           model: PropertyTypeMaster,
//           attributes: ["Type"],
//           where: { Type: 'C' } 
//         }
//       ],
//       where: { NewWardNo: { [Op.in]: wardNos } },
//       raw: true
//     });

//     if (!properties.length) {
//       return res.status(200).json({ success: true, totalRecords: 0, data: [] });
//     }

//     const ownerIDs = properties.map(p => p.OwnerID);

//     // STEP 2️⃣: OldPropertyMast details
//     const oldDetails = await OldPropertyMast.findAll({
//       attributes: [
//         "OwnerID",
//         "OldWardNo",
//         "OldPropertyNo",
//         "OldPartitionNo",
//         "OldRV",
//         "OldPropertyTax",
//         "OldTotalTax"
//       ],
//       where: { OwnerID: { [Op.in]: ownerIDs } },
//       raw: true
//     });

//     const oldMap = {};
//     oldDetails.forEach(o => oldMap[o.OwnerID] = o);

//     // STEP 3️⃣: Latest proposed tax (TransMast)
//     const transData = await TransMast.findAll({
//       attributes: [
//         "OwnerID",
//         "FinanceYear",
//         "RateableValue",
//         "PropertyTax",
//         "TaxTotal",
//         [Sequelize.literal(`ROW_NUMBER() OVER (PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
//       ],
//       where: { OwnerID: { [Op.in]: ownerIDs } },
//       raw: true
//     });

//     const latestTaxMap = {};
//     transData.forEach(t => {
//       if (t.rn === 1) latestTaxMap[t.OwnerID] = t;
//     });

//     // STEP 4️⃣: Owner/Renter Names
//     const names = await CombinedOwnerName.findAll({
//       attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
//       where: { OwnerID: { [Op.in]: ownerIDs } },
//       raw: true
//     });

//     const nameMap = {};
//     names.forEach(n => nameMap[n.OwnerID] = n);

//     // STEP 5️⃣: PropertyDetailsNew SUM (Area & Rent)
//     const pdns = await PropertyDetailsNew.findAll({
//       attributes: [
//         "OwnerID",
//         [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
//         [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
//       ],
//       where: { OwnerID: { [Op.in]: ownerIDs } },
//       group: ["OwnerID"],
//       raw: true
//     });

//     const pdnMap = {};
//     pdns.forEach(p => pdnMap[p.OwnerID] = p);

//     // STEP 6️⃣: Merge final for missing Building/Shop Name
//     const final = properties
//       .filter(p => !p.BuildingOrShopNameMarathi || p.BuildingOrShopNameMarathi === "")
//       .map(p => {
//         const old = oldMap[p.OwnerID] || {};
//         const ft = latestTaxMap[p.OwnerID] || {};
//         return {
//           OwnerID: p.OwnerID,
//           NewZoneNo: p.NewZoneNo,
//           NewWardNo: p.NewWardNo,
//           NewPropertyNo: p.NewPropertyNo,
//           NewPartitionNo: p.NewPartitionNo || "",
//           OldWardNo: old.OldWardNo || "",
//           OldPropertyNo: old.OldPropertyNo || "",
//           OldPartitionNo: old.OldPartitionNo || "",
//           OldRV: old.OldRV || 0,
//           OldPropertyTax: old.OldPropertyTax || 0,
//           OldTotalTax: old.OldTotalTax || 0,
//           OwnerName: nameMap[p.OwnerID]?.MarathiOwnerName || "",
//           RenterName: nameMap[p.OwnerID]?.MarathiRenterName || "",
//           BuildingOrShopName: p.BuildingOrShopNameMarathi || "",
//           OwnerPatta: p.OwnerPatta || "",
//           TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
//           TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0,
//           RateableValue: ft.RateableValue || 0,
//           PropertyTax: ft.PropertyTax || 0,
//           TaxTotal: ft.TaxTotal || 0
//         };
//       });

//     // STEP 7️⃣: Sort
//     final.sort((a, b) =>
//       a.NewWardNo.localeCompare(b.NewWardNo, undefined, { numeric: true }) ||
//       a.NewPropertyNo.localeCompare(b.NewPropertyNo, undefined, { numeric: true }) ||
//       a.NewPartitionNo.localeCompare(b.NewPartitionNo, undefined, { numeric: true })
//     );

//     return res.status(200).json({
//       success: true,
//       totalRecords: final.length,
//       data: final
//     });

//   } catch (err) {
//     console.log("Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
export const getMissingBuildingShopNameList = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide NewWardNo(s)",
      });
    }

    // STEP 1️⃣: Get properties ward wise with Type='C'
    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "PropertyTypeID",
        "BuildingOrShopNameMarathi",
        "OwnerPatta"
      ],
      include: [
        {
          model: PropertyTypeMaster,
          attributes: ["Type", "PropertyDescription"],   // ✅ ADD HERE
          where: { Type: 'C' }
        }
      ],
      where: { NewWardNo: { [Op.in]: wardNos } },
      raw: true
    });

    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = properties.map(p => p.OwnerID);

    // STEP 2️⃣: OldPropertyMast details
    const oldDetails = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const oldMap = {};
    oldDetails.forEach(o => oldMap[o.OwnerID] = o);

    // STEP 3️⃣: Latest proposed tax (TransMast)
    const transData = await TransMast.findAll({
      attributes: [
        "OwnerID",
        "FinanceYear",
        "RateableValue",
        "PropertyTax",
        "TaxTotal",
        [Sequelize.literal(`ROW_NUMBER() OVER (PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const latestTaxMap = {};
    transData.forEach(t => {
      if (t.rn === 1) latestTaxMap[t.OwnerID] = t;
    });

    // STEP 4️⃣: Owner/Renter Names
    const names = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName","MarathiOccupierName"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const nameMap = {};
    names.forEach(n => nameMap[n.OwnerID] = n);

    // STEP 5️⃣: PropertyDetailsNew SUM (Area & Rent)
    const pdns = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      group: ["OwnerID"],
      raw: true
    });

    const pdnMap = {};
    pdns.forEach(p => pdnMap[p.OwnerID] = p);

    // STEP 6️⃣: Merge final
    const final = properties
      .filter(p => !p.BuildingOrShopNameMarathi || p.BuildingOrShopNameMarathi === "")
      .map(p => {
        const old = oldMap[p.OwnerID] || {};
        const ft = latestTaxMap[p.OwnerID] || {};
        return {
          OwnerID: p.OwnerID,
          NewZoneNo: p.NewZoneNo,
          NewWardNo: p.NewWardNo,
          NewPropertyNo: p.NewPropertyNo,
          NewPartitionNo: p.NewPartitionNo || "",

          OldWardNo: old.OldWardNo || "",
          OldPropertyNo: old.OldPropertyNo || "",
          OldPartitionNo: old.OldPartitionNo || "",

          OldRV: old.OldRV || 0,
          OldPropertyTax: old.OldPropertyTax || 0,
          OldTotalTax: old.OldTotalTax || 0,

          OwnerName: nameMap[p.OwnerID]?.MarathiOwnerName || "",
          RenterName: nameMap[p.OwnerID]?.MarathiRenterName || "",
          MarathiOccupierName:nameMap[p.OwnerID]?.MarathiOccupierName,
          BuildingOrShopName: p.BuildingOrShopNameMarathi || "",
          PropertyDescription: p["PropertyTypeMaster.PropertyDescription"] || "",   
          OwnerPatta: p.OwnerPatta || "",

          TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
          TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0,

          RateableValue: ft.RateableValue || 0,
          PropertyTax: ft.PropertyTax || 0,
          TaxTotal: ft.TaxTotal || 0
        };
      });

    // STEP 7️⃣: Sort
    final.sort((a, b) =>
      a.NewWardNo.localeCompare(b.NewWardNo, undefined, { numeric: true }) ||
      a.NewPropertyNo.localeCompare(b.NewPropertyNo, undefined, { numeric: true }) ||
      a.NewPartitionNo.localeCompare(b.NewPartitionNo, undefined, { numeric: true })
    );

    return res.status(200).json({
      success: true,
      totalRecords: final.length,
      data: final
    });

  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


//51 proeprty  desc apply..
export const getPropertiesByDescription = async (req, res) => {
  try {
    const { PropertyDescription } = req.body;

    if (!PropertyDescription || PropertyDescription === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a Property Description",
      });
    }

    // STEP 1: Get properties matching description from PropertyTypeMaster
    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "PropertyTypeID",
        "BuildingOrShopNameMarathi",
        "OwnerPatta"
      ],
      include: [
        {
          model: PropertyTypeMaster,
          attributes: ["PropertyDescription"],
          where: {
            PropertyDescription: { [Op.like]: `%${PropertyDescription}%` }
          },
          required: true
        }
      ],
      raw: true
    });

    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecordCount: 0, data: [] });
    }

    const ownerIDs = properties.map(p => p.OwnerID);

    // STEP 2: OldPropertyMast details
    const oldDetails = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const oldMap = {};
    oldDetails.forEach(o => oldMap[o.OwnerID] = o);

    // STEP 3: Latest TransMast data
    const transData = await TransMast.findAll({
      attributes: [
        "OwnerID",
        "FinanceYear",
        "RateableValue",
        "PropertyTax",
        "TaxTotal",
        [Sequelize.literal(`ROW_NUMBER() OVER (PARTITION BY OwnerID ORDER BY FinanceYear DESC)`), "rn"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const latestTaxMap = {};
    transData.forEach(t => {
      if (t.rn === 1) latestTaxMap[t.OwnerID] = t;
    });

    // STEP 4: Owner & Renter names
    const names = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const nameMap = {};
    names.forEach(n => nameMap[n.OwnerID] = n);

    // STEP 5: PropertyDetailsNew SUM
    const pdns = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      group: ["OwnerID"],
      raw: true
    });

    const pdnMap = {};
    pdns.forEach(p => pdnMap[p.OwnerID] = p);

    // STEP 6: Merge final data
    const final = properties.map(p => {
      const old = oldMap[p.OwnerID] || {};
      const ft = latestTaxMap[p.OwnerID] || {};
      return {
        OwnerID: p.OwnerID,
        NewZoneNo: p.NewZoneNo,
        NewWardNo: p.NewWardNo,
        NewPropertyNo: p.NewPropertyNo,
        NewPartitionNo: p.NewPartitionNo || "",
        OldWardNo: old.OldWardNo || "",
        OldPropertyNo: old.OldPropertyNo || "",
        OldPartitionNo: old.OldPartitionNo || "",
        OwnerName: nameMap[p.OwnerID]?.MarathiOwnerName || "",
        RenterName: nameMap[p.OwnerID]?.MarathiRenterName || "",
        BuildingOrShopName: p.BuildingOrShopNameMarathi || "",
        PropertyDesc: p["PropertyTypeMaster.PropertyDescription"] || "",
        OwnerPatta: p.OwnerPatta || "",
        TotalArea: pdnMap[p.OwnerID]?.TotalArea || 0,
        TotalRent: pdnMap[p.OwnerID]?.TotalRent || 0,
        OldRV: old.OldRV || 0,
        OldPropertyTax: old.OldPropertyTax || 0,
        OldTotalTax: old.OldTotalTax || 0,
        RateableValue: ft.RateableValue || 0,
        PropertyTax: ft.PropertyTax || 0,
        TaxTotal: ft.TaxTotal || 0
      };
    });

    return res.status(200).json({
      success: true,
      totalRecordCount: final.length,
      data: final
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

//50 Missing GIS Photo List apply...
export const getMissingGisPropertyImagesList = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide NewWardNo(s)",
      });
    }

    // STEP 1️⃣: Fetch PropertyMast → ONLY Ward wise OwnerIDs
    const properties = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "PropertyTypeID",
        "BuildingOrShopNameMarathi",
        "OwnerPatta"
      ],
      where: { NewWardNo: { [Op.in]: wardNos } },
      raw: true
    });

    if (properties.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = properties.map(p => p.OwnerID);

    const propertyMap = {};
    properties.forEach(p => propertyMap[p.OwnerID] = p);

    // STEP 2️⃣: Check which of these OwnerIDs have missing GIS photos
    const missingPhotos = await PropertyImageMast.findAll({
      attributes: ["OwnerID"],
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        [Op.or]: [
          { PropertyPhotoA: null },
          { PropertyPhotoB: null },
          { PropertyPhotoC: null },
          { PropertyPhotoD: null }
        ]
      },
      raw: true
    });

    if (!missingPhotos.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const missingOwnerIDs = missingPhotos.map(m => m.OwnerID);

    // STEP 3️⃣: Old Property Details
    const oldDetails = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID", 
        "OldWardNo", 
        "OldPropertyNo", 
        "OldPartitionNo",
        "OldTotalTax",
        "OldRV",
        "OldPropertyTax"
      ],
      where: { OwnerID: { [Op.in]: missingOwnerIDs } },
      raw: true
    });

    const oldMap = {};
    oldDetails.forEach(o => oldMap[o.OwnerID] = o);

    // STEP 4️⃣: Owner/Renter Names
    const names = await CombinedOwnerName.findAll({
      attributes: [
        "OwnerID",
        "MarathiOwnerName",
        "MarathiRenterName",
        "MarathiOccupierName"
      ],
      where: { OwnerID: { [Op.in]: missingOwnerIDs } },
      raw: true
    });

    const nameMap = {};
    names.forEach(n => nameMap[n.OwnerID] = n);

    // STEP 5️⃣ ADD: PropertyDetailsNew SUM(TotalArea + TotalRent)
    const pdns = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: missingOwnerIDs } },
      group: ["OwnerID"],
      raw: true
    });

    const pdnMap = {};
    pdns.forEach(p => pdnMap[p.OwnerID] = p);

    // STEP 6️⃣: Property Type Description
    const typeList = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true
    });

    const typeMap = {};
    typeList.forEach(t => typeMap[t.PropertyTypeID] = t.PropertyDescription);

    // STEP 7️⃣: Merge Final Output
    const final = missingOwnerIDs.map(ownerID => {
      const p = propertyMap[ownerID] || {};
      const old = oldMap[ownerID] || {};
      const name = nameMap[ownerID] || {};
      const pdn = pdnMap[ownerID] || {};

      return {
        OwnerID: ownerID,
        NewZoneNo: p.NewZoneNo || "",
        NewWardNo: p.NewWardNo || "",
        NewPropertyNo: p.NewPropertyNo || "",
        NewPartitionNo: p.NewPartitionNo || "",

        OldWardNo: old.OldWardNo || "",
        OldPropertyNo: old.OldPropertyNo || "",
        OldPartitionNo: old.OldPartitionNo || "",
        OldRV: old.OldRV || "",
        OldPropertyTax: old.OldPropertyTax || "",
        OldTotalTax: old.OldTotalTax || "",

        OwnerName: name.MarathiOwnerName || "",
        RenterName: name.MarathiRenterName || "",
        OccupierName: name.MarathiOccupierName || "",

        BuildingOrShopName: p.BuildingOrShopNameMarathi || "",
        PropertyDescription: typeMap[p.PropertyTypeID] || "",
        OwnerPatta: p.OwnerPatta || "",

        TotalArea: pdn.TotalArea || 0,
        TotalRent: pdn.TotalRent || 0
      };
    });

    // STEP 8️⃣: Sorting
    final.sort((a, b) =>
      a.NewWardNo.localeCompare(b.NewWardNo, undefined, { numeric: true }) ||
      a.NewPropertyNo.localeCompare(b.NewPropertyNo, undefined, { numeric: true }) ||
      a.NewPartitionNo.localeCompare(b.NewPartitionNo, undefined, { numeric: true })
    );

    return res.status(200).json({
      success: true,
      totalRecords: final.length,
      data: final
    });
  } catch (err) {
    console.error("Error in getMissingGisPropertyImagesList:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


//52 NewTotalTax is 10 times greater than OldTotalTax
export const getOldVsNewRVComparisonReport = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide NewWardNo(s)",
      });
    }

    const intWardNo = wardNos.map(w => parseInt(w.trim()));

    // Step1️⃣: Fetch ward-wise OwnerIDs from PropertyMast
    const wardOwners = await PropertyMast.findAll({
      attributes: ["OwnerID", "NewZoneNo","NewWardNo", "NewPropertyNo", "NewPartitionNo", "PropertyTypeID"],
      where: { NewWardNo: { [Op.in]: intWardNo } },
      raw: true
    });

    if (!wardOwners.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = wardOwners.map(o => o.OwnerID);
    const pmMap = {};
    wardOwners.forEach(o => pmMap[o.OwnerID] = o);

    // Step2️⃣: Get the latest FinanceYear
    const latestYear = await TransMast.max("FinanceYear");

    // Step3️⃣: Fetch New Tax Details for latest year
    const highTaxRows = await TransMast.findAll({
      attributes: ["OwnerID", "RateableValue", "PropertyTax", "TaxTotal"],
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        FinanceYear: latestYear,
        TaxTotal: {
          [Op.gt]: sequelize.literal(`(SELECT OldTotalTax FROM OldPropertyMast WHERE OldPropertyMast.OwnerID = TransMast.OwnerID AND OldPropertyMast.OldTotalTax <> 0)`)
        }
      },
      raw: true
    });

    if (!highTaxRows.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const finalOwnerIDs = highTaxRows.map(t => t.OwnerID);
    const taxMap = {};
    highTaxRows.forEach(t => taxMap[t.OwnerID] = t);

    // Step4️⃣: Fetch Old Property Details
    const oldRecords = await OldPropertyMast.findAll({
      attributes: ["OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo", "OldRV", "OldPropertyTax", "OldTotalTax"],
      where: { OwnerID: { [Op.in]: finalOwnerIDs } },
      raw: true
    });

    const oldMap = {};
    oldRecords.forEach(r => oldMap[r.OwnerID] = r);

    // Step5️⃣: Owner Names
    const names = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName", "MarathiOccupierName"],
      where: { OwnerID: { [Op.in]: finalOwnerIDs } },
      raw: true
    });

    const nameMap = {};
    names.forEach(n => nameMap[n.OwnerID] = n);

    // Step6️⃣: PropertyType Description
    const types = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true
    });

    const typeMap = {};
    types.forEach(pt => typeMap[pt.PropertyTypeID] = pt.PropertyDescription);

    // Step7️⃣: Area + Rent aggregation
    const details = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [sequelize.fn("SUM", sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [sequelize.fn("SUM", sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: finalOwnerIDs } },
      group: ["OwnerID"],
      raw: true
    });

    const detailsMap = {};
    details.forEach(d => detailsMap[d.OwnerID] = d);

    // Step8️⃣: Final merging
    const final = finalOwnerIDs.map(id => {
      const pm = pmMap[id] || {};
      const tax = taxMap[id] || {};
      const old = oldMap[id] || {};
      const name = nameMap[id] || {};
      const det = detailsMap[id] || {};

      return {
        OwnerID: id,
        NewZoneNo: pm.NewZoneNo || "",
        NewWardNo: pm.NewWardNo || "",
        NewPropertyNo: pm.NewPropertyNo || "",
        NewPartitionNo: pm.NewPartitionNo || "",
        PropertyDescription: typeMap[pm.PropertyTypeID] || "",
        OwnerName: name.MarathiOwnerName || "",
        RenterName: name.MarathiRenterName || "",
        MarathiOccupierName: name.MarathiOccupierName || "",
        OldWardNo: old.OldWardNo || "",
        OldPropertyNo: old.OldPropertyNo || "",
        OldPartitionNo: old.OldPartitionNo || "",
        OldRV: old.OldRV || 0,
        OldPropertyTax: old.OldPropertyTax || 0,
        OldTotalTax: old.OldTotalTax || 0,
        TotalArea: det.TotalArea || 0,
        TotalRent: det.TotalRent || 0,
        RateableValue: tax.RateableValue || 0,
        PropertyTax: tax.PropertyTax || 0,
        TaxTotal: tax.TaxTotal || 0
      };
    });

    // Step9️⃣: Ordering
    final.sort((a, b) =>
      a.NewWardNo.localeCompare(b.NewWardNo, undefined, { numeric: true }) ||
      a.NewPropertyNo.localeCompare(b.NewPropertyNo, undefined, { numeric: true }) ||
      a.NewPartitionNo.localeCompare(b.NewPartitionNo, undefined, { numeric: true })
    );

    return res.status(200).json({
      success: true,
      totalRecords: final.length,
      data: final
    });

  } catch (error) {
    console.error("Error getOldVsNewRVComparisonReport:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//53  NewTotalTax is 3 times less than OldTotalTax

export const getOldTaxHigherReport = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide NewWardNo(s)",
      });
    }

    const intWardNo = wardNos.map(w => parseInt(w.trim()));

    // STEP1️⃣ : Get OwnerIDs from PropertyMast only for selected wards
    const wardOwners = await PropertyMast.findAll({
      attributes: ["OwnerID", "NewZoneNo", "NewWardNo", "NewPropertyNo", "NewPartitionNo", "PropertyTypeID"],
      where: { NewWardNo: { [Op.in]: intWardNo } },
      raw: true
    });

    if (!wardOwners.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = wardOwners.map(o => o.OwnerID);
    const pmMap = {};
    wardOwners.forEach(o => pmMap[o.OwnerID] = o);

    // STEP2️⃣ : Get latest FinanceYear from TransMast
    const latestYear = await TransMast.max("FinanceYear");

    // STEP3️⃣ : Fetch latest tax values from TransMast only for those OwnerIDs
    const transRows = await TransMast.findAll({
      attributes: ["OwnerID", "RateableValue", "PropertyTax", "TaxTotal"],
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        FinanceYear: latestYear,
        TaxTotal: { [Op.ne]: 0 }
      },
      raw: true
    });

    const transMap = {};
    transRows.forEach(t => transMap[t.OwnerID] = t);
    const newTaxOwnerIDs = transRows.map(t => t.OwnerID);

    // STEP4️⃣ : Fetch old taxes
    const oldDetails = await OldPropertyMast.findAll({
      attributes: ["OwnerID", "OldTotalTax", "OldWardNo", "OldPropertyNo", "OldPartitionNo", "OldRV", "OldPropertyTax"],
      where: { OwnerID: { [Op.in]: newTaxOwnerIDs } },
      raw: true
    });

    const filteredOwnerIDs = oldDetails
      .filter(op => transMap[op.OwnerID] && op.OldTotalTax > 3 * transMap[op.OwnerID].TaxTotal)
      .map(op => op.OwnerID);

    if (!filteredOwnerIDs.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const oldMap = {};
    oldDetails.forEach(o => {
      if (filteredOwnerIDs.includes(o.OwnerID)) oldMap[o.OwnerID] = o;
    });

    // STEP5️⃣ : Owner / Renter Names
    const names = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiOccupierName"],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      raw: true
    });
    const nameMap = {};
    names.forEach(n => nameMap[n.OwnerID] = n);

    // STEP6️⃣ : Property Description
    const types = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true
    });
    const typeMap = {};
    types.forEach(pt => typeMap[pt.PropertyTypeID] = pt.PropertyDescription);

    // STEP7️⃣ : Area + Rent (PDN)
    const details = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [sequelize.fn("SUM", sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [sequelize.fn("SUM", sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      group: ["OwnerID"],
      raw: true
    });
    const detailMap = {};
    details.forEach(d => detailMap[d.OwnerID] = d);

    // STEP8️⃣ : Final Output Formatting
    const final = filteredOwnerIDs.map(id => {
      const pm = pmMap[id] || {};
      const tax = transMap[id] || {};
      const old = oldMap[id] || {};
      const name = nameMap[id] || {};
      const det = detailMap[id] || {};

      return {
        OwnerID: id,
        NewZoneNo: pm.NewZoneNo || "",
        NewWardNo: pm.NewWardNo || "",
        NewPropertyNo: pm.NewPropertyNo || "",
        NewPartitionNo: pm.NewPartitionNo || "",
        PropertyDescription: typeMap[pm.PropertyTypeID] || "",
        OwnerName: name.MarathiOwnerName || "",
        MarathiOccupierName: name.MarathiOccupierName || "",
        OldWardNo: old.OldWardNo || "",
        OldPropertyNo: old.OldPropertyNo || "",
        OldPartitionNo: old.OldPartitionNo || "",
        OldRV: old.OldRV || 0,
        OldPropertyTax: old.OldPropertyTax || 0,
        OldTotalTax: old.OldTotalTax || 0,
        TotalArea: det.TotalArea || 0,
        TotalRent: det.TotalRent || 0,
        RateableValue: tax.RateableValue || 0,
        PropertyTax: tax.PropertyTax || 0,
        TaxTotal: tax.TaxTotal || 0,
      };
    });

    // Sorting by Ward → Property → Partition
    final.sort((a, b) =>
      a.NewWardNo.localeCompare(b.NewWardNo, undefined, { numeric: true }) ||
      a.NewPropertyNo.localeCompare(b.NewPropertyNo, undefined, { numeric: true }) ||
      a.NewPartitionNo.localeCompare(b.NewPartitionNo, undefined, { numeric: true })
    );

    return res.status(200).json({
      success: true,
      totalRecords: final.length,
      data: final
    });

  } catch (error) {
    console.error("Error getOldTaxHigherReport:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// 54 totaltax is less than old total tax
export const getReducedTaxReport = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide NewWardNo(s)",
      });
    }

    // Step1: All owners in selected wards
    const allOwners = await PropertyMast.findAll({
      attributes: [
        "OwnerID", "NewZoneNo", "NewWardNo", "NewPropertyNo", "NewPartitionNo",
        "BuildingOrShopNameMarathi", "OwnerPatta", "PropertyTypeID"
      ],
      where: { NewWardNo: { [Op.in]: wardNos } },
      raw: true
    });

    if (!allOwners.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = allOwners.map(p => p.OwnerID);

    // Step2: Get latest FinanceYear from TransMast
    const latestYear = await TransMast.max("FinanceYear");

    // Step3: Latest TransMast (new tax) for these owners and latest year
    const transRows = await TransMast.findAll({
      attributes: ["OwnerID", "RateableValue", "PropertyTax", "TaxTotal"],
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        FinanceYear: latestYear,
        TaxTotal: { [Op.ne]: 0 }
      },
      raw: true
    });

    const taxMap = {};
    transRows.forEach(t => taxMap[t.OwnerID] = t);

    // Step4: Old Property Details
    const oldProps = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo",
        "OldRV", "OldPropertyTax", "OldTotalTax"
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });
    const oldMap = {};
    oldProps.forEach(o => oldMap[o.OwnerID] = o);

    // Step5: Owner/Renter Names
    const names = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiOccupierName"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });
    const nameMap = {};
    names.forEach(n => nameMap[n.OwnerID] = n);

    // Step6: Property Type Description
    const propertyTypes = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true
    });
    const typeMap = {};
    propertyTypes.forEach(pt => typeMap[pt.PropertyTypeID] = pt.PropertyDescription);

    // Step7: Area & Rent
    const details = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [sequelize.fn("SUM", sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [sequelize.fn("SUM", sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      group: ["OwnerID"],
      raw: true
    });
    const detailMap = {};
    details.forEach(d => detailMap[d.OwnerID] = d);

    // Step8: Merge final response (include all owners, mark reduced tax if applicable)
    const final = allOwners.map(p => {
      const ownerID = p.OwnerID;
      const oldProp = oldMap[ownerID] || {};
      const t = taxMap[ownerID] || {};
      const name = nameMap[ownerID] || {};
      const det = detailMap[ownerID] || {};

      return {
        ownerID,

        // New Property Details
        NewZoneNo: p.NewZoneNo || "",
        WardNo: p.NewWardNo || "",
        PropertyNo: p.NewPropertyNo || "",
        PartitionNo: p.NewPartitionNo || "",
        BuildingOrShopName: p.BuildingOrShopNameMarathi || "",
        OwnerPatta: p.OwnerPatta || "",
        PropertyDescription: typeMap[p.PropertyTypeID] || "",

        // Old Property Details
        OldWardNo: oldProp.OldWardNo || "",
        OldPropertyNo: oldProp.OldPropertyNo || "",
        OldPartitionNo: oldProp.OldPartitionNo || "",
        OldRV: oldProp.OldRV || 0,
        OldPropertyTax: oldProp.OldPropertyTax || 0,
        OldTotalTax: oldProp.OldTotalTax || 0,

        // Owner / Renter Names
        OwnerName: name.MarathiOwnerName || "",
        MarathiOccupierName: name.MarathiOccupierName || "",

        // Area & Rent
        TotalArea: det.TotalArea || 0,
        TotalRent: det.TotalRent || 0,

        // New Tax Details
        RateableValue: t.RateableValue || 0,
        PropertyTax: t.PropertyTax || 0,
        TaxTotal: t.TaxTotal || 0,

        // Flag for reduced tax
        IsReducedTax: t.TaxTotal && oldProp.OldTotalTax ? t.TaxTotal < oldProp.OldTotalTax : false
      };
    });

    // Sort by WardNo / PropertyNo / PartitionNo
    final.sort((a, b) =>
      a.WardNo.localeCompare(b.WardNo, undefined, { numeric: true }) ||
      a.PropertyNo.localeCompare(b.PropertyNo, undefined, { numeric: true }) ||
      a.PartitionNo.localeCompare(b.PartitionNo, undefined, { numeric: true })
    );

    return res.status(200).json({
      success: true,
      totalRecords: final.length,
      data: final
    });

  } catch (error) {
    console.error("Error in getReducedTaxReport:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


//55 Comparison

export const getCompareReport = async (req, res) => {
  try {
    const { wardNos } = req.body;

    // ✅ Validation
    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide NewWardNo(s)",
      });
    }

    // Step1: Owners from PropertyMast in selected wards
    const newProps = await PropertyMast.findAll({
      attributes: [
        "OwnerID", "NewZoneNo", "NewWardNo", "NewPropertyNo", "NewPartitionNo",
        "BuildingOrShopNameMarathi", "OwnerPatta", "PropertyTypeID",
      ],
      where: { NewWardNo: { [Op.in]: wardNos } },
      raw: true
    });

    if (!newProps.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = newProps.map(p => p.OwnerID);

    // Step2: Get latest FinanceYear from TransMast
    const latestYear = await TransMast.max("FinanceYear");

    // Step3: Latest TransMast (New Tax) for these owners and latest year
    const transRows = await TransMast.findAll({
      attributes: ["OwnerID", "RateableValue", "PropertyTax", "TaxTotal"],
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        FinanceYear: latestYear
      },
      raw: true
    });

    const taxMap = {};
    transRows.forEach(t => taxMap[t.OwnerID] = t);

    // Step4: Old Property Details
    const oldProps = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo",
        "OldRV", "OldPropertyTax", "OldTotalTax"
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });
    const oldMap = {};
    oldProps.forEach(o => oldMap[o.OwnerID] = o);

    // Step5: Owner/Renter Names
    const names = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });
    const nameMap = {};
    names.forEach(n => nameMap[n.OwnerID] = n);

    // Step6: Property Type
    const propertyTypes = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true
    });
    const typeMap = {};
    propertyTypes.forEach(pt => typeMap[pt.PropertyTypeID] = pt.PropertyDescription);

    // Step7: Area & Rent
    const details = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [sequelize.fn("SUM", sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [sequelize.fn("SUM", sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      group: ["OwnerID"],
      raw: true
    });
    const detailMap = {};
    details.forEach(d => detailMap[d.OwnerID] = d);

    // Step8: Merge final response
    const final = newProps.map(p => {
      const ownerID = p.OwnerID;
      const oldProp = oldMap[ownerID] || {};
      const t = taxMap[ownerID] || {};
      const name = nameMap[ownerID] || {};
      const det = detailMap[ownerID] || {};

      return {
        ownerID,

        // New Property Details
        NewZoneNo: p.NewZoneNo || "",
        WardNo: p.NewWardNo || "",
        PropertyNo: p.NewPropertyNo || "",
        PartitionNo: p.NewPartitionNo || "",
        BuildingOrShopName: p.BuildingOrShopNameMarathi || "",
        OwnerPatta: p.OwnerPatta || "",
        PropertyDescription: typeMap[p.PropertyTypeID] || "",

        // Old Property Details
        OldWardNo: oldProp.OldWardNo || "",
        OldPropertyNo: oldProp.OldPropertyNo || "",
        OldPartitionNo: oldProp.OldPartitionNo || "",
        OldRV: oldProp.OldRV || 0,
        OldPropertyTax: oldProp.OldPropertyTax || 0,
        OldTotalTax: oldProp.OldTotalTax || 0,

        // Owner/Renter Names
        OwnerName: name.MarathiOwnerName || "",
        RenterName: name.MarathiRenterName || "",

        // Area & Rent
        TotalArea: det.TotalArea || 0,
        TotalRent: det.TotalRent || 0,

        // New Tax Details
        RateableValue: t.RateableValue || 0,
        PropertyTax: t.PropertyTax || 0,
        TaxTotal: t.TaxTotal || 0,

        // Optional: Flag if this owner has a tax record
        HasTaxRecord: !!t.TaxTotal
      };
    });

    // Step9: Sort like SQL
    final.sort((a, b) =>
      a.WardNo.localeCompare(b.WardNo, undefined, { numeric: true }) ||
      a.PropertyNo.localeCompare(b.PropertyNo, undefined, { numeric: true }) ||
      a.PartitionNo.localeCompare(b.PartitionNo, undefined, { numeric: true })
    );

    return res.status(200).json({
      success: true,
      totalRecords: final.length,
      data: final
    });

  } catch (error) {
    console.error("Error in getCompareReport:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//56 Residential properties to which employemnt tax is  applied
export const getEmployeeTax = async (req, res) => {
  try {
    const { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide NewWardNo(s)" });
    }

    // Step1: New Properties with PropertyTypeID = 12
    const newProps = await PropertyMast.findAll({
      attributes: [
        "OwnerID", "NewZoneNo", "NewWardNo", "NewPropertyNo", "NewPartitionNo",
        "BuildingOrShopNameMarathi", "OwnerPatta", "PropertyTypeID"
      ],
      where: { 
        NewWardNo: { [Op.in]: wardNos },
        PropertyTypeID: 12
      },
      raw: true
    });

    const ownerIDs = newProps.map(p => p.OwnerID);
    if (!ownerIDs.length) return res.status(200).json({ success: true, totalRecords: 0, data: [] });

    // Step2: Latest TransMast (New Tax) with EmploymentTax > 0
    const transRows = await TransMast.findAll({
      attributes: ["OwnerID", "RateableValue", "PropertyTax", "TaxTotal", "EmploymentTax"],
      where: {
        FinanceYear: sequelize.literal("(SELECT MAX(FinanceYear) FROM TransMast)"),
        EmploymentTax: { [Op.gt]: 0 },
        OwnerID: { [Op.in]: ownerIDs }
      },
      raw: true
    });
    const taxMap = {};
    transRows.forEach(t => taxMap[t.OwnerID] = t);

    // Step3: Filter newProps for only those with EmploymentTax > 0
    const filteredNewProps = newProps.filter(p => taxMap[p.OwnerID]);
    const filteredOwnerIDs = filteredNewProps.map(p => p.OwnerID);
    if (!filteredOwnerIDs.length) return res.status(200).json({ success: true, totalRecords: 0, data: [] });

    // Step4: Old Property Details from OldPropertyMast
    const oldProps = await OldPropertyMast.findAll({
      attributes: [
        "OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo",
        "OldRV", "OldPropertyTax", "OldTotalTax"
      ],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      raw: true
    });
    const oldMap = {};
    oldProps.forEach(o => oldMap[o.OwnerID] = o);

    // Step5: Owner/Renter Names
    const names = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiOccupierName"],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      raw: true
    });
    const nameMap = {};
    names.forEach(n => nameMap[n.OwnerID] = n);

    // Step6: Property Type Description
    const propertyTypes = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true
    });
    const typeMap = {};
    propertyTypes.forEach(pt => typeMap[pt.PropertyTypeID] = pt.PropertyDescription);

    // Step7: Area & Rent
    const details = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [sequelize.fn("SUM", sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [sequelize.fn("SUM", sequelize.col("Rent")), "TotalRent"]
      ],
      where: { OwnerID: { [Op.in]: filteredOwnerIDs } },
      group: ["OwnerID"],
      raw: true
    });
    const detailMap = {};
    details.forEach(d => detailMap[d.OwnerID] = d);

    // Step8: Merge final response
    const final = filteredNewProps.map(p => {
      const t = taxMap[p.OwnerID] || {};
      const name = nameMap[p.OwnerID] || {};
      const det = detailMap[p.OwnerID] || {};
      const old = oldMap[p.OwnerID] || {};

      return {
        ownerID: p.OwnerID,

        // New Property Details
        NewZoneNo: p.NewZoneNo || "",
        WardNo: p.NewWardNo || "",
        PropertyNo: p.NewPropertyNo || "",
        PartitionNo: p.NewPartitionNo || "",
        BuildingOrShopName: p.BuildingOrShopNameMarathi || "",
        OwnerPatta: p.OwnerPatta || "",
        PropertyDescription: typeMap[p.PropertyTypeID] || "",

        // Old Property Details from OldPropertyMast
        OldWardNo: old.OldWardNo || "",
        OldPropertyNo: old.OldPropertyNo || "",
        OldPartitionNo: old.OldPartitionNo || "",
        OldRV: old.OldRV || 0,
        OldPropertyTax: old.OldPropertyTax || 0,
        OldTotalTax: old.OldTotalTax || 0,

        // Owner/Renter
        OwnerName: name.MarathiOwnerName || "",
        MarathiOccupierName: name.MarathiOccupierName || "",

        // Area & Rent
        TotalArea: det.TotalArea || 0,
        TotalRent: det.TotalRent || 0,

        // New Tax Details
        RateableValue: t.RateableValue || 0,
        PropertyTax: t.PropertyTax || 0,
        TaxTotal: t.TaxTotal || 0
      };
    });

    // Step9: Sort
    final.sort((a, b) =>
      a.WardNo.localeCompare(b.WardNo, undefined, { numeric: true }) ||
      a.PropertyNo.localeCompare(b.PropertyNo, undefined, { numeric: true }) ||
      a.PartitionNo.localeCompare(b.PartitionNo, undefined, { numeric: true })
    );

    return res.status(200).json({ success: true, totalRecords: final.length, data: final });

  } catch (error) {
    console.error("Error in getCompareReport56WithConditionOld:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//57  Commercial properties to which employemnt tax is not apllied
export const getCommercialZeroEmploymentReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide Ward Numbers",
      });
    }

    // Step1️⃣: Commercial Properties from PropertyMast
    const properties = await PropertyMast.findAll({
      where: {
        NewWardNo: wardNos,
      },
      include: [
        {
          model: PropertyTypeMaster,
          attributes: ["PropertyDescription", "Type"],
          where: { Type: "C" },
          required: true,
        },
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiOccupierName"],
          required: false,
        }
      ],
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta"
      ],
      raw: true
    });

    if (properties.length === 0) {
      return res.status(200).json({
        success: true,
        totalRecords: 0,
        data: [],
      });
    }

    const ownerIDs = [...new Set(properties.map(p => p.OwnerID))];

    // Step2️⃣: Old Tax + Old Property Details from OldPropertyMast
    const oldDetails = await OldPropertyMast.findAll({
      where: {
        OwnerID: ownerIDs
      },
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      raw: true
    });

    // Step3️⃣: Get Latest Finance Year New Tax from TransMast
    const latestFY = await TransMast.max("FinanceYear");

    const newTax = await TransMast.findAll({
      where: {
        OwnerID: ownerIDs,
        FinanceYear: latestFY,
        EmploymentTax: 0
      },
      attributes: [
        "OwnerID",
        "RateableValue",
        "PropertyTax",
        "TaxTotal"
      ],
      raw: true,
    });

    // Step4️⃣: Rent & Area From PropertyDetailsNew
    const newAreaRent = await PropertyDetailsNew.findAll({
      where: { OwnerID: ownerIDs },
      attributes: [
        "OwnerID",
        [sequelize.fn("SUM", sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [sequelize.fn("SUM", sequelize.col("Rent")), "TotalRent"],
      ],
      group: ["OwnerID"],
      raw: true,
    });

    // Step5️⃣: Merge All Records
    const finalData = properties.map(p => {
      const oldRec = oldDetails.find(o => o.OwnerID === p.OwnerID) || {};
      const tax = newTax.find(n => n.OwnerID === p.OwnerID) || {};
      const areaRent = newAreaRent.find(ar => ar.OwnerID === p.OwnerID) || {};

      return {
        OwnerID: p.OwnerID,
        ZoneNo: p.NewZoneNo || "",
        WardNo: p.NewWardNo || "",
        PropertyNo: p.NewPropertyNo || "",
        PartitionNo: p.NewPartitionNo || "",

        OwnerName: p["CombinedOwnerName.MarathiOwnerName"] || "",
        MarathiOccupierName: p["CombinedOwnerName.MarathiOccupierName"] || "",
        BuildingName: p.BuildingOrShopNameMarathi || "",
        Description: p["PropertyTypeMaster.PropertyDescription"] || "",
        Address: p.OwnerPatta || "",

        TotalArea: areaRent.TotalArea || 0,
        TotalRent: areaRent.TotalRent || 0,

        // ⭐ Now Correct Old Data Source
        OldWardNo: oldRec.OldWardNo || "",
        OldPropertyNo: oldRec.OldPropertyNo || "",
        OldPartitionNo: oldRec.OldPartitionNo || "",
        RV_Old: oldRec.OldRV || 0,
        PropertyTax_Old: oldRec.OldPropertyTax || 0,
        TotalTax_Old: oldRec.OldTotalTax || 0,

        RV_New: tax.RateableValue || 0,
        PropertyTax_New: tax.PropertyTax || 0,
        TotalTax_New: tax.TaxTotal || 0,
      };
    });

    // Step6️⃣: Sorting
    finalData.sort((a, b) =>
      (a.ZoneNo || "").localeCompare(b.ZoneNo || "", undefined, { numeric: true }) ||
      (a.WardNo || "").localeCompare(b.WardNo || "", undefined, { numeric: true }) ||
      (a.PropertyNo || "").localeCompare(b.PropertyNo || "", undefined, { numeric: true }) ||
      (a.PartitionNo || "").localeCompare(b.PartitionNo || "", undefined, { numeric: true })
    );

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData,
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//58 new proeprty
export const getHolderByWardExact = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No",
      });
    }

    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Fetch properties from PropertyMast with related data
    const properties = await PropertyMast.findAll({
      where: {
        NewWardNo: { [Op.in]: wardNos },
      },
      include: [
        {
          model: PropertyTypeMaster,
          attributes: ["PropertyDescription", "Type"],
          required: true,
        },
        // {
        //   model: CombinedOwnerName,
        //   attributes: ["MarathiOwnerName", "MarathiOccupierName"],
        //   required: false,
        //   where: {
        //     [Op.and]: [
        //       { MarathiOwnerName: { [Op.notLike]: "%Holder%" } },
        //       { MarathiOwnerName: { [Op.notLike]: "%धारक%" } },
        //     ],
        //   },
        // },
      ],
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      raw: true,
    });

    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = [...new Set(properties.map(p => p.OwnerID))];
  // 🔹 Step 2: Fetch Marathi Names (new logic)
  const names = await CombinedOwnerName.findAll({
    attributes: [
      "OwnerID",
      "MarathiOwnerName",
      "MarathiOccupierName",
      "MarathiRenterName"
    ],
    where: {
      [Op.and]: [
        { MarathiOwnerName: { [Op.notLike]: "%Holder%" } },
        { MarathiOwnerName: { [Op.notLike]: "%धारक%" } },
      ],
    },    raw: true
  });

  const nameMap = {};
  names.forEach(n => { nameMap[n.OwnerID] = n; });

    // Step 2️⃣: OldPropertyMast details
    const oldDetails = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax",
      ],
      raw: true,
    });

    const oldMap = oldDetails.reduce((acc, cur) => {
      acc[cur.OwnerID] = cur;
      return acc;
    }, {});

    // Step 3️⃣: Latest FinanceYear TransMast
    const latestFY = await TransMast.max("FinanceYear");
    const newTax = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs }, FinanceYear: latestFY },
      attributes: ["OwnerID", "RateableValue", "PropertyTax", "TaxTotal"],
      raw: true,
    });

    const taxMap = newTax.reduce((acc, cur) => {
      acc[cur.OwnerID] = cur;
      return acc;
    }, {});

    // Step 4️⃣: PropertyDetailsNew SUM of area & rent
    const newAreaRent = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: [
        "OwnerID",
        [sequelize.fn("SUM", sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [sequelize.fn("SUM", sequelize.col("Rent")), "TotalRent"],
      ],
      group: ["OwnerID"],
      raw: true,
    });

    const areaRentMap = newAreaRent.reduce((acc, cur) => {
      acc[cur.OwnerID] = cur;
      return acc;
    }, {});

    // Step 5️⃣: Merge all data
    const finalData = properties
      .map(p => {
        const oldRec = oldMap[p.OwnerID] || {};
        const tax = taxMap[p.OwnerID] || {};
        const areaRent = areaRentMap[p.OwnerID] || {};
        const nm = nameMap[p.OwnerID] || {};
        return {
          OwnerID: p.OwnerID,
          ZoneNo: p.NewZoneNo || "",
          WardNo: p.NewWardNo || "",
          PropertyNo: p.NewPropertyNo || "",
          PartitionNo: p.NewPartitionNo || "",

          OwnerName: nm.MarathiOwnerName || "",
          MarathiOccupierName: nm.MarathiOccupierName || "",
          MarathiRenterName: nm.MarathiRenterName || "",
          BuildingName: p.BuildingOrShopNameMarathi || "",
          Description: p["PropertyTypeMaster.PropertyDescription"] || "",
          Address: p.OwnerPatta || "",

          TotalArea: areaRent.TotalArea || 0,
          TotalRent: areaRent.TotalRent || 0,

          OldWardNo: oldRec.OldWardNo || "",
          OldPropertyNo: oldRec.OldPropertyNo || "",
          OldPartitionNo: oldRec.OldPartitionNo || "",
          RV_Old: oldRec.OldRV || 0,
          PropertyTax_Old: oldRec.OldPropertyTax || 0,
          TotalTax_Old: oldRec.OldTotalTax || 0,

          RV_New: tax.RateableValue || 0,
          PropertyTax_New: tax.PropertyTax || 0,
          TotalTax_New: tax.TaxTotal || 0,
        };
      })
      // Step 6️⃣: Filter only new properties
      .filter(
        p =>
          (!p.TotalTax_Old || p.TotalTax_Old === "") &&
          (!p.OldPropertyNo || p.OldPropertyNo.toLowerCase() === "new")
      )
      // Step 7️⃣: Sort
      .sort((a, b) =>
        (a.ZoneNo || "").localeCompare(b.ZoneNo || "", undefined, { numeric: true }) ||
        (a.WardNo || "").localeCompare(b.WardNo || "", undefined, { numeric: true }) ||
        (a.PropertyNo || "").localeCompare(b.PropertyNo || "", undefined, { numeric: true }) ||
        (a.PartitionNo || "").localeCompare(b.PartitionNo || "", undefined, { numeric: true })
      );

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData,
    });
  } catch (error) {
    console.error("Error in getHolderByWardExactOptimized:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//59 outer
export const getOuterPropertiesReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1: PropertyMast + PropertyTypeMaster + CombinedOwnerName
    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos }, PropertyRemark: { [Op.like]: "%outer%" } },
      include: [
        { model: PropertyTypeMaster, attributes: ["PropertyDescription"], required: false },
      ],
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
     
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      raw: true,
    });

    if (!properties.length) return res.status(200).json({ success: true, totalRecords: 0, data: [] });

    const ownerIDs = [...new Set(properties.map(p => p.OwnerID))];

    // Step 2: OldPropertyMast
    const oldDetails = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: ["OwnerID", "OldWardNo", "OldPropertyNo", "OldPartitionNo", "OldRV", "OldPropertyTax", "OldTotalTax"],
      raw: true,
    });
    const names = await CombinedOwnerName.findAll({
      attributes: [
        "OwnerID",
        "MarathiOwnerName",
        "MarathiOccupierName",
        "MarathiRenterName"
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const nameMap = {};
    names.forEach(n => { nameMap[n.OwnerID] = n; });

    // Step 3: TransMast latest FY
    const latestFY = await TransMast.max("FinanceYear");
    const newTax = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs }, FinanceYear: latestFY, EmploymentTax: 0 },
      attributes: ["OwnerID", "RateableValue", "PropertyTax", "TaxTotal"],
      raw: true,
    });

    // Step 4: PropertyDetailsNew
    const newAreaRent = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: [
        "OwnerID",
        [sequelize.fn("SUM", sequelize.col("CarpetAreaSqFeet")), "TotalArea"],
        [sequelize.fn("SUM", sequelize.col("Rent")), "TotalRent"]
      ],
      group: ["OwnerID"],
      raw: true,
    });

    // Step 5: FloorSubmissionDetails separate fetch
    const floorDetails = await FloorSubmissionDetails.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs }, PropertyRemark: { [Op.like]: "%outer%" } },
      attributes: ["OwnerID"],
      raw: true,
    });
    const floorOwnerIDs = new Set(floorDetails.map(f => f.OwnerID));

    // Step 6: Merge all records
    const finalData = properties
      .filter(p => floorOwnerIDs.has(p.OwnerID)) 
      .map(p => {
        const oldRec = oldDetails.find(o => o.OwnerID === p.OwnerID) || {};
        const tax = newTax.find(n => n.OwnerID === p.OwnerID) || {};
        const areaRent = newAreaRent.find(ar => ar.OwnerID === p.OwnerID) || {};
        const nm = nameMap[p.OwnerID] || {};
        return {
          OwnerID: p.OwnerID,
          ZoneNo: p.NewZoneNo || "",
          WardNo: p.NewWardNo || "",
          PropertyNo: p.NewPropertyNo || "",
          OwnerName: nm.MarathiOwnerName || "",
          MarathiOccupierName: nm.MarathiOccupierName || "",
          MarathiRenterName: nm.MarathiRenterName || "",
          BuildingName: p.BuildingOrShopNameMarathi || "",
          Description: p["PropertyTypeMaster.PropertyDescription"] || "",
          Address: p.OwnerPatta || "",

          TotalArea: areaRent.TotalArea || 0,
          TotalRent: areaRent.TotalRent || 0,

          OldWardNo: oldRec.OldWardNo || "",
          OldPropertyNo: oldRec.OldPropertyNo || "",
          OldPartitionNo: oldRec.OldPartitionNo || "",
          RV_Old: oldRec.OldRV || 0,
          PropertyTax_Old: oldRec.OldPropertyTax || 0,
          TotalTax_Old: oldRec.OldTotalTax || 0,

          RV_New: tax.RateableValue || 0,
          PropertyTax_New: tax.PropertyTax || 0,
          TotalTax_New: tax.TaxTotal || 0,
        };
      });

    // Step 7: Sort
    finalData.sort((a, b) =>
      (a.ZoneNo || "").localeCompare(b.ZoneNo || "", undefined, { numeric: true }) ||
      (a.WardNo || "").localeCompare(b.WardNo || "", undefined, { numeric: true }) ||
      (a.PropertyNo || "").localeCompare(b.PropertyNo || "", undefined, { numeric: true }) ||
      (a.PartitionNo || "").localeCompare(b.PartitionNo || "", undefined, { numeric: true })
    );

    return res.status(200).json({ success: true, totalRecords: finalData.length, data: finalData });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//60 Old Tax is Greater than Old RV

export const getOldTax = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No"
      });
    }

    // Step 1: Fetch PropertyMast data
    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      include: [
        {
          model: PropertyTypeMaster,
          attributes: ["PropertyDescription"],
          required: false
        }
      ],
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta"
      ],
      raw: true
    });

    if (!properties.length) {
      return res.status(200).json({
        success: true,
        totalRecords: 0,
        data: []
      });
    }

    const ownerIDs = [...new Set(properties.map(p => p.OwnerID))];

    // 🔹 Step 2: Fetch Marathi Names (new logic)
    const names = await CombinedOwnerName.findAll({
      attributes: [
        "OwnerID",
        "MarathiOwnerName",
        "MarathiOccupierName",
        "MarathiRenterName"
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true
    });

    const nameMap = {};
    names.forEach(n => { nameMap[n.OwnerID] = n; });

    // Step 3: Fetch Old Tax
    const oldDetails = await OldPropertyMast.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        [Op.and]: literal("OldTotalTax > OldRentalValue")
      },
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      raw: true
    });

    const latestFY = await TransMast.max("FinanceYear");

    // Step 4: Fetch New Tax
    const newTax = await TransMast.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        FinanceYear: latestFY,
        EmploymentTax: 0
      },
      attributes: [
        "OwnerID",
        "RateableValue",
        "PropertyTax",
        "TaxTotal"
      ],
      raw: true
    });

    // Step 5: Fetch Area & Rent
    const newAreaRent = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: [
        "OwnerID",
        [fn("SUM", col("CarpetAreaSqFeet")), "TotalArea"],
        [fn("SUM", col("Rent")), "TotalRent"]
      ],
      group: ["OwnerID"],
      raw: true
    });

    // Step 6: Merge All
    const finalData = properties.map(p => {
      const oldRec = oldDetails.find(o => o.OwnerID === p.OwnerID) || {};
      const tax = newTax.find(n => n.OwnerID === p.OwnerID) || {};
      const areaRent = newAreaRent.find(ar => ar.OwnerID === p.OwnerID) || {};
      const nm = nameMap[p.OwnerID] || {};

      return {
        OwnerID: p.OwnerID,
        ZoneNo: p.NewZoneNo || "",
        WardNo: p.NewWardNo || "",
        PropertyNo: p.NewPropertyNo || "",
        PartitionNo: p.NewPartitionNo || "",

        OwnerName: nm.MarathiOwnerName || "",
        MarathiOccupierName: nm.MarathiOccupierName || "",
        MarathiRenterName: nm.MarathiRenterName || "",
        BuildingName: p.BuildingOrShopNameMarathi || "",
        Description: p["PropertyTypeMaster.PropertyDescription"] || "",
        Address: p.OwnerPatta || "",

        TotalArea: areaRent.TotalArea || 0,
        TotalRent: areaRent.TotalRent || 0,

        RV_Old: oldRec.OldRV || 0,
        PropertyTax_Old: oldRec.OldPropertyTax || 0,
        TotalTax_Old: oldRec.OldTotalTax || 0,
        OldWardNo: oldRec.OldWardNo || "",
        OldPropertyNo: oldRec.OldPropertyNo || "",
        OldPartitionNo: oldRec.OldPartitionNo || "",

        RV_New: tax.RateableValue || 0,
        PropertyTax_New: tax.PropertyTax || 0,
        TotalTax_New: tax.TaxTotal || 0
      };
    });

    // Sort Output
    finalData.sort((a, b) =>
      (a.ZoneNo || "").localeCompare(b.ZoneNo || "", undefined, { numeric: true }) ||
      (a.WardNo || "").localeCompare(b.WardNo || "", undefined, { numeric: true }) ||
      (a.PropertyNo || "").localeCompare(b.PropertyNo || "", undefined, { numeric: true }) ||
      (a.PartitionNo || "").localeCompare(b.PartitionNo || "", undefined, { numeric: true })
    );

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//31 actual value appeal mst

export const getAppealValueAppealReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1: Fetch OwnerIDs from PropertyMast based on WardNo
    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: ["OwnerID", "NewZoneNo", "NewWardNo", "NewPropertyNo", "NewPartitionNo"],
      raw: true,
    });

    if (!properties.length) return res.status(200).json({ success: true, totalRecords: 0, data: [] });

    const ownerIDs = [...new Set(properties.map(p => p.OwnerID))];

    // Step 2: Fetch AppealMast for these OwnerIDs
    const appeals = await AppealMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: [
        "OwnerID",
        [fn("IFNULL", col("PropertyTax"), 0), "PropertyTax"],
        [fn("IFNULL", col("Tax1"), 0), "Tax1"],
        [fn("IFNULL", col("TreeCess"), 0), "TreeCess"],
        [fn("IFNULL", col("EducationTax"), 0), "EducationTax"],
        [fn("IFNULL", col("EmploymentTax"), 0), "EmploymentTax"],
        [fn("IFNULL", col("SpEducationTax"), 0), "SpEducationTax"],
        [literal(`CASE WHEN IFNULL(RentalValue,0) > 0 THEN IFNULL(Sanitation,0) ELSE 0 END`), "Sanitation"],
        [fn("IFNULL", col("DrainCess"), 0), "DrainCess"],
        [fn("IFNULL", col("SpWaterCess"), 0), "SpWaterCess"],
        [fn("IFNULL", col("RoadCess"), 0), "RoadCess"],
        [fn("IFNULL", col("FireCess"), 0), "FireCess"],
        [fn("IFNULL", col("LightCess"), 0), "LightCess"],
        [fn("IFNULL", col("WaterBenefit"), 0), "WaterBenefit"],
        [fn("IFNULL", col("MajorBuilding"), 0), "MajorBuilding"],
        [fn("IFNULL", col("SewageDisposalCess"), 0), "SewageDisposalCess"],
        [literal(`CASE WHEN IFNULL(RentalValue,0) > 0 THEN IFNULL(WaterBill,0) ELSE 0 END`), "WaterBill"],
        [fn("IFNULL", col("RentalValue"), 0), "RentalValue"],
        [fn("IFNULL", col("Reason"), ''), "Reason"],
        [literal(`(
          IFNULL(PropertyTax,0) + IFNULL(Tax1,0) + IFNULL(TreeCess,0) +
          IFNULL(EducationTax,0) + IFNULL(EmploymentTax,0) + IFNULL(SpEducationTax,0) +
          CASE WHEN IFNULL(RentalValue,0) > 0 THEN IFNULL(Sanitation,0) ELSE 0 END +
          IFNULL(DrainCess,0) + IFNULL(SpWaterCess,0) + IFNULL(RoadCess,0) +
          IFNULL(FireCess,0) + IFNULL(WaterBenefit,0) + IFNULL(MajorBuilding,0) +
          IFNULL(SewageDisposalCess,0) + CASE WHEN IFNULL(RentalValue,0) > 0 THEN IFNULL(WaterBill,0) ELSE 0 END
        )`), "AppealTotal"]
      ],
      raw: true,
    });

    // Step 3: Fetch ApplyTaxesMaster for OwnerIDs
    const taxMasters = await ApplyTaxesMaster.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: [
        "OwnerID",
        "PropertyTax", "Tax1", "TreeCess", "EducationTax", "EmploymentTax", 
        "SpEducationTax", "Sanitation", "DrainCess", "SpWaterCess", "RoadCess",
        "FireCess", "LightCess", "WaterBenefit", "MajorBuilding", "SewageDisposalCess", "WaterBill"
      ],
      raw: true,
    });

    // Step 4: Merge & calculate totals
    const finalData = appeals.map(a => {
      const tax = taxMasters.find(t => t.OwnerID === a.OwnerID) || {};

      const calculatedTotal =
        (a.PropertyTax * (tax.PropertyTax ? 1 : 0)) +
        (a.Tax1 * (tax.Tax1 ? 1 : 0)) +
        (a.TreeCess * (tax.TreeCess ? 1 : 0)) +
        (a.EducationTax * (tax.EducationTax ? 1 : 0)) +
        (a.EmploymentTax * (tax.EmploymentTax ? 1 : 0)) +
        (a.SpEducationTax * (tax.SpEducationTax ? 1 : 0)) +
        ((a.Sanitation || 0) * (tax.Sanitation ? 1 : 0)) +
        (a.DrainCess * (tax.DrainCess ? 1 : 0)) +
        (a.SpWaterCess * (tax.SpWaterCess ? 1 : 0)) +
        (a.RoadCess * (tax.RoadCess ? 1 : 0)) +
        (a.FireCess * (tax.FireCess ? 1 : 0)) +
        (a.LightCess * (tax.LightCess ? 1 : 0)) +
        (a.WaterBenefit * (tax.WaterBenefit ? 1 : 0)) +
        (a.MajorBuilding * (tax.MajorBuilding ? 1 : 0)) +
        (a.SewageDisposalCess * (tax.SewageDisposalCess ? 1 : 0)) +
        ((a.WaterBill || 0) * (tax.WaterBill ? 1 : 0));

      return {
        ...a,
        CalculatedTotal: calculatedTotal,
      };
    }).filter(r => r.AppealTotal !== r.CalculatedTotal); 

    return res.status(200).json({ success: true, totalRecords: finalData.length, data: finalData });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//37 oblique
export const getPropertyObliqueReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1: Fetch OwnerIDs from PropertyMast based on WardNo
    const properties = await PropertyMast.findAll({
      where: { 
        NewPartitionNo: { [Op.ne]: "" },
        NewWardNo: { [Op.in]: wardNos }
      },
      attributes: ["OwnerID", "NewZoneNo", "NewWardNo", "NewPropertyNo", "NewPartitionNo","BuildingOrShopNameMarathi","OwnerPatta"],
      raw: true,
    });

    if (!properties.length) 
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });

    const ownerIDs = [...new Set(properties.map(p => p.OwnerID))];

    // Step 2: Fetch OldPropertyMast details
    const oldDetails = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      raw: true,
    });

    // Step 3: Fetch Combined Owner/Renter Names
    const ownerRenterNM = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName","OccupierName","MarathiOccupierName"
    ],
      raw: true,
    });

    // Step 4: Latest FinanceYear from TransMast
    const latestFinanceYearRecord = await TransMast.findOne({
      attributes: [[fn("MAX", col("FinanceYear")), "FinanceYear"]],
      raw: true,
    });
    const latestFinanceYear = latestFinanceYearRecord?.FinanceYear;

    // Step 5: Fetch TransMast for latest FinanceYear
    const transData = await TransMast.findAll({
      where: { 
        OwnerID: { [Op.in]: ownerIDs },
        FinanceYear: latestFinanceYear
      },
      attributes: ["OwnerID", "RateableValue", "PropertyTax", "TaxTotal"],
      raw: true,
    });

    // Step 6: Fetch PropertyDetailsNew and PropertyTypeMaster
    const detailsData = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: ["OwnerID", [fn("SUM", col("CarpetAreaSqFeet")), "TotalArea"], [fn("SUM", col("Rent")), "TotalRent"]],
      group: ["OwnerID"],
      raw: true,
    });

    const typeData = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true,
    });

    // Step 7: Merge all data
    const finalData = properties.map(p => {
      const old = oldDetails.find(o => o.OwnerID === p.OwnerID) || {};
      const owner = ownerRenterNM.find(o => o.OwnerID === p.OwnerID) || {};
      const trans = transData.find(t => t.OwnerID === p.OwnerID) || {};
      const details = detailsData.find(d => d.OwnerID === p.OwnerID) || {};
      const type = typeData.find(t => t.PropertyTypeID === p.PropertyTypeID) || {};

      return {
        ownerIDs:p.ownerID,
        NewZoneNo: p.NewZoneNo,
        NewWardNo: p.NewWardNo,
        NewPropertyNo: p.NewPropertyNo,
        NewPartitionNo: p.NewPartitionNo,
        OldWardNo: old.OldWardNo,
        OldPropertyNo: old.OldPropertyNo,
        OldPartitionNo: old.OldPartitionNo,
        OldRV: old.OldRV,
        OldPropertyTax: old.OldPropertyTax,
        OldTotalTax: old.OldTotalTax,
        OwnerName: owner.MarathiOwnerName,
        RenterName: owner.MarathiRenterName,
        MarathiOccupierName:owner.MarathiOccupierName,
        OccupierName:owner.OccupierName,
        BuildingOrShopNameMarathi: p.BuildingOrShopNameMarathi,
        PropertyDescription: type.PropertyDescription,
        OwnerPatta: p.OwnerPatta,
        TotalArea: details.TotalArea,
        TotalRent: details.TotalRent,
        ProposedRV: trans.RateableValue,
        ProposedPropertyTax: trans.PropertyTax,
        ProposedTotalTax: trans.TaxTotal
      };
    });

    return res.status(200).json({ success: true, totalRecords: finalData.length, data: finalData });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//61 Properties having New RV but Net Tax is Zero
export const getProposedNewRvNetZeroTaxReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No"
      });
    }

    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1: Fetch PropertyMast (only those having Proposed RV but 0 Proposed Tax)
    const properties = await PropertyMast.findAll({
      where: {
        NewWardNo: { [Op.in]: wardNos }
      },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "PropertyTypeID"
      ],
      raw: true,
    });

    if (!properties.length)
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });

    const ownerIDs = [...new Set(properties.map(p => p.OwnerID))];

    // Step 2: Old Property Details
    const oldDetails = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: [
        "OwnerID",
        "OldWardNo",
        "OldPropertyNo",
        "OldPartitionNo",
        "OldRV",
        "OldPropertyTax",
        "OldTotalTax"
      ],
      raw: true,
    });

    // Step 3: Owner + Renter Names
    const ownerRenterNM = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIDs } },
      attributes: [
        "OwnerID",
        "MarathiOwnerName",
        "MarathiRenterName",
        "MarathiOccupierName",
        "OccupierName"
      ],
      raw: true,
    });

    // Step 4: Latest Finance Year
    const latestFinanceYearRecord = await TransMast.findOne({
      attributes: [[fn("MAX", col("FinanceYear")), "FinanceYear"]],
      raw: true,
    });
    const latestFinanceYear = latestFinanceYearRecord?.FinanceYear;

    // Step 5: Proposed Taxes
    const transData = await TransMast.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        FinanceYear: latestFinanceYear,
        RateableValue: { [Op.ne]: 0 },
        TaxTotal: 0,
      },
      attributes: [
        "OwnerID",
        "RateableValue",
        "PropertyTax",
        "TaxTotal"
      ],
      raw: true,
    });

    const validOwnerIDs = transData.map(t => t.OwnerID);

    // Step 6: PropertyDetailsNew (Area & Rent Aggregation)
    const detailsData = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: validOwnerIDs } },
      attributes: [
        "OwnerID",
        [fn("SUM", col("CarpetAreaSqFeet")), "TotalArea"],
        [fn("SUM", col("Rent")), "TotalRent"]
      ],
      group: ["OwnerID"],
      raw: true,
    });

    // Step 7: Property Type Master
    const typeData = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true,
    });

    // Step 8: Merge Final Records
    const finalData = properties
      .filter(p => validOwnerIDs.includes(p.OwnerID))
      .map(p => {
        const old = oldDetails.find(o => o.OwnerID === p.OwnerID) || {};
        const owner = ownerRenterNM.find(o => o.OwnerID === p.OwnerID) || {};
        const trans = transData.find(t => t.OwnerID === p.OwnerID) || {};
        const details = detailsData.find(d => d.OwnerID === p.OwnerID) || {};
        const type = typeData.find(t => t.PropertyTypeID === p.PropertyTypeID) || {};

        return {
          OwnerID: p.OwnerID,
          NewZoneNo: p.NewZoneNo,
          NewWardNo: p.NewWardNo,
          NewPropertyNo: p.NewPropertyNo,
          NewPartitionNo: p.NewPartitionNo,
          OldWardNo: old.OldWardNo,
          OldPropertyNo: old.OldPropertyNo,
          OldPartitionNo: old.OldPartitionNo,
          OwnerName: owner.MarathiOwnerName,
          RenterName: owner.MarathiRenterName,
          MarathiOccupierName: owner.MarathiOccupierName,
          OccupierName: owner.OccupierName,
          BuildingOrShopNameMarathi: p.BuildingOrShopNameMarathi,
          PropertyDescription: type.PropertyDescription,
          OwnerPatta: p.OwnerPatta,
          OldRV: old.OldRV,
          OldPropertyTax: old.OldPropertyTax,
          OldTotalTax: old.OldTotalTax,
          TotalArea: details.TotalArea,
          TotalRent: details.TotalRent,
          ProposedRV: trans.RateableValue,
          ProposedPropertyTax: trans.PropertyTax,
          ProposedTotalTax: trans.TaxTotal
        };
      });

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//63 Data Entry Gap
export const getDataEntryGapReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1: Get OwnerIDs with NO PropertyDetailsNew
    const ownersNoDetails = await PropertyMast.findAll({
      where: {
        OpenPlot: 0,
        CombPropRemark: { [Op.ne]: "Yes" },
        PropertyRemark: { [Op.notLike]: "%comb%" }
      },
      attributes: ["OwnerID"],
      include: [
        {
          model: PropertyDetailsNew,
          required: false, 
          attributes: ["OwnerID"]
        }
      ],
      raw: true
    });

    // Extract OwnerIDs with NO PropertyDetailsNew
    const idsNoDetails = ownersNoDetails
      .filter(o => !o["PropertyDetailsNew.OwnerID"]) 
      .map(o => o.OwnerID);

    // Step 2: Get OwnerIDs with PropertyDetailsNew having CarpetAreaSqFeet <= 1
    const ownersLowCarpet = await PropertyDetailsNew.findAll({
      where: {
        CarpetAreaSqFeet: { [Op.lte]: 1 }
      },
      attributes: ["OwnerID"],
      raw: true
    });
    const idsLowCarpet = ownersLowCarpet.map(o => o.OwnerID);

    // Step 3: Combine both sets of OwnerIDs
    const ids_NoDetails = [...new Set([...idsNoDetails, ...idsLowCarpet])];

    if (!ids_NoDetails.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 4: Fetch final master data
    const finalData = await PropertyMast.findAll({
      where: {
        OwnerID: { [Op.in]: ids_NoDetails },
        NewWardNo: { [Op.in]: wardNos }
      },
      attributes: [
        "OwnerID",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        [
          fn(
            "CONCAT",
            col("OwnerNameMarathi"),
           
          ),
          "OwnerName"
        ]
      ],
      raw: true,
      order: [
        ["NewWardNo", "ASC"],
        ["NewPropertyNo", "ASC"],
        ["NewPartitionNo", "ASC"]
      ]
    });

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//64 Utility Mismatch Property
  export const getUtilityMismatchReport = async (req, res) => {
    try {
      let { wardNos } = req.body;

      if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide at least one Ward No"
        });
      }
      if (!Array.isArray(wardNos)) wardNos = [wardNos];

      // Step 1: Get OwnerIDs from PropertyMast for selected wards
      const ownersInWard = await PropertyMast.findAll({
        where: { NewWardNo: { [Op.in]: wardNos } },
        attributes: ["OwnerID"],
        raw: true
      });
      const ownerIDs = ownersInWard.map(o => o.OwnerID);

      if (!ownerIDs.length) {
        return res.status(200).json({ success: true, totalRecords: 0, data: [] });
      }

      // Step 2: Get mismatched OwnerIDs using stored procedure
      const mismatchResult = await sequelize.query(
        `CALL GetMisMatchOwnerIDsForUtility(:wardNo)`,
        {
          replacements: { wardNo: wardNos[0] }, 
          type: sequelize.QueryTypes.SELECT
        }
      );

      // Normalize stored procedure result
      let mismatchIDs = [];
      if (Array.isArray(mismatchResult)) {
        if (mismatchResult.length > 0 && Array.isArray(mismatchResult[0])) {
          mismatchIDs = mismatchResult[0];
        } else {
          mismatchIDs = mismatchResult;
        }
      }
      let mismatchOwnerIDs = mismatchIDs.map(x => x.OwnerID).filter(Boolean);

      // Step 3: Keep only OwnerIDs that are in selected wards
      mismatchOwnerIDs = mismatchOwnerIDs.filter(id => ownerIDs.includes(id));

      if (!mismatchOwnerIDs.length) {
        return res.status(200).json({ success: true, totalRecords: 0, data: [] });
      }

      // Step 4: Fetch full PropertyMast data with joins
      const finalData = await PropertyMast.findAll({
        where: {
          OwnerID: { [Op.in]: mismatchOwnerIDs },
          NewWardNo: { [Op.in]: wardNos }
        },
        attributes: [
          "NewZoneNo",
          "NewWardNo",
          "NewPropertyNo",
          "NewPartitionNo",
          "OldWardNo",
          "OldPropertyNo",
          "OldPartitionNo",
          [fn("MAX", col("CombinedOwnerName.MarathiOwnerName")), "OwnerName"],
          [fn("MAX", col("CombinedOwnerName.MarathiRenterName")), "RenterName"],
          "BuildingOrShopNameMarathi",
          [col("PropertyTypeMaster.PropertyDescription"), "PropertyDescription"],
          "MarathiOwnerPatta",
          [fn("SUM", col("PropertyDetailsNew.CarpetAreaSqFeet")), "TotalCarpetArea"],
          [fn("SUM", col("PropertyDetailsNew.Rent")), "TotalRent"],
          "OldRV",
          "OldPropertyTax",
          "OldTotalTax",
          [col("TransMast.RateableValue"), "ProposedRV"],
          [col("TransMast.PropertyTax"), "ProposedPropertyTax"],
          [col("TransMast.TaxTotal"), "ProposedTotalTax"]
        ],
        include: [
          { model: CombinedOwnerName, attributes: [], required: false },
          { model: AppealMast, attributes: [], required: false },
          { model: TransMast, attributes: [], required: false },
          { model: PropertyTypeMaster, attributes: [], required: false },
          { model: PropertyDetailsNew, attributes: [], required: false }
        ],
        group: [
          "PropertyMast.NewZoneNo",
          "PropertyMast.NewWardNo",
          "PropertyMast.NewPropertyNo",
          "PropertyMast.NewPartitionNo",
          "PropertyMast.OldWardNo",
          "PropertyMast.OldPropertyNo",
          "PropertyMast.OldPartitionNo",
          "PropertyMast.BuildingOrShopNameMarathi",
          "PropertyMast.OwnerPatta",
          "AppealMast.AppealReason",
          "AppealMast.AppealRentalValue",
          "PropertyMast.OldRV",
          "PropertyMast.OldPropertyTax",
          "PropertyMast.OldTotalTax",
          "TransMast.RateableValue",
          "TransMast.PropertyTax",
          "TransMast.TaxTotal",
          "PropertyTypeMaster.PropertyDescription"
        ],
        order: [
          ["NewWardNo", "ASC"],
          ["NewPropertyNo", "ASC"],
          ["NewPartitionNo", "ASC"]
        ],
        raw: true
      });

      return res.status(200).json({
        success: true,
        totalRecords: finalData.length,
        data: finalData
      });

    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };
// 66 Tax is applied but tax value is Zero
export const getTaxAppliedTaxZeroReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1: Get OwnerIDs directly from PropertyMast by Ward
    const ownersInWard = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: ["OwnerID"],
      raw: true
    });

    const ownerIdsFromWard = ownersInWard.map(o => o.OwnerID);
    if (!ownerIdsFromWard.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 2: Filter PropertyDetailsNew where TypeOFUse not 'N' and OwnerID in ward
    const ownersWithType = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIdsFromWard }, TypeOFUse: { [Op.ne]: 'N' } },
      attributes: ["OwnerID"],
      raw: true
    });
    const idsWithType = ownersWithType.map(o => o.OwnerID);
    if (!idsWithType.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 3: ApplyTaxesMaster filter (PropertyTax = 1)
    const taxedOwners = await ApplyTaxesMaster.findAll({
      where: { OwnerID: { [Op.in]: idsWithType }, PropertyTax: 1 },
      attributes: ["OwnerID"],
      raw: true
    });
    const taxedOwnerIds = taxedOwners.map(o => o.OwnerID);
    if (!taxedOwnerIds.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 4: TransMast filter (latest FinanceYear, PropertyTax = 0)
    const latestFinance = await TransMast.max('FinanceYear');
    const financeOwners = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: taxedOwnerIds }, FinanceYear: latestFinance, PropertyTax: 0 },
      attributes: ["OwnerID"],
      raw: true
    });
    const financeOwnerIds = financeOwners.map(o => o.OwnerID);
    if (!financeOwnerIds.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 5: PropertyTypeMaster filter (Type != 'N')
    const validPropertyOwners = await PropertyTypeMaster.findAll({
      where: { OwnerID: { [Op.in]: financeOwnerIds }, Type: { [Op.ne]: 'N' } },
      attributes: ["OwnerID"],
      raw: true
    });
    const finalOwnerIds = validPropertyOwners.map(o => o.OwnerID);
    if (!finalOwnerIds.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 6: Fetch final PropertyMast data for these OwnerIDs
    const finalData = await PropertyMast.findAll({
      where: {
        OwnerID: { [Op.in]: finalOwnerIds },
        NewWardNo: { [Op.in]: wardNos },
        NewZoneNo: { [Op.ne]: 'z' },
        CombPropRemark: { [Op.ne]: 'Yes' },
        Remark: { [Op.notLike]: '%comb%' }
      },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        [literal(`dbo.funGetCombinedOwnerRenterNames(OwnerID)`), "CombinedOwnerRenterName"]
      ],
      order: [
        [fn('AlphaNum', col('NewWardNo')), 'ASC'],
        [fn('AlphaNum', col('NewPropertyNo')), 'ASC'],
        [fn('AlphaNum', col('NewPartitionNo')), 'ASC']
      ],
      raw: true
    });

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData
    });

  } catch (error) {
    console.error("❌ Error getTaxAppliedTaxZeroReport →", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//67 Mutation
export const getMutationListByDate = async (req, res) => {
  try {
    let { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({ success: false, message: "Please provide From Date and To Date" });
    }

    // Validate that fromDate <= toDate
    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({ 
        success: false, 
        message: "'From Date' cannot be later than 'To Date'" 
      });
    }

    // Step 1: Get OwnerIDs from MutationDetails within date range
    const mutationOwners = await MutationDetails.findAll({
      where: {
        OrderTransferDate: { [Op.between]: [fromDate, toDate] } 
      },
      attributes: ['OwnerId'],
      group: ['OwnerId'],
      raw: true
    });

    const ownerIds = mutationOwners.map(o => o.OwnerId);
    if (!ownerIds.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 2: Fetch PropertyMast data for these OwnerIDs
    const finalData = await PropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ['OwnerID', 'NewZoneNo', 'NewWardNo', 'NewPropertyNo', 'NewPartitionNo'],
      order: [
        [fn('AlphaNum', col('NewWardNo')), 'ASC'],
        [fn('AlphaNum', col('NewPropertyNo')), 'ASC'],
        [fn('AlphaNum', col('NewPartitionNo')), 'ASC']
      ],
      raw: true
    });

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData
    });

  } catch (error) {
    console.error("❌ Error getMutationListByDate →", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//68 Property Chart
export const getWardWisePropertyReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (wardNos && !Array.isArray(wardNos)) {
      wardNos = [wardNos];
    }

    const reportData = await PropertyMast.findAll({
      attributes: [
        ['NewWardNo', 'नवीन प्रभाग क्र'],
        [fn('COUNT', col('NewPropertyNo')), 'मुख्य मालमत्ता'],
        [
          literal(`(
            SELECT COUNT(pm2.NewPartitionNo) 
            FROM PropertyMast pm2 
            WHERE pm2.NewPartitionNo <> '' 
              AND pm2.NewWardNo = PropertyMast.NewWardNo
          )`),
          'भाग क्रं मालमत्ता'
        ],
        // Total properties
        [
          literal(`(
            COUNT(PropertyMast.NewPropertyNo) + 
            IFNULL((
              SELECT COUNT(pm2.NewPartitionNo) 
              FROM PropertyMast pm2 
              WHERE pm2.NewPartitionNo <> '' 
                AND pm2.NewWardNo = PropertyMast.NewWardNo
            ), 0)
          )`),
          'एकूण मालमत्ता'
        ],
        [
          literal(`(
            IFNULL((
              SELECT COUNT(*) 
              FROM PropertyMast pm3 
              WHERE pm3.OpenPlot = 1 
                AND pm3.NewWardNo = PropertyMast.NewWardNo
            ), 0)
          )`),
          'खुला भुखंड'
        ],
        [
          literal(`(
            (COUNT(PropertyMast.NewPropertyNo) + 
            IFNULL((
              SELECT COUNT(pm2.NewPartitionNo) 
              FROM PropertyMast pm2 
              WHERE pm2.NewPartitionNo <> '' 
                AND pm2.NewWardNo = PropertyMast.NewWardNo
            ), 0)) - 
            IFNULL((
              SELECT COUNT(*) 
              FROM PropertyMast pm3 
              WHERE pm3.OpenPlot = 1 
                AND pm3.NewWardNo = PropertyMast.NewWardNo
            ), 0)
          )`),
          'इमारती'
        ]
      ],
      where: {
        [Op.or]: [
          { NewPartitionNo: '' },
          { NewPartitionNo: null }
        ],
        ...(wardNos && wardNos.length ? { NewWardNo: { [Op.in]: wardNos } } : {})
      },
      group: ['NewWardNo'],
      
      raw: true
    });

    return res.status(200).json({
      success: true,
      totalRecords: reportData.length,
      data: reportData
    });

  } catch (error) {
    console.error("❌ Error getWardWisePropertyReport →", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//zonnig 69
export const getWardWiseZoneReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    if (wardNos && !Array.isArray(wardNos)) {
      wardNos = [wardNos];
    }

    const reportData = await PropertyMast.findAll({
      where: {
        NewWardNo: { [Op.notLike]: "D_%" },
        ...(wardNos?.length ? { NewWardNo: { [Op.in]: wardNos } } : {})
      },

      attributes: [
        ["NewWardNo", "नवीन प्रभाग क्र"],
        [literal("COUNT(*)"), "एकूण मालमत्ता"],
        [literal("GROUP_CONCAT(DISTINCT OwnerID)"), "OwnerIDs"],

        // 👉 Zone-wise property count columns
        // 1 → aa 2 → bb 3 → cc 4 → dd 5 → ee 

        [literal(`SUM(CASE WHEN NewZoneNo = 'Z' THEN 1 ELSE 0 END)`), "Z"],
        [literal(`SUM(CASE WHEN NewZoneNo = '1' THEN 1 ELSE 0 END)`), "1"],
        [literal(`SUM(CASE WHEN NewZoneNo = '2' THEN 1 ELSE 0 END)`), "2"],
        [literal(`SUM(CASE WHEN NewZoneNo = '3' THEN 1 ELSE 0 END)`), "3"],
        [literal(`SUM(CASE WHEN NewZoneNo = '4' THEN 1 ELSE 0 END)`), "4"],
        [literal(`SUM(CASE WHEN NewZoneNo = '5' THEN 1 ELSE 0 END)`), "5"],
      ],

      group: ["NewWardNo"],

 
      raw: true
    });

    return res.status(200).json({
      success: true,
      totalRecords: reportData.length,
      data: reportData,
    });

  } catch (error) {
    console.error("❌ Error getWardWiseZoneReport:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
//70  Property is Non Taxable but Total Tax is Greater than Zero
export const getNonTaxableTotalTaxReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get PropertyMast for ward
    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: ["OwnerID", "NewZoneNo", "PropertyTypeID", "NewWardNo", "NewPropertyNo", "NewPartitionNo"]
    });

    const ownerIds = properties.map(p => p.OwnerID);
    const propertyTypeIds = properties.map(p => p.PropertyTypeID);

    if (!ownerIds.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 2️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "OwnerName", "MarathiOwnerName", "RenterName", "MarathiOccupierName"]
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || o.OwnerName || "",
        RenterName: o.RenterName || o.RenterName || ""
      };
    });

    // Step 3️⃣: Fetch Property Type Descriptions
    const propertyTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
      attributes: ["PropertyTypeID", "PropertyDescription", "Type"]
    });

    const propertyTypeMap = {};
    propertyTypes.forEach(pt => {
      propertyTypeMap[pt.PropertyTypeID] = {
        description: pt.PropertyDescription || "",
        type: pt.Type || ""
      };
    });

    // Step 4️⃣: Fetch latest TransMast for these owners
    const latestFinance = await TransMast.max("FinanceYear");
    const transRecords = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds }, FinanceYear: latestFinance, TaxTotal: { [Op.gt]: 0 } }
    });

    // Step 5️⃣: Fetch OldPropertyMast
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } }
    });

    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      const key = `${op.OwnerID}-${op.NewWardNo}-${op.NewPropertyNo}-${op.NewPartitionNo}`;
      oldPropertyMap[key] = {
        oldRV: op.OldRV || null,
        oldTotalTax: op.OldTotalTax || null
      };
    });

    // Step 6️⃣: Fetch PropertyDetailsNew
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "Rent", "CarpetAreaSqFeet", "CarpetAreaSqMeter"]
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      if (!propertyDetailsMap[pd.OwnerID]) {
        propertyDetailsMap[pd.OwnerID] = {
          rent: Number(pd.Rent) || 0,
          carpetAreaSqFeet: Number(pd.CarpetAreaSqFeet) || 0,
          carpetAreaSqMeter: Number(pd.CarpetAreaSqMeter) || 0
        };
      } else {
        propertyDetailsMap[pd.OwnerID].rent += Number(pd.Rent) || 0;
        propertyDetailsMap[pd.OwnerID].carpetAreaSqFeet += Number(pd.CarpetAreaSqFeet) || 0;
        propertyDetailsMap[pd.OwnerID].carpetAreaSqMeter += Number(pd.CarpetAreaSqMeter) || 0;
      }
    });

    // Step 7️⃣: Map final response
    const result = transRecords.map(tr => {
      const propInfo = properties.find(p => p.OwnerID === tr.OwnerID) || {};
      const typeInfo = propertyTypeMap[propInfo.PropertyTypeID] || {};
      const oldKey = `${tr.OwnerID}-${propInfo.NewWardNo}-${propInfo.NewPropertyNo}-${propInfo.NewPartitionNo}`;
      const oldProp = oldPropertyMap[oldKey] || {};
      const ownerNamesInfo = ownerNameMap[tr.OwnerID] || {};
      const propDetail = propertyDetailsMap[tr.OwnerID] || {};

      // Filter only Type N, T, V OR Zone Z
      if (!(typeInfo.type && ["N","T","V"].includes(typeInfo.type)) && propInfo.NewZoneNo !== "Z") return null;

      return {
        ownerId: tr.OwnerID,
        ownerName: ownerNamesInfo.ownerName,
        RenterName: ownerNamesInfo.RenterName,
        financeYear: tr.FinanceYear,
        taxTotal: tr.TaxTotal,

        newZoneNo: propInfo.NewZoneNo || "",
        newWardNo: propInfo.NewWardNo || "",
        newPropertyNo: propInfo.NewPropertyNo || "",
        newPart: propInfo.NewPartitionNo || "",
        propertyDesc: typeInfo.description,

        oldRV: oldProp.oldRV,
        oldTotalTax: oldProp.oldTotalTax,

        rent: propDetail.rent,
        carpetAreaSqFeet: propDetail.carpetAreaSqFeet,
        carpetAreaSqMeter: propDetail.carpetAreaSqMeter
      };
    }).filter(r => r !== null); // remove filtered out rows

    // ✅ Response
    return res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result
    });

  } catch (error) {
    console.error("❌ Error getNonTaxableTotalTaxReport:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//71 Property is Taxable but Total Tax is Zero
export const getNonTaxableZeroTaxReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get OwnerIDs + PropertyTypeIDs
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: ["OwnerID","NewZoneNo","PropertyTypeID","NewWardNo","NewPropertyNo","NewPartitionNo"],
    });

    const ownerIds = owners.map(o => o.OwnerID);
    const propertyTypeIds = owners.map(o => o.PropertyTypeID);

    if (!ownerIds.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 2️⃣: Fetch Owner Names
    const ownerNames = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID","OwnerName","MarathiOwnerName","RenterName","MarathiOccupierName"],
    });

    const ownerNameMap = {};
    ownerNames.forEach(o => {
      ownerNameMap[o.OwnerID] = {
        ownerName: o.MarathiOwnerName || o.OwnerName || "",
        RenterName: o.RenterName || o.RenterName || "",
      };
    });

    // Step 3️⃣: Fetch Property Type Descriptions
    const propertyTypes = await PropertyTypeMaster.findAll({
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
      attributes: ["PropertyTypeID","PropertyDescription","Type"],
    });

    const propertyTypeMap = {};
    propertyTypes.forEach(pt => {
      propertyTypeMap[pt.PropertyTypeID] = {
        description: pt.PropertyDescription || "",
        type: pt.Type || "",
      };
    });

    // Step 4️⃣: Fetch latest TransMast (TaxTotal = 0)
    const latestFinance = await TransMast.max("FinanceYear");
    const transRecords = await TransMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds }, FinanceYear: latestFinance, TaxTotal: 0 }
    });

    // Step 5️⃣: Fetch OldPropertyMast
    const oldProperties = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } }
    });

    const oldPropertyMap = {};
    oldProperties.forEach(op => {
      oldPropertyMap[op.OwnerID] = {
        oldWard: op.OldWardNo || "",
        oldProperty: op.OldPropertyNo || "",
        oldPart: op.OldPartitionNo || "",
        oldRV: op.OldRV || null,
        oldPropertyTax: op.OldPropertyTax || null,
        oldTotalTax: op.OldTotalTax || null
      };
    });

    // Step 6️⃣: Fetch PropertyDetailsNew
    const propertyDetails = await PropertyDetailsNew.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID","Rent","CarpetAreaSqFeet","CarpetAreaSqMeter"]
    });

    const propertyDetailsMap = {};
    propertyDetails.forEach(pd => {
      const ownerId = pd.OwnerID;
      const rent = Number(pd.Rent) || 0;
      const sqft = Number(pd.CarpetAreaSqFeet) || 0;
      const sqm = Number(pd.CarpetAreaSqMeter) || 0;

      if (!propertyDetailsMap[ownerId]) {
        propertyDetailsMap[ownerId] = { rent, carpetAreaSqFeet: sqft, carpetAreaSqMeter: sqm };
      } else {
        propertyDetailsMap[ownerId].rent += rent;
        propertyDetailsMap[ownerId].carpetAreaSqFeet += sqft;
        propertyDetailsMap[ownerId].carpetAreaSqMeter += sqm;
      }
    });

    // Step 7️⃣: Map Final Response
    const result = transRecords.map(tr => {
      const names = ownerNameMap[tr.OwnerID] || {};
      const oldProp = oldPropertyMap[tr.OwnerID] || {};
      const propertyInfo = owners.find(o => o.OwnerID === tr.OwnerID) || {};
      const typeInfo = propertyTypeMap[propertyInfo.PropertyTypeID] || {};
      const propertyDetail = propertyDetailsMap[tr.OwnerID] || {};

      // ✅ Corrected SQL logic: ptm.type NOT IN ('N','T','V') OR NewZoneNo <> 'Z'
      if (typeInfo.type && ["N","T","V"].includes(typeInfo.type) && propertyInfo.NewZoneNo === "Z") return null;

      return {
        ownerId: tr.OwnerID,
        ownerName: names.ownerName,
        RenterName: names.RenterName,
        financeYear: tr.FinanceYear,
        taxTotal: tr.TaxTotal,

        newZoneNo: propertyInfo.NewZoneNo || "",
        newWardNo: propertyInfo.NewWardNo || "",
        newPropertyNo: propertyInfo.NewPropertyNo || "",
        newPart: propertyInfo.NewPartitionNo || "",
        propertyDesc: typeInfo.description,

        rent: propertyDetail.rent,
        carpetAreaSqFeet: propertyDetail.carpetAreaSqFeet,
        carpetAreaSqMeter: propertyDetail.carpetAreaSqMeter,

        oldWard: oldProp.oldWard,
        oldProperty: oldProp.oldProperty,
        oldPart: oldProp.oldPart,
        oldRV: oldProp.oldRV,
        oldPropertyTax: oldProp.oldPropertyTax,
        oldTotalTax: oldProp.oldTotalTax
      };
    }).filter(r => r !== null);

    // ✅ Response
    res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });

  } catch (error) {
    console.error("❌ Error fetching NonTaxableZeroTaxReport:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//72-86 flat
// ✅ Helper: alphanumeric sort
const alphaNumSort = (a, b) => {
  const regex = /(\d+)|(\D+)/g;
  const aParts = a?.toString().match(regex) || [];
  const bParts = b?.toString().match(regex) || [];
  const len = Math.min(aParts.length, bParts.length);
  for (let i = 0; i < len; i++) {
    const aVal = isNaN(aParts[i]) ? aParts[i] : Number(aParts[i]);
    const bVal = isNaN(bParts[i]) ? bParts[i] : Number(bParts[i]);
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
  }
  return aParts.length - bParts.length;
};

// ✅ Helper: get unique OwnerIDs based on field
const getUniqueOwnerSet = (data, fieldName) => {
  const map = {};
  data.forEach((d) => {
    const val = d[fieldName];
    if (val != null) {
      if (!map[val]) map[val] = [];
      map[val].push(d.OwnerID);
    }
  });
  const uniqueOwners = new Set();
  Object.values(map).forEach((arr) => {
    if (arr.length === 1) arr.forEach((id) => uniqueOwners.add(id));
  });
  return uniqueOwners;
};

export const getFlatSystemUniqueProperties = async (req, res) => {
  try {
    let { wardNos, fromPropertyNo, toPropertyNo, bhk } = req.body;

    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide wardNos as a non-empty array",
      });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    if (fromPropertyNo == null || toPropertyNo == null) {
      return res.status(400).json({
        success: false,
        message: "Please provide fromPropertyNo and toPropertyNo",
      });
    }

    // Step 1: Base filter
    const whereFilter = {
      FlatSystemRemark: "Flat System",
      NewWardNo: { [Op.in]: wardNos },
      NewPropertyNo: { [Op.between]: [fromPropertyNo, toPropertyNo] },
    };
    if (bhk && bhk > 0) whereFilter.BHK = bhk;

    // Step 2: Base PropertyMast
    const baseProperties = await PropertyMast.findAll({
      where: whereFilter,
      attributes: [
        "OwnerID",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "NewZoneNo",
        "NewToiletNo",
        "PlotArea",
        "PropertyTypeID",
        "BuildingOrShopNameMarathi",
        "BuildingOrFlatNoMarathi",
      ],
      raw: true,
    });

    if (!baseProperties.length) {
      return res.status(200).json({
        success: true,
        totalRecords: 0,
        data: [],
        message: "No properties found with the given criteria",
      });
    }

    const ownerIDs = baseProperties.map((p) => p.OwnerID);

    // Step 3: Old Property Data
    const oldPropertyData = await OldPropertyMast.findAll({
      attributes: ["OwnerID", "OldRV", "OldPropertyTax", "OldTotalTax"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true,
    });

    // Step 4: Old & New Carpet Area
    const oldCarpetArea = await PropertyDetailsOld.findAll({
      attributes: [
        "OwnerID",
        [fn("ROUND", fn("SUM", col("OldCarpetAreaSqMeter")), 0), "OldCarpetArea"],
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      group: ["OwnerID"],
      raw: true,
    });
    const newCarpetArea = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [fn("ROUND", fn("SUM", col("CarpetAreaSqMeter")), 0), "CarpetArea"],
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      group: ["OwnerID"],
      raw: true,
    });

    // Step 5: ConstructionType & ConstructionYear
    const constructionCounts = await PropertyDetailsNew.findAll({
      attributes: [
        "ConstructionType",
        [fn("COUNT", col("OwnerID")), "count"],
      ],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      group: ["ConstructionType"],
      raw: true,
    });
    const uniqueConstructionTypes = constructionCounts
      .filter(c => c.count <= 1)
      .map(c => c.ConstructionType);
    const constructionData = await PropertyDetailsNew.findAll({
      attributes: ["OwnerID", "ConstructionType", "ConstructionYear"],
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        ConstructionType: { [Op.in]: uniqueConstructionTypes },
      },
      raw: true,
    });

    // Step 6: RateableValue
    const transData = await TransMast.findAll({
      attributes: ["OwnerID", "RateableValue"],
      where: { OwnerID: { [Op.in]: ownerIDs } },
      raw: true,
    });

    // Step 7: Images check
    const imagesData = await PropertyImageMast.findAll({
      attributes: ["OwnerID", "PropertyPhotoB"],
      where: { OwnerID: { [Op.in]: ownerIDs }, PropertyPhotoB: null },
      raw: true,
    });

    // Step 8: PropertyType description
    const typeIds = baseProperties.map((p) => p.PropertyTypeID);
    const typeData = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      where: { PropertyTypeID: { [Op.in]: typeIds } },
      raw: true,
    });

    // Step 9: Map data
    const oldMap = {};
    oldPropertyData.forEach(o => oldMap[o.OwnerID] = o);
    const oldCarpetMap = {};
    oldCarpetArea.forEach(o => oldCarpetMap[o.OwnerID] = o.OldCarpetArea);
    const newCarpetMap = {};
    newCarpetArea.forEach(o => newCarpetMap[o.OwnerID] = o.CarpetArea);
    const constructionMap = {};
    constructionData.forEach(c => {
      constructionMap[c.OwnerID] = {
        constructionType: c.ConstructionType,
        constructionYear: c.ConstructionYear,
      };
    });
    const transMap = {};
    transData.forEach(t => transMap[t.OwnerID] = t.RateableValue);
    const imageMap = {};
    imagesData.forEach(i => imageMap[i.OwnerID] = true);
    const typeMap = {};
    typeData.forEach(t => typeMap[t.PropertyTypeID] = t.PropertyDescription);

    // Step 10: Merge base data
    let finalData = baseProperties.map(p => ({
      OwnerID: p.OwnerID,
      ward: p.NewWardNo,
      propertyNo: p.NewPropertyNo,
      partitionNo: p.NewPartitionNo,
      zoneNo: p.NewZoneNo,
      newToiletNo: p.NewToiletNo,
      plotArea: p.PlotArea,
      propertyType: typeMap[p.PropertyTypeID] || "",
      BuildingOrShopNameMarathi: p.BuildingOrShopNameMarathi,
      BuildingOrFlatNoMarathi: p.BuildingOrFlatNoMarathi,
      oldCarpetArea: oldCarpetMap[p.OwnerID] || 0,
      newCarpetArea: newCarpetMap[p.OwnerID] || 0,
      constructionType: constructionMap[p.OwnerID]?.constructionType || "",
      constructionYear: constructionMap[p.OwnerID]?.constructionYear || null,
      rateableValue: transMap[p.OwnerID] || null,
      hasNoImage: imageMap[p.OwnerID] || false,
      oldRV: oldMap[p.OwnerID]?.OldRV || null,
      oldPropertyTax: oldMap[p.OwnerID]?.OldPropertyTax || null,
      oldTotalTax: oldMap[p.OwnerID]?.OldTotalTax || null,
    }));

    // Step 11: Unique filtering based on SP #72–86
    const uniqueOldRV = getUniqueOwnerSet(oldPropertyData, "OldRV");
    const uniqueOldPropertyTax = getUniqueOwnerSet(oldPropertyData, "OldPropertyTax");
    const uniqueOldTotalTax = getUniqueOwnerSet(oldPropertyData, "OldTotalTax");
    const uniqueNewToiletNo = getUniqueOwnerSet(baseProperties, "NewToiletNo");
    const uniquePlotArea = getUniqueOwnerSet(baseProperties, "PlotArea");
    const uniquePropertyDescription = getUniqueOwnerSet(typeData, "PropertyDescription");
    const uniqueMarathiImarateNav = getUniqueOwnerSet(baseProperties, "BuildingOrShopNameMarathi");
    const uniqueMarathiFlatNo = getUniqueOwnerSet(baseProperties, "BuildingOrFlatNoMarathi");
    const uniqueZoneNo = getUniqueOwnerSet(baseProperties, "NewZoneNo");

    finalData = finalData.filter(p =>
      uniqueOldRV.has(p.OwnerID) &&
      uniqueOldPropertyTax.has(p.OwnerID) &&
      uniqueOldTotalTax.has(p.OwnerID) &&
      uniqueNewToiletNo.has(p.OwnerID) &&
      uniquePlotArea.has(p.OwnerID) &&
      uniquePropertyDescription.has(p.OwnerID) &&
      uniqueMarathiImarateNav.has(p.OwnerID) &&
      uniqueMarathiFlatNo.has(p.OwnerID) &&
      uniqueZoneNo.has(p.OwnerID)
    );

    // Step 12: Sort alphanumerically
    finalData.sort((a, b) => {
      let res = alphaNumSort(a.ward, b.ward);
      if (res !== 0) return res;
      res = alphaNumSort(a.propertyNo, b.propertyNo);
      if (res !== 0) return res;
      return alphaNumSort(a.partitionNo, b.partitionNo);
    });

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData,
    });

  } catch (error) {
    console.error("Error in getFlatSystemUniqueProperties:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching FlatSystem properties",
      error: error.message,
    });
  }
};
//87 Construction Type like 'AR','BR','CR'

export const getConstructionAR = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // Validation
    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No",
      });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step-1: Filter PropertyMast by WardNos
    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "PropertyTypeID",
      ],
      raw: true,
    });

    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    const ownerIDs = [...new Set(properties.map(p => p.OwnerID))];

    // Step-2: Filter PropertyDetailsNew
    const detailsData = await PropertyDetailsNew.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIDs },
        ConstructionType: { [Op.like]: "%R%" },
        Rent: 0,
        NonCalculateRent: 0,
        TypeOFUse: { [Op.ne]: "V" },
      },
      attributes: ["OwnerID"],
      raw: true,
    });

    const validOwnerIDs = [...new Set(detailsData.map(x => x.OwnerID))];

    if (!validOwnerIDs.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step-3: Call SQL Function — funGetCombinedOwnerRenterNames()
    const ownerRenterNM = await db.sequelize.query(
      `SELECT OwnerID, MarathiOwnerName, MarathiRenterName 
       FROM dbo.funGetCombinedOwnerRenterNames()
       WHERE OwnerID IN (:ids)`,
      {
        replacements: { ids: validOwnerIDs },
        type: QueryTypes.SELECT,
      }
    );

    // Step-4: Property Type Master
    const typeData = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true,
    });

    // Step-5: Old Property Taxes
    const oldTaxData = await PropertyMast.findAll({
      where: { OwnerID: { [Op.in]: validOwnerIDs } },
      attributes: ["OwnerID", "OldRV", "OldTotalTax"],
      raw: true,
    });

    // Step-6: Merge Final Result
    let finalData = properties
      .filter(p => validOwnerIDs.includes(p.OwnerID))
      .map(p => {
        const owner = ownerRenterNM.find(o => o.OwnerID === p.OwnerID) || {};
        const old = oldTaxData.find(o => o.OwnerID === p.OwnerID) || {};
        const type = typeData.find(t => t.PropertyTypeID === p.PropertyTypeID) || {};

        return {
          NewZoneNo: p.NewZoneNo,
          NewWardNo: p.NewWardNo,
          NewPropertyNo: p.NewPropertyNo,
          NewPartitionNo: p.NewPartitionNo,
          MarathiOwnerName: owner.MarathiOwnerName,
          MarathiRenterName: owner.MarathiRenterName,
          OldRV: old.OldRV,
          OldTotalTax: old.OldTotalTax,
          PropertyDescription: type.PropertyDescription,
        };
      });

    // Step-7: Sort by AlphaNum logic
    finalData.sort((a, b) => {
      const wardA = a.NewWardNo.toString().padStart(10, "0");
      const wardB = b.NewWardNo.toString().padStart(10, "0");
      if (wardA !== wardB) return wardA.localeCompare(wardB);

      const propA = a.NewPropertyNo.toString().padStart(10, "0");
      const propB = b.NewPropertyNo.toString().padStart(10, "0");
      if (propA !== propB) return propA.localeCompare(propB);

      const partA = a.NewPartitionNo.toString().padStart(10, "0");
      const partB = b.NewPartitionNo.toString().padStart(10, "0");
      return partA.localeCompare(partB);
    });

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData,
    });

  } catch (error) {
    console.error("Error in getConstructionAR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// 88 - OldTotalTax > OldRV OR OldPropertyTax > OldRV
export const getOldTaxGreaterThanRvReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // Validation
    if (!wardNos || !Array.isArray(wardNos) || wardNos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one Ward No",
      });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1: Fetch property & old tax data
    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos } },
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "PropertyTypeID",
      ],
      include: [
        {
          model: OldPropertyMast,
          required: true,
          attributes: ["OldRV", "OldTotalTax", "OldPropertyTax"],
          where: {
            [Op.or]: [
              { OldTotalTax: { [Op.gt]: Sequelize.col("OldPropertyMast.OldRV") } },
              { OldPropertyTax: { [Op.gt]: Sequelize.col("OldPropertyMast.OldRV") } }
            ]
          }
        }
      ],
      raw: true,
    });

    if (!properties.length) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 2: Extract unique OwnerIDs
    const ownerIDs = [...new Set(properties.map(p => p.OwnerID))];

    // Step 3: Call Stored Procedure (MySQL compatible)
    let spRows = [];
    try {
      const spCall = await sequelize.query(
        "CALL funGetCombinedOwnerRenterNames();",
        { type: QueryTypes.RAW }
      );
      spRows = spCall[0] || [];
    } catch (error) {
      console.warn("SP failed, skipping SP merge:", error.message);
      spRows = [];
    }

    // Filter SP result by OwnerID
    const ownerRenterNM = spRows.filter(row =>
      ownerIDs.includes(row.OwnerID)
    );

    // Step 4: Property Type Master
    const typeData = await PropertyTypeMaster.findAll({
      attributes: ["PropertyTypeID", "PropertyDescription"],
      raw: true,
    });

    // Step 5: Merge final data
    const finalData = properties.map(p => {
      const owner = ownerRenterNM.find(o => o.OwnerID === p.OwnerID) || {};
      const type = typeData.find(t => t.PropertyTypeID === p.PropertyTypeID) || {};

      return {
        NewZoneNo: p.NewZoneNo,
        NewWardNo: p.NewWardNo,
        NewPropertyNo: p.NewPropertyNo,
        NewPartitionNo: p.NewPartitionNo,

        MarathiOwnerName: owner.MarathiOwnerName || "",
        MarathiRenterName: owner.MarathiRenterName || "",

        OldRV:
      p["OldPropertyMast.OldRV"] ??
      p["oldrv"] ??
      p["OldRV"] ??
      0,

    OldTotalTax:
      p["OldPropertyMast.OldTotalTax"] ??
      p["OldTotalTax"] ??
      0,

    OldPropertyTax:
      p["OldPropertyMast.OldPropertyTax"] ??
      p["OldPropertyTax"] ??
      0,
        PropertyDescription: type.PropertyDescription || "",
      };
    });

    // Step 6: Sorting Like AlphaNum
    finalData.sort((a, b) => {
      const wA = a.NewWardNo.toString().padStart(10, "0");
      const wB = b.NewWardNo.toString().padStart(10, "0");
      if (wA !== wB) return wA.localeCompare(wB);

      const pA = a.NewPropertyNo.toString().padStart(10, "0");
      const pB = b.NewPropertyNo.toString().padStart(10, "0");
      if (pA !== pB) return pA.localeCompare(pB);

      const partA = a.NewPartitionNo.toString().padStart(10, "0");
      const partB = b.NewPartitionNo.toString().padStart(10, "0");
      return partA.localeCompare(partB);
    });

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData,
    });

  } catch (error) {
    console.error("Error in getOldTaxGreaterThanRvReport:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//90 Commercial properties but education tax is not applied


export const getCommTaxZeroReport = async (req, res) => {
  try {
    let { wardNos } = req.body;

    // ✅ Validate input
    if (!wardNos || (Array.isArray(wardNos) && wardNos.length === 0)) {
      return res.status(400).json({ success: false, message: "Please provide at least one Ward No" });
    }
    if (!Array.isArray(wardNos)) wardNos = [wardNos];

    // Step 1️⃣: Get latest FinanceYear
    const latestYear = await TransMast.max("FinanceYear");

    // Step 2️⃣: Find owners in wards
    const owners = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardNos }, NewZoneNo: { [Op.ne]: "Z" } },
      attributes: ["OwnerID", "NewWardNo", "NewPropertyNo", "NewPartitionNo"],
    });

    const ownerIds = owners.map(o => o.OwnerID);
    if (ownerIds.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 3️⃣: Find eligible TypeOfUse IDs where EducationTax = 1 AND Type = 'C'
    const typeIdsData = await ApplyTaxMasterPrime.findAll({
      where: { EducationTax: true, Type: 'C' },
      attributes: ["TypeofUseId"],
      raw: true,
    });
    const typeIds = typeIdsData.map(t => t.TypeofUseId);

    // Step 4️⃣: Find eligible OwnerIDs from PropertyDetailsNew
    const eligibleOwnersData = await PropertyDetailsNew.findAll({
      where: {
        OwnerID: { [Op.in]: ownerIds },
        TypeOFUse: { [Op.in]: typeIds },
      },
      attributes: ["OwnerID"],
      group: ["OwnerID"],
      raw: true,
    });
    const eligibleOwnerIds = eligibleOwnersData.map(e => e.OwnerID);

    if (eligibleOwnerIds.length === 0) {
      return res.status(404).json({ success: true, totalRecords: 0, data: [] });
    }

    // Step 5️⃣: Fetch TransMast records for eligible owners with EducationTax = 0 and latest year
    const transRecords = await TransMast.findAll({
      where: {
        OwnerID: { [Op.in]: eligibleOwnerIds },
        EducationTax: 0,
        FinanceYear: latestYear,
      },
      attributes: [
        "OwnerID",
      
        "FinanceYear",
        "EducationTax",
        "TaxTotal",
      ],
      // order: [
      //   [literal("dbo.AlphaNum(NewWardNo)")],
      //   [literal("dbo.AlphaNum(NewPropertyNo)")],
      //   [literal("dbo.AlphaNum(NewPartitionNo)")],
      // ],
      raw: true,
    });

    // Step 6️⃣: Map final response
    const result = transRecords.map(tr => {
      const propertyInfo = owners.find(o => o.OwnerID === tr.OwnerID) || {};
      return {
        ownerId: tr.OwnerID,
        newWardNo: propertyInfo.NewWardNo ,
        newPropertyNo: propertyInfo.NewPropertyNo ,
        newPart: propertyInfo.NewPartitionNo ,
        financeYear: tr.FinanceYear,
        educationTax: tr.EducationTax,
        taxTotal: tr.TaxTotal,
      };
    });

    // ✅ Response
    return res.status(200).json({
      success: true,
      totalRecords: result.length,
      data: result,
    });
    
  } catch (error) {
    console.error("❌ Error fetching Comm Tax Zero Report:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//percemtege 38
export const getOldVsNewRVPercentageReport = async (req, res) => {
  try {
    const { percent } = req.body;

    if (percent === undefined || percent === null) {
      return res.status(400).json({
        success: false,
        message: "Please provide percent value",
      });
    }

    // STEP 1: FETCH TransMast (New RV)
    const transRecords = await TransMast.findAll({
      where: { RateableValue: { [Op.gt]: 0 } },
      attributes: ["OwnerID", "RateableValue"],
    });

    const ownerIds = transRecords.map((t) => t.OwnerID);
    if (ownerIds.length === 0) {
      return res.status(200).json({ success: true, totalRecords: 0, data: [] });
    }

    // STEP 2: FETCH PropertyMast
    const properties = await PropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: [
        "OwnerID",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "OwnerName",
      ],
    });

    const propMap = {};
    properties.forEach((p) => {
      propMap[p.OwnerID] = {
        ward: p.NewWardNo,
        prop: p.NewPropertyNo,
        part: p.NewPartitionNo,
        ownerName: p.OwnerName || "",
      };
    });

    // STEP 3: FETCH OldPropertyMast
    const oldRecords = await OldPropertyMast.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "OldRV"],
    });

    const oldMap = {};
    oldRecords.forEach((o) => {
      oldMap[o.OwnerID] = { oldRV: o.OldRV || 0 };
    });

    // STEP 4: LEFT JOIN equivalent via CombinedOwnerName
    const ownerRenterRecords = await CombinedOwnerName.findAll({
      where: { OwnerID: { [Op.in]: ownerIds } },
      attributes: ["OwnerID", "MarathiOwnerName", "RenterName", "MarathiRenterName"],
    });

    const ownerRenterMap = {};
    ownerRenterRecords.forEach((o) => {
      ownerRenterMap[o.OwnerID] = {
        MarathiOwnerName: o.MarathiOwnerName || "",
        RenterName: o.RenterName || "",
        MarathiRenterName: o.MarathiRenterName || "",
      };
    });

    // STEP 5: OPTIONAL: FETCH SP OUTPUT (flatten for MySQL)
    let spMap = {};
    try {
      const spRaw = await sequelize.query("CALL funGetCombinedOwnerRenterNames();");
      const spData = spRaw[0] || []; 
      spData.forEach((row) => {
        spMap[row.OwnerID] = row;
      });
    } catch (err) {
      console.warn("SP execution skipped or failed, using model only.", err.message);
    }

    // STEP 6: FINAL MAPPING
    const finalData = transRecords
      .map((tr) => {
        const p = propMap[tr.OwnerID] || {};
        const o = oldMap[tr.OwnerID] || {};
        const nm = ownerRenterMap[tr.OwnerID] || {};
        const sp = spMap[tr.OwnerID] || {};

        const OldRV = Number(o.oldRV) || 0;
        const NewRV = Number(tr.RateableValue) || 0;
        const PercentValue = NewRV > 0 ? Number((OldRV / NewRV).toFixed(2)) : null;

        return {
          WardNo: p.ward || "",
          PropertyNo: p.prop || "",
          PartitionNo: p.part || "",
          OwnerName: p.ownerName || "",
          MarathiOwnerName: nm.MarathiOwnerName || sp.MarathiOwnerName || "",
          RenterName: nm.RenterName || sp.RenterName || "",
          MarathiRenterName: nm.MarathiRenterName || sp.MarathiRenterName || "",
          OldRV,
          NewRV,
          PercentValue,
        };
      })
      .filter((r) => r.PercentValue == Number(percent));

    // STEP 7: SORT (AlphaNum equivalent)
    finalData.sort((a, b) => {
      return (
        a.WardNo.localeCompare(b.WardNo, undefined, { numeric: true }) ||
        a.PropertyNo.localeCompare(b.PropertyNo, undefined, { numeric: true }) ||
        a.PartitionNo.localeCompare(b.PartitionNo, undefined, { numeric: true })
      );
    });

    return res.status(200).json({
      success: true,
      totalRecords: finalData.length,
      data: finalData,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


