import CombinedOwnerName from '../../../models/models/combinedownerrenternames.js';
import TransMast from '../../../models/models/transmast.js';
import { TaxPendingDetails } from '../../../models/models/taxpendingdetails.js';
import CustomTaxesMast from '../../../models/models/customtaxesmast.js';
import PasswordMaster from '../../../models/models/passwordmaster.js';
import propertymast from '../../../models/models/propertymast.js';

export const getOwnerDetailsAndCustomTaxesByOwnerID = async (req, res) => {
  const { OwnerID } = req.body;

  if (!OwnerID) {
    return res.status(400).json({ error: 'OwnerID is required' });
  }

  try {
    const ownerDetails = await CombinedOwnerName.findOne({
      attributes: ['RenterName'],
      where: { OwnerID }
    });

    const YearDetails = await TransMast.findOne({
      attributes: ['FinanceYear'],
      where: { OwnerID }
    });

    const PropertyDetails = await propertymast.findOne({
      attributes: ['OwnerName', 'OccupierName'],
      where: { OwnerID }
    });

    const currentTaxes = await TransMast.findOne({
      where: { OwnerID }
    });

    const pendingTaxes = await TaxPendingDetails.findOne({
      where: { OwnerID }
    });

    // Combine owner + property if available
    const combinedOwnerDetails = {
      RenterName: ownerDetails?.RenterName || '',
      OwnerName: PropertyDetails?.OwnerName || '',
      OccupierName: PropertyDetails?.OccupierName || ''
    };

    return res.status(200).json({
      message: 'Data retrieved successfully',
      ownerDetails: combinedOwnerDetails,
      currentTaxes: currentTaxes || null,
      pendingTaxes: pendingTaxes || null,
      YearDetails: YearDetails || null
    });
  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const GetPendingTaxStatus = async (req, res) => {
  try {
    let { year, ownerId } = req.body;

    console.log("Received request:", { year, ownerId });

    if (!year || !ownerId) {
      return res.status(400).json({ error: 'Year and OwnerID are required' });
    }

    const financeYear = year.split('-')[0];
    const pendingYear = financeYear - 1;


    console.log("Finance Year:", financeYear);
    console.log("Pending Year:", pendingYear);

    const pendingTax = await CustomTaxesMast.findOne({
      where: {
        FinanceYear: financeYear,
        PendingYear: pendingYear,
        OwnerID: ownerId,
      },
      attributes: [
        'PropertyTax',
        'EducationTax',
        'TreeCess',
        'EmploymentTax',
        'FireCess',
        'SpEducationTax',
        'MajorBuilding',
        'LightCess',
        'RoadCess',
        'DrainCess',
        'SewageDisposalCess',
        'Sanitation',
        'SpWaterCess',
        'WaterBenefit',
        'WaterBill',
        'Tax1',
      ],
    });


    console.log("Pending tax data:", pendingTax);
    if (!pendingTax) {
      return res
        .status(200)
        .json({ message: 'No tax data found for this year and owner' });
    }

    // Check if any tax fields have a non-zero value
    const hasTaxApplied = Object.values(pendingTax.dataValues).some(
      (value) => value > 0
    );

    if (hasTaxApplied) {
      return res.status(200).json({ message: 'Custom taxes applied' });
    } else {
      return res.status(200).json({ message: 'No custom taxes applied' });
    }
  } catch (error) {
    console.error('Error fetching pending tax status:', error.message);
    return res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
};




// export const SaveCustomTaxes = async (req, res) => {
//   const { CustomTaxes, password, OwnerID, taxType, finacialYear } = req.body;

//   console.log(JSON.stringify(req.body), 'boddyyyy');

//   if (!CustomTaxes || typeof CustomTaxes !== 'object') {
//     return res
//       .status(400)
//       .json({ error: 'CustomTaxes data is required and must be an object' });
//   }

//   try {
//     const Year = finacialYear.split('-')[0];
//     const pendingYear = Year - 1;

//     // Check if record already exists
//     let existingTaxes = await CustomTaxesMast.findOne({
//       where: { OwnerID, FinanceYear: Year, PendingYear: pendingYear },
//     });

//     let savedTaxes;
//     if (existingTaxes) {
//       // Update existing record
//       savedTaxes = await existingTaxes.update({ ...CustomTaxes });
//     } else {
//       // Create new record
//       savedTaxes = await CustomTaxesMast.create({
//         ...CustomTaxes,
//         OwnerID,
//         PendingYear: pendingYear,
//         FinanceYear: Year,
//       });
//     }

//     // Handle TaxPendingDetails for 'pending' taxType
//     if (taxType === 'pending') {
//       const existingRecord = await TaxPendingDetails.findOne({
//         where: { TPDID: CustomTaxes.TPDID },
//       });

//       if (existingRecord) {
//         await existingRecord.update({ ...CustomTaxes });
//       }
//     }

//     return res.status(200).json({
//       message: 'Custom taxes saved/updated successfully',
//       data: {
//         customTaxes: savedTaxes,
//         taxType,
//       },
//     });
//   } catch (error) {
//     console.error('Error saving custom taxes:', error);
//     return res
//       .status(500)
//       .json({ error: 'Internal server error', details: error.message });
//   }
// };


export const SaveCustomTaxes = async (req, res) => {
  const { CustomTaxes, password, OwnerID, taxType, finacialYear } = req.body;

  console.log("📥 Incoming request body:", JSON.stringify(req.body, null, 2));

  if (!CustomTaxes || typeof CustomTaxes !== "object") {
    return res.status(400).json({
      error: "CustomTaxes data is required and must be an object",
    });
  }

  // Helper: convert empty strings/undefined to null
  const normalizeTaxes = (taxes) => {
    const normalized = {};
    for (let key in taxes) {
      if (taxes[key] === "" || taxes[key] === undefined) {
        normalized[key] = null;
      } else {
        normalized[key] = taxes[key];
      }
    }
    return normalized;
  };

  try {
    const Year = Number(finacialYear.split("-")[0]);
    const pendingYear = Year - 1;

    const cleanedTaxes = normalizeTaxes(CustomTaxes);
    console.log("🛠 Normalized taxes:", cleanedTaxes);

    // Check if record already exists
    let existingTaxes = await CustomTaxesMast.findOne({
      where: { OwnerID, FinanceYear: Year, PendingYear: pendingYear },
    });

    let savedTaxes;
    if (existingTaxes) {
      console.log("🔄 Updating existing CustomTaxes record");
      savedTaxes = await existingTaxes.update({ ...cleanedTaxes });
    } else {
      console.log("➕ Creating new CustomTaxes record");
      savedTaxes = await CustomTaxesMast.create({
        ...cleanedTaxes,
        OwnerID,
        PendingYear: pendingYear,
        FinanceYear: Year,
      });
    }

    // Handle TaxPendingDetails for 'pending' taxType
    if (taxType === "pending") {
      console.log("📝 Handling pending tax details");
      const existingRecord = await TaxPendingDetails.findOne({
        where: { TPDID: CustomTaxes.TPDID },
      });

      if (existingRecord) {
        console.log("🔄 Updating existing pending tax record");
        await existingRecord.update({ ...cleanedTaxes });
      } else {
        console.log("⚠️ Pending tax record not found");
      }
    }

    console.log("✅ Custom taxes saved successfully");
    return res.status(200).json({
      message: "Custom taxes saved/updated successfully",
      data: {
        customTaxes: savedTaxes,
        taxType,
      },
    });
  } catch (error) {
    console.error("❌ Error saving custom taxes:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
