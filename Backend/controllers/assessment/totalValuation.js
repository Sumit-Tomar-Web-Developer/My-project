import sequelize from '../../config/connectionDB.js';
import PropertyMast from '../../models/models/propertymast.js';
import PropertyDetailsNew from '../../models/models/propertydetailsnew.js';
import PropertyDetailsOld from '../../models/models/propertydetailsold.js';
import { OldPropertyMast } from '../../models/models/oldpropertymast.js';
import ConstructionTypeMaster from '../../models/models/constructiontypemaster.js';
import PropertyTypeMaster from '../../models/models/propertytypemaster.js';
import PropertyImageMast from '../../models/models/propertyimagesmast.js';
import PropertySocialDetails from '../../models/models/propertysocialdetails.js';
import fs from 'fs';
import path from 'path';
import RetentionTaxMast from '../../models/models/retentiontaxmast.js';
import HearingMast from '../../models/models/hearingmast.js';
import AppealMast from '../../models/models/appealmast.js';
import CourtResultMast from '../../models/models/courtresultmast.js';
import AppliedPolicyMast from '../../models/models/appliedPolicyMast.js';
import TransMast from '../../models/models/transmast.js';
import ApplyTaxesMaster from '../../models/models/applytaxesmaster.js';
import TaxMaster from '../../models/models/taxmaster.js';
import { Op } from 'sequelize';
import { TaxPendingDetails } from '../../models/models/taxpendingdetails.js';
import Retaintionfactmaster from '../../models/models/retaintionfactmaster.js';
import {
  applyAsPerOld,
  applyMinimumRV,
  applyMixAssessment,
  getMinimumRV,
  getNETRV,
  getOldNewPartNETRV,
  getOldRV,
  getRentForOnwerID,
  getRetainPolicyFactor,
  isApplicableForAsPerOld,
  isApplicableForMinimumRV,
  isApplicableForMinimumRVRetain,
  isApplicableForMixAssessment
} from '../utility/setPoliciesController.js';




PropertyMast.hasMany(PropertyDetailsNew, { foreignKey: 'OwnerID' });
PropertyDetailsNew.belongsTo(PropertyMast, { foreignKey: 'OwnerID' });
PropertyMast.hasMany(PropertySocialDetails, { foreignKey: 'OwnerID' });
PropertySocialDetails.belongsTo(PropertyMast, { foreignKey: 'OwnerID' });
ConstructionTypeMaster.hasMany(PropertyDetailsNew, {
  foreignKey: 'ConstructionType',
  sourceKey: 'ConstructionId',
});

PropertyDetailsNew.belongsTo(ConstructionTypeMaster, {
  foreignKey: 'ConstructionType',
  targetKey: 'ConstructionId',
});
PropertyMast.belongsTo(PropertyTypeMaster, {
  foreignKey: 'PropertyTypeID',
  targetKey: 'PropertyTypeID',
});
PropertyMast.hasOne(OldPropertyMast, { foreignKey: 'OwnerID' });
OldPropertyMast.belongsTo(PropertyMast, { foreignKey: 'OwnerID' });
PropertyMast.hasOne(PropertyImageMast, { foreignKey: 'OwnerID' });
PropertyImageMast.belongsTo(PropertyMast, { foreignKey: 'OwnerID' });
OldPropertyMast.hasMany(PropertyDetailsOld, { foreignKey: 'OwnerID' });
PropertyDetailsOld.belongsTo(OldPropertyMast, { foreignKey: 'OwnerID' });

export const getpropertyDataFromNewDetails = async (req, res) => {
  console.log(req,'req for checking user')
  try {

    const { NewWardNo, NewPropertyNo, NewPartitionNo } = req.body;


    if (NewWardNo && NewPropertyNo) {
      const result = await PropertyMast.findAll({
        attributes: [
          'OwnerID', 'NewZoneNo', 'NewPartitionNo', 'NewCityServeyNo', 'OwnerName', 'BuildingOrShopName', 'BuildingOrFlatNo',
          'NewPlotNo', 'PlotArea', 'NewWardNo', 'NewPropertyNo', 'MobileNo', 'NoOfWaterConnection', 'Address', 'commToiletNo'
        ],
        where: {
          NewWardNo,
          NewPropertyNo,
          NewPartitionNo
        },

        include: [
          {
            model: OldPropertyMast,
            attributes: [
              'OldZoneNo', 'OldPartitionNo', 'OldCityServeyNo', 'OldPlotNo', 'OldPlotArea', 'OldWardNo', 'OldPropertyNo', 'OldZoneNo', 'OldALV', 'OldRV', 'OldTotalTax'
            ],
            include: [
              {
                model: PropertyDetailsOld,
                attributes: ['OldCarpetAreaSqfeet', 'OldBuildUpAreaSqFeet']
              }
            ]

          },
          {
            model: PropertyDetailsNew,
            attributes: [
              'FloorID', 'ConstructionType', 'BuildUpAreaSqFeet',
              'CarpetAreaSqFeet', 'TypeOFUse', 'NoOfRooms',
              'RenterName', 'OccupierName', 'Rent', 'NonCalculateRent'

            ],
            include: [
              {
                model: ConstructionTypeMaster,
                attributes: ['Description']
              },

            ]
          },
          {
            model: PropertyImageMast,
            attributes: [
              'PropertyPathA', 'PropertyPathB', 'PropertyPathC',
              'PropertyPathD', 'PlanPath'
            ]
          },
          {
            model: PropertyTypeMaster,
            attributes: ['PropertyDescription', 'Tax']
          },
          {
            model: PropertySocialDetails,
            attributes: ['IsWaterConn', 'WaterConnSize', 'WaterConnectionYear', 'IsRainwaterharvesting']
          }
        ]
      });
      let funGetAllNETTaxes = [];
      let prcCalculateRCWiseNewNOldValuationNew = []
      let netTaxes = [];
      let retain = [];
      let hearing = [];
      let appeal = [];
      let remission = [];
      const OwnerID = result?.[0].OwnerID;
      if (OwnerID) {


        prcCalculateRCWiseNewNOldValuationNew = await sequelize.query(
          'call prcCalculateRCWiseNewNOldValuationNew (:ownerId)',
          {
            replacements: {
              ownerId: OwnerID,
            },
            type: sequelize.QueryTypes.SELECT
          }
        );
        funGetAllNETTaxes = prcCalculateRCWiseNewNOldValuationNew[4] || [];

        netTaxes = await sequelize.query(
          'call prcOverAllNetTaxes (:ownerId)',
          {
            replacements: {
              ownerId: OwnerID,
            },
            type: sequelize.QueryTypes.SELECT
          }

        )
        retain = await RetentionTaxMast.findAll({
          where: { OwnerID: OwnerID },
          raw: true
        });
        hearing = await HearingMast.findAll({
          where: { OwnerID: OwnerID },
          raw: true
        });
        appeal = await AppealMast.findAll({
          where: { OwnerID: OwnerID },
          raw: true
        });
        remission = await CourtResultMast.findAll({
          where: { OwnerID: OwnerID },
          raw: true
        });



      }


      if (!result || result.length === 0) {
        return res.status(404).json({ message: 'Property not found' });
      }

      const BASE_IMAGE_PATH = path.join('\\\\192.168.5.244\\e$', 'NTIS_New_Images');
      const imageFields = ['PropertyPathA', 'PropertyPathB', 'PropertyPathC', 'PropertyPathD', 'PlanPath'];

      const finalData = [];

      for (const property of result) {
        const plainProperty = property.toJSON(); // convert to plain object
        const imageData = plainProperty.propertyimagesmast;
        const images = {};

        if (imageData) {
          for (const field of imageFields) {
            const relativePath = imageData[field];

            if (relativePath) {
              const fullPath = path.join(BASE_IMAGE_PATH, relativePath);

              try {
                if (fs.existsSync(fullPath)) {
                  const buffer = fs.readFileSync(fullPath);
                  const base64Image = buffer.toString('base64');
                  images[field] = `data:image/jpeg;base64,${base64Image}`;
                } else {

                  images[field] = null;
                }
              } catch (err) {

                images[field] = null;
              }
            } else {
              images[field] = null;
            }
          }
        }

        plainProperty.images = images;
        finalData.push(plainProperty);
      }

      finalData.push(funGetAllNETTaxes);
      finalData.push(prcCalculateRCWiseNewNOldValuationNew[0]);
      finalData.push(prcCalculateRCWiseNewNOldValuationNew[1]);
      finalData.push(prcCalculateRCWiseNewNOldValuationNew[2]);
      finalData.push(prcCalculateRCWiseNewNOldValuationNew[3]);

      finalData.push(netTaxes[0]);
      finalData.push(retain);
      finalData.push(hearing);
      finalData.push(appeal);
      finalData.push(remission);


      return res.json(finalData);
    }
  } catch (error) {

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getpropertyDataFromOldDetails = async (req, res) => {

  try {
    const { OldWardNo, OldPropertyNo } = req.body;


    const oldProperty = await OldPropertyMast.findAll({
      attributes: ['OwnerID'] // ✅ Alias here to prevent duplication
      ,
      where: {
        OldWardNo: OldWardNo,
        OldPropertyNo: OldPropertyNo
      },
      limit: 1,
      raw: true,

    });

    const result = await PropertyMast.findAll({
      attributes: [
        'NewZoneNo', 'NewPartitionNo', 'NewCityServeyNo', 'OwnerName', 'BuildingOrShopName', 'BuildingOrFlatNo', 'NewPropertyNo',
        'NewPlotNo', 'PlotArea', 'NewWardNo', 'NewPropertyNo', 'MobileNo', 'NoOfWaterConnection', 'Address', 'commToiletNo'
      ], raw: false,
      where: {
        OwnerID: oldProperty[0].OwnerID,

      },
      include: [
        {
          model: OldPropertyMast,
          attributes: [
            'OldZoneNo', 'OldPartitionNo', 'OldCityServeyNo', 'OldPlotNo', 'OldPlotArea', 'OldWardNo', 'OldPropertyNo', 'OldZoneNo', 'OldALV', 'OldRV', 'OldTotalTax'
          ],
          include: [
            {
              model: PropertyDetailsOld,
              attributes: ['OldCarpetAreaSqfeet', 'OldBuildUpAreaSqFeet']
            }
          ]

        },
        {
          model: PropertyDetailsNew,
          attributes: [
            'FloorID', 'ConstructionType', 'BuildUpAreaSqFeet',
            'CarpetAreaSqFeet', 'TypeOFUse', 'NoOfRooms',
            'RenterName', 'OccupierName', 'Rent', 'NonCalculateRent'

          ],
          include: [
            {
              model: ConstructionTypeMaster,
              attributes: ['Description']
            },

          ]
        },
        {
          model: PropertyImageMast,
          attributes: [
            'PropertyPathA', 'PropertyPathB', 'PropertyPathC',
            'PropertyPathD', 'PlanPath'
          ]
        },
        {
          model: PropertyTypeMaster,
          attributes: ['PropertyDescription', 'Tax']
        },
        {
          model: PropertySocialDetails,
          attributes: ['IsWaterConn', 'WaterConnSize', 'WaterConnectionYear', 'IsRainwaterharvesting']
        }
      ]
    });

    let funGetAllNETTaxes = [];
    let prcCalculateRCWiseNewNOldValuationNew = []
    let netTaxes = [];
    let retain = [];
    let hearing = [];
    let appeal = [];
    let remission = [];
    const OwnerID = oldProperty[0].OwnerID;
    if (OwnerID) {


      prcCalculateRCWiseNewNOldValuationNew = await sequelize.query(
        'call prcCalculateRCWiseNewNOldValuationNew ( :ownerId)',
        {
          replacements: {
            ownerId: OwnerID,
          },
          type: sequelize.QueryTypes.SELECT
        }
      )
      funGetAllNETTaxes = prcCalculateRCWiseNewNOldValuationNew[4] || [];

      netTaxes = await sequelize.query(
        'call prcOverAllNetTaxes (:ownerId)',
        {
          replacements: {
            ownerId: OwnerID,
          },
          type: sequelize.QueryTypes.SELECT
        }

      )
      retain = await RetentionTaxMast.findAll({
        where: { OwnerID: OwnerID },
        raw: true
      });
      hearing = await HearingMast.findAll({
        where: { OwnerID: OwnerID },
        raw: true
      });
      appeal = await AppealMast.findAll({
        where: { OwnerID: OwnerID },
        raw: true
      });
      remission = await CourtResultMast.findAll({
        where: { OwnerID: OwnerID },
        raw: true
      });



    }


    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const BASE_IMAGE_PATH = path.join('\\\\192.168.5.244\\e$', 'NTIS_New_Images');
    const imageFields = ['PropertyPathA', 'PropertyPathB', 'PropertyPathC', 'PropertyPathD', 'PlanPath'];

    const finalData = [];

    for (const property of result) {
      const plainProperty = property.toJSON(); // convert to plain object
      const imageData = plainProperty.propertyimagesmast;
      const images = {};

      if (imageData) {
        for (const field of imageFields) {
          const relativePath = imageData[field];

          if (relativePath) {
            const fullPath = path.join(BASE_IMAGE_PATH, relativePath);

            try {
              if (fs.existsSync(fullPath)) {
                const buffer = fs.readFileSync(fullPath);
                const base64Image = buffer.toString('base64');
                images[field] = `data:image/jpeg;base64,${base64Image}`;
              } else {

                images[field] = null;
              }
            } catch (err) {

              images[field] = null;
            }
          } else {
            images[field] = null;
          }
        }
      }

      plainProperty.images = images;
      finalData.push(plainProperty);
    }

    finalData.push(funGetAllNETTaxes);
    finalData.push(prcCalculateRCWiseNewNOldValuationNew[0]);
    finalData.push(prcCalculateRCWiseNewNOldValuationNew[1]);
    finalData.push(prcCalculateRCWiseNewNOldValuationNew[2]);
    finalData.push(prcCalculateRCWiseNewNOldValuationNew[3]);

    finalData.push(netTaxes[0]);
    finalData.push(retain);
    finalData.push(hearing);
    finalData.push(appeal);
    finalData.push(remission);

    return res.json(finalData);

  }
  catch (error) {

    return res.status(500).json({ error: "Internal Server Error" });
  }
}
export const removeRemissionDetails = async (req, res) => {
  try {
    const { OwnerID } = req.body;


    // Check if record exists
    const existing = await CourtResultMast.findOne({ where: { OwnerID } });
    if (!existing) {
      return res.status(404).json({ message: 'OwnerID not found in CourtResultMast' });
    }
    await AppliedPolicyMast.update({ CourtResult: 0 }, { where: { OwnerID } });
    const result = await CourtResultMast.destroy({ where: { OwnerID } });

    return res.status(200).json({ message: 'Remission details removed successfully', deleted: result });
  } catch (error) {

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removeRetentionDetails = async (req, res) => {
  try {
    const { OwnerID } = req.body;


    // Check if record exists
    const existing = await RetentionTaxMast.findOne({ where: { OwnerID } });
    if (!existing) {
      return res.status(404).json({ message: 'OwnerID not found in RetentionTaxMast' });
    }
    const response = await AppliedPolicyMast.update({ Retaintion: 0 }, { where: { OwnerID } });

    const result = await RetentionTaxMast.destroy({ where: { OwnerID } });

    return res.status(200).json({ message: 'Retention details removed successfully', deleted: result });
  } catch (error) {

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Remove Appeal Committee
export const removeAppealCommitteeDetails = async (req, res) => {
  try {
    const { OwnerID } = req.body;


    // Check if exists
    const existing = await AppealMast.findOne({ where: { OwnerID } });
    if (!existing) {
      return res.status(404).json({ message: 'OwnerID not found in AppealMast' });
    }
    const response = await AppliedPolicyMast.update({ Appeal: 0 }, { where: { OwnerID } });

    const result = await AppealMast.destroy({ where: { OwnerID } });

    return res.status(200).json({ message: 'Appeal committee removed successfully', deleted: result });
  } catch (error) {

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Remove All Appeals (Appeal + Retention + CourtResult)
export const removeAllAppealsDetails = async (req, res) => {
  try {
    const { OwnerID } = req.body;


    // Check if exists in ANY table
    const [appeal, retention, court] = await Promise.all([
      AppealMast.findOne({ where: { OwnerID } }),
      RetentionTaxMast.findOne({ where: { OwnerID } }),
      CourtResultMast.findOne({ where: { OwnerID } })
    ]);

    if (!appeal && !retention && !court) {
      return res.status(404).json({ message: 'OwnerID not found in any appeal-related table' });
    }

    // Delete all
    const [appealDeleted, retentionDeleted, courtDeleted] = await Promise.all([
      AppealMast.destroy({ where: { OwnerID } }),
      RetentionTaxMast.destroy({ where: { OwnerID } }),
      CourtResultMast.destroy({ where: { OwnerID } })
    ]);
    await AppliedPolicyMast.update({ Hearing: 0, Retention: 0, Appeal: 0, CourtResult: 0 }, { where: { OwnerID } });
    return res.status(200).json({
      message: 'All appeals details removed successfully',
      deleted: {
        appealDeleted,
        retentionDeleted,
        courtDeleted
      }
    });
  } catch (error) {

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const removeHearingDetails = async (req, res) => {
  try {
    const { OwnerID } = req.body;


    // Check if record exists
    const existing = await HearingMast.findOne({ where: { OwnerID } });
    if (!existing) {
      return res.status(404).json({ message: 'OwnerID not found in HearingMast' });
    }
    await AppliedPolicyMast.update({ Hearing: 0 }, { where: { OwnerID } });
    const result = await HearingMast.destroy({ where: { OwnerID } });

    return res.status(200).json({ message: 'Hearing details removed successfully', deleted: result });
  } catch (error) {

    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const saveLastRow = async (req, res) => {
  const { data, selectedYear, ownerId } = req.body;


  try {
    // Check if record exists
    const existingRecord = await TransMast.findOne({
      where: {
        OwnerID: ownerId,
        FinanceYear: selectedYear,
      },
    });

    let result;

    if (existingRecord) {
      // Update existing record
      result = await TransMast.update(data, {
        where: {
          OwnerID: ownerId,
          FinanceYear: selectedYear,
        },
      });

      return res.status(200).json({ message: 'Record updated successfully', result });
    } else {
      // Insert new record
      result = await TransMast.create({
        ...data,
        OwnerID: ownerId,
        FinanceYear: selectedYear,
      });

      return res.status(200).json({ message: 'Record created successfully', result });
    }
  } catch (error) {

    return res.status(500).json({ message: 'Error while saving last row', error });
  }
};

export const applyPolicyDetails = async (req, res) => {
  const { ownerId, applicalePolicy } = req.body;
  console.log('applyPolicyDetails called with:', ownerId, applicalePolicy);

  const MinRV = await getMinimumRV(); // move outside loop
  console.log("📊 Minimum RV:", MinRV);

  const factorTable = await Retaintionfactmaster.findAll({
    order: [['FromFactor', 'ASC']]
  });
  console.log("📈 Factor Table:", factorTable);

  console.log("🔑 Processing OwnerID:", ownerId);

  const NETRV = await getNETRV(ownerId);
  const OldRV = await getOldRV(ownerId);
  const Rent = await getRentForOnwerID(ownerId);

  console.log(`💰 NETRV: ${NETRV}, OldRV: ${OldRV}, Rent: ${Rent}`);

  let flag = false;

  if (NETRV === 0) {
    console.log("⚠ Skipping: NETRV is 0");

  }

  const Fact = await getRetainPolicyFactor(OldRV, NETRV, factorTable);
  console.log("🧮 Retention Factor:", Fact);

  // RENT BASED
  if (Rent === (NETRV / 0.9) && Rent > 0) {
    console.log("🏠 Rent matches NETRV/0.9");
    if (applicalePolicy == 'As Per Old') {
      console.log("✅ asPerOld enabled for rent-based calculation");
      if (await isApplicableForAsPerOld(ownerId, OldRV, NETRV, MinRV)) {
        console.log("✔ Owner eligible for asPerOld");
        flag = await applyAsPerOld(ownerId, OldRV, "As Per Old");

      }
    }
  } else {
    // MIX ASSESSMENT
    if (applicalePolicy == "Mix Assessment") {
      console.log("🔄 Checking mixAssessment eligibility");
      if (await isApplicableForMixAssessment(ownerId, NETRV, OldRV)) {
        const NetOldNewRV = await getOldNewPartNETRV(ownerId);
        console.log("🧩 NetOldNewRV:", NetOldNewRV);

        if (!Array.isArray(NetOldNewRV) || NetOldNewRV.length === 0);

        const fact = await getRetainPolicyFactor(OldRV, NetOldNewRV[0], factorTable);
        console.log("🧮 Factor for Mix Assessment:", fact);

        flag = await applyMixAssessment(
          ownerId,
          "Mix Assessment",
          fact,
          NetOldNewRV[0],
          OldRV
        );

      }
    }

    // AS PER OLD
    if (applicalePolicy == 'As Per Old') {
      console.log("✅ Checking asPerOld eligibility");
      if (await isApplicableForAsPerOld(ownerId, OldRV, NETRV, MinRV)) {
        console.log("✔ Eligible for asPerOld");
        flag = await applyAsPerOld(ownerId, OldRV, "As Per Old");

      }
    }

    // MIN RV
    if (applicalePolicy == 'Minimum RV') {
      console.log("🔍 Checking minimum RV conditions");
      if (
        retention &&
        await isApplicableForMinimumRVRetain(ownerId, OldRV, NETRV, MinRV, Fact)
      ) {
        console.log("✔ Eligible for min RV with retention");
        flag = await applyMinimumRV(ownerId, "Minimum RV");

      } else if (
        await isApplicableForMinimumRV(ownerId, OldRV, NETRV, MinRV)
      ) {
        console.log("✔ Eligible for min RV");
        flag = await applyMinimumRV(ownerId, "Minimum RV");

      }
    }

  }

  if (flag) {
    console.log(`✅ Policy applied successfully for OwnerID: ${ownerId}`);
    return res.status(200).json({
      message: 'Policy Applied Successfully',
      OwnerID: ownerId
    });
  }
  console.log("⚠ No policies applied for any owners");
  return res.status(200).json({
    message: 'No policies applied for any owners'
  });
}

export const detailsForShortKeys = async (req, res) => {
  const { ownerid } = req.body;

  try {
    // 1️⃣ Get property info
    const propertyType = await PropertyMast.findOne({
      attributes: ['PropertyTypeID', 'OpenPlot'],
      where: { OwnerID: ownerid }
    });

    if (!propertyType) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // 2️⃣ Get netRv from stored procedure
    const [netRvResult] = await sequelize.query(
      'CALL funGetLatestRV(:OwnerID, 1)',
      { replacements: { OwnerID: ownerid } }
    );


    const netRv = netRvResult.RV; // replace RV with the actual column returned by SP

    // 3️⃣ Get property type details
    const propType = await PropertyTypeMaster.findOne({
      where: { PropertyTypeID: propertyType.PropertyTypeID }
    });

    if (!propType) {
      return res.status(404).json({ message: 'Property type not found' });
    }

    // 4️⃣ Build TaxMaster where clause dynamically
    const taxWhere = {
      Type: propType.Type,
      [Op.and]: [
        { MinAmount: { [Op.gte]: netRv } },
        { MaxAmount: { [Op.lte]: netRv } }
      ]
    };

    if (propertyType.OpenPlot) {
      taxWhere.TaxnameType = { [Op.like]: '%open%' };
    } else {
      taxWhere.TaxnameType = { [Op.in]: ['EducationTax', 'EmploymentTax'] };
    }

    // 5️⃣ Fetch taxes
    const eduAndEmp = await TaxMaster.findAll({ where: taxWhere });

    console.log(eduAndEmp, 'eduAndEmp')
    // 6️⃣ Fetch all taxes for the property type (optional)
    const taxMaster = await TaxMaster.findAll({
      where: {
        Type: propType.Type,
        TaxnameType: {
          [Op.and]: [
            { [Op.notIn]: ['EducationTax', 'EmploymentTax'] }, // exclude these two
            { [Op.notLike]: '%open%' } // exclude anything like "open"
          ]
        }
      }
    });
    console.log(taxMaster, 'taxMaster')

    // 7️⃣ Fetch social details
    const socialDetails = await PropertySocialDetails.findOne({
      where: { OwnerID: ownerid }
    });

    // 8️⃣ Fetch applied taxes
    const applyTax = await ApplyTaxesMaster.findOne({
      where: { OwnerID: ownerid }
    });

    // Fetch Old Property mast
    const oldProperty = await OldPropertyMast.findOne({
      where: { OwnerID: ownerid }
    });

    const propertyDetailsOld = await PropertyDetailsNew.findOne({
      where: { OwnerID: ownerid }
    });

    const oldPeningTaxes = await TaxPendingDetails.findAll({
      where: { OwnerID: ownerid }
    })

    // 9️⃣ Return results
    return res.json({

      eduAndEmp,
      taxMaster,
      socialDetails,
      applyTax,
      oldProperty,
      propertyDetailsOld,
      oldPeningTaxes

    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const applyTaxes = async (req, res) => {
  const { ownerId, applyTaxes } = req.body;

  try {
    // 1️⃣ Normalize booleans → 1/0
    const normalized = {};
    Object.keys(applyTaxes).forEach(key => {
      const value = applyTaxes[key];

      if (value === true) {
        normalized[key] = 1;
      } else if (value === false) {
        normalized[key] = 0;
      } else {
        normalized[key] = value; // keep numbers, null, strings
      }
    });

    // 2️⃣ Update using NORMALIZED data
    await ApplyTaxesMaster.update(normalized, {
      where: {
        OwnerID: ownerId
      }
    });

    // 3️⃣ Proper response
    return res.status(200).json({
      message: 'Apply taxes updated successfully'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};
