import sequelize from '../../config/connectionDB.js';
import ApplyTaxesMaster from '../../models/models/applytaxesmaster.js';
import AssessmentMaster from '../../models/models/assessmentmaster.js';
import PropertyMast from '../../models/models/propertymast.js';

import { Op } from 'sequelize';

// Function to fetch all owner IDs from PropertyMast
export const fetchAllOwnerIds = async () => {
  try {
    const owners = await PropertyMast.findAll({
      attributes: ['OwnerID'],
      order: [['OwnerID', 'ASC']],
      limit: 10,
    });
    const ownerIds = owners.map((owner) => owner.OwnerID); // Accessing OwnerID directly
    console.log(ownerIds);
    return ownerIds;
  } catch (error) {
    console.error('Error fetching owner IDs:', error);
    throw error;
  }
};

// Fetch owner IDs for selected wards
export const getOwnerIdsByWard = async (NewWardNos) => {
  try {
    // Ensure NewWardNos is an array
    if (!Array.isArray(NewWardNos)) {
      NewWardNos = [NewWardNos];
    }

    const SelectedWardOwnerId = await PropertyMast.findAll({
      attributes: [sequelize.col('OwnerID'), 'OwnerID'],
      where: {
        NewWardNo: {
          [Op.in]: NewWardNos,
        },
      },
    });

    console.log('SelectedWardOwnerId:', SelectedWardOwnerId);
    return SelectedWardOwnerId.map((owner) => owner.OwnerID);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const OwnerIdByWard = async (req, res) => {
  let wardNo = req.params.NewWardNo;
  try {
    if (typeof wardNo === 'string') {
      wardNo = wardNo.split(',').map((ward) => ward.trim());
    }

    const ownerIds = await getOwnerIdsByWard(wardNo);
    console.log('wardWise', ownerIds);
    res.json(ownerIds);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//fetch assessment id from assessment master
export const getAssessmentIdForOwner = async () => {
  try {
    const assessment = await AssessmentMaster.findOne({
      attributes: ['AssessmentID'],
      order: [['CreatedDate', 'ASC']],
    });

    if (assessment) {
      console.log('Fetched assessment:', assessment.toJSON());

      return assessment.AssessmentID;

    } else {
      console.log('No assessments found.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching assessment ID for owner:', error);
    throw error;
  }
};

export const SaveOrUpdateAppliedTaxes = async (req, res) => {
  try {
    const {
      selectAll,
      selectedWard,
      propertyTax,
      educationTax,
      employmentTax,
      spEducationTax,
      drainCess,
      roadCess,
      treeCess,
      sewageDisposalCess,
      sanitation,
      waterBenefit,
      spWaterCess,
      majorBuilding,
      fireCess,
      lightCess,
      tax1,
      tax2,
      tax3,
      tax4,
      tax5,
      waterBill,
      isTaxForPlot,
      isPolicyApplicable,
      inAppComm,
      inHearing,
      drainFlatRate,
      UserID
    } = req.body;

    console.log(req.body, 'requested body');

    const taxValues = {
      PropertyTax: propertyTax,
      EducationTax: educationTax,
      EmploymentTax: employmentTax,
      SpEducationTax: spEducationTax,
      DrainCess: drainCess,
      RoadCess: roadCess,
      TreeCess: treeCess,
      SewageDisposalCess: sewageDisposalCess,
      Sanitation: sanitation,
      WaterBenefit: waterBenefit,
      SpWaterCess: spWaterCess,
      MajorBuilding: majorBuilding,
      FireCess: fireCess,
      LightCess: lightCess,
      Tax1: tax1,
      Tax2: tax2,
      Tax3: tax3,
      Tax4: tax4,
      Tax5: tax5,
      WaterBill: waterBill,
      IsTaxForPlot: isTaxForPlot,
      IsPolicyApplicable: isPolicyApplicable,
      InAppComm: inAppComm,
      InHearing: inHearing,
      DrainFlatRate: drainFlatRate,
    };

    let ownerIds = [];
    if (selectAll) {
      ownerIds = await fetchAllOwnerIds();
      console.log('Fetched all owner IDs:', ownerIds);
    } else if (selectedWard) {
      ownerIds = await getOwnerIdsByWard(selectedWard);
      console.log('Fetched owner IDs by ward:', ownerIds);
    } else {
      return res
        .status(400)
        .json({ error: 'Neither selectAll nor NewWardNo provided' });
    }

    if (ownerIds.length === 0) {
      return res.status(203).json({ error: 'No owner IDs found' });
    }

    // Get assessment ID from assessment master
    const assessmentId = await getAssessmentIdForOwner();
    console.log('Fetched assessment ID:', assessmentId);
    if (!assessmentId) {
      return res.status(500).json({ error: 'No assessment ID found' });
    }

    // Process each owner ID
    const applyTaxesPromises = ownerIds.map(async (ownerId) => {
      try {
        const existingTaxRecord = await ApplyTaxesMaster.findOne({
          where: { OwnerID: ownerId, AssessmentID: assessmentId },
        });

        if (existingTaxRecord) {
          console.log(
            `Updating existing tax record for owner ${ownerId}, assessment ${assessmentId}`
          );
          return existingTaxRecord.update({
            ...taxValues,
            UpdatedBy: UserID,
            UpdatedDate: new Date()
          });
        } else {
          console.log(
            `Creating new tax record for owner ${ownerId}, assessment ${assessmentId}`
          );
          return ApplyTaxesMaster.create({
            OwnerID: ownerId,
            AssessmentID: assessmentId,
            ...taxValues,
            CreatedBy: UserID,        
            CreatedDate: new Date()
          });
        }
      } catch (error) {
        console.error(
          `Error processing tax record for owner ${ownerId}:`,
          error
        );
        throw error;
      }
    });

    await Promise.all(applyTaxesPromises);

    res.status(200).json({ message: 'Taxes applied successfully' });
  } catch (error) {
    console.error('Error applying taxes:', error);
    res.status(500).json({ error: error.message });
  }
};
//fecth data with ownerid
export const getApplyTaxesByOwner = async (req, res) => {
  try {
    const { OwnerID } = req.body;

    if (!OwnerID) {
      return res.status(400).json({
        status: false,
        message: 'OwnerID is required',
      });
    }

    const data = await ApplyTaxesMaster.findOne({
      where: { OwnerID },
      raw: true, // 👈 plain object milega
    });

    if (!data) {
      return res.status(404).json({
        status: false,
        message: 'No tax data found for this Owner',
      });
    }

    // 🔁 Boolean → 1 / 0 conversion
    const convertedData = {};
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        convertedData[key] = data[key] ? 1 : 0;
      } else {
        convertedData[key] = data[key];
      }
    });

    return res.status(200).json({
      status: true,
      message: 'Owner wise tax data fetched successfully',
      data: convertedData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
    });
  }
};
