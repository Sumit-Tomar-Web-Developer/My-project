import Retaintionfactmaster from '../../models/models/retaintionfactmaster.js';
import AssessmentMaster from '../../models/models/assessmentmaster.js'
import sequelize from '../../config/connectionDB.js';
import { where } from 'sequelize';
import PropertyMast from '../../models/models/propertymast.js';
import { Op, fn, col, cast } from 'sequelize';
import PropertyDetailsNew from '../../models/models/propertydetailsnew.js';
import { QueryTypes } from 'sequelize';












//Heleper Functions 
export const getNETRV = async (ownerId) => {
  try {
    const result = await sequelize.query(
      "CALL prcGetNETRV(:ownerId)",
      {
        replacements: { ownerId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    console.log(result, "📊 Raw NETRV result in getNETRV");

    // Handle nested array/object format returned by MySQL CALL
    const row = result[0]?.['0'] || result[0];
    const netRV = row?.NETRV ?? 0.0;

    console.log("✅ Extracted NETRV:", netRV);
    return netRV;
  } catch (err) {
    console.error("❌ Error in getNETRV:", err.message);
    return 0.0;
  }
};



export const getOldRV = async (ownerId) => {
  try {
    const result = await sequelize.query(
      "CALL prcGetOldRV(:ownerId)",
      {
        replacements: { ownerId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    console.log(result, "📊 Raw old RV result in getOldRV");

    // MySQL CALL might return nested array or object
    const row = result[0]?.['0'] || result[0]; // handle both formats
    const oldRV = row?.OldRV ?? 0.0;

    console.log("✅ Extracted OldRV:", oldRV);
    return oldRV;
  } catch (err) {
    console.error("❌ Error in getOldRV:", err.message);
    return 0.0;
  }
};


export const getMinimumRV = async () => {
  try {
    const results = await sequelize.query(
      "CALL prcGetMinimumRV()",
      { type: QueryTypes.SELECT }
    );

    // MySQL returns an array of row objects in results[0]
    // Some MySQL setups return results as [{ '0': { MinRV: 20 } }, ...]
    const minRow = results[0]?.['0'] || results[0]; // handle both formats
    const MinRV = minRow?.MinRV ?? 0;

    console.log("📊 Minimum RV extracted:", MinRV);
    return MinRV;
  } catch (err) {
    console.error("❌ Error in getMinimumRV:", err.message);
    return 0.0;
  }
};



export const getRetainPolicyFactor = async (oldRV, netRV, factorTable) => {
  let result = 0;

  for (let i = 0; i < factorTable.length; i++) {
    const fromFactor = parseFloat(factorTable[i].FromFactor);
    const toFactor = parseFloat(factorTable[i].ToFactor);
    const factorValue = parseFloat(factorTable[i].FactorValue);

    if (netRV > oldRV * fromFactor && netRV <= oldRV * toFactor) {
      return factorValue;
    }

    result = factorValue; // keep last value in case netRV is above all ranges
  }

  if (netRV > oldRV * factorTable[factorTable.length - 1].FromFactor) {
    return result;
  }

  return 0;
};

export const getRentForOnwerID = async (ownerId) => {
  try {
    const totalRent = await PropertyDetailsNew.findOne({
      attributes: [
        [fn('SUM', fn('COALESCE', col('Rent'), 0)), 'TotalRent']
      ],
      where: {
        RenterYesNO: 1,
        OwnerID: ownerId
      }
    });
    return totalRent ? totalRent.dataValues.TotalRent : 0.0;
  } catch (err) {
    console.error("Error in getRentForOnwerID:", err);
    return 0.0;
  }
};




export const getMinMaxYearFormPropertyDetails = async (OwnerID) => {
  console.log(OwnerID, "owner id in getMinMaxYearFormPropertyDetails");
  try {
    const results = await sequelize.query(
      'CALL prcGetMinMaxYearFormPropertyDetails(?)', // use ? placeholder
      {
        replacements: [OwnerID], // pass as array
        type: QueryTypes.SELECT
      }
    );

    // MySQL returns nested arrays for CALL
    const row = Array.isArray(results) ? results[0] : results;

    if (row && row.MinYear != null && row.MaxYear != null) {
      return [Number(row.MinYear), Number(row.MaxYear)];
    }

    return [0, 0];
  } catch (error) {
    console.error(
      'Error in getMinMaxYearFormPropertyDetails:',
      error.message
    );
    return [0, 0];
  }
};




export const getMaxYearForPolicy = async () => {
  try {
    const result = await sequelize.query(
      'CALL prcGetMaxYearForPolicy()',
      {
        type: QueryTypes.SELECT
      }
    );

    if (result && result.length > 0 && result[0].MaxYear != null) {
      return Number(result[0].MaxYear);
    }

    return 0;
  } catch (error) {
    console.error('Error in getMaxYearForPolicy:', error.message);
    return 0;
  }
};
export const isApplicableForMinimumRV = async (ownerId, OldRV, NETRV, MinRV) => {
  try {
    console.log("🔹 Checking Minimum RV applicability for OwnerID:", ownerId);
    console.log({ OldRV, NETRV, MinRV });

    // Check if property is old for appeal
    const isOld = await isPropertyOldForAppeal(ownerId);
    console.log("📌 isPropertyOldForAppeal:", isOld);

    // Check global setting (assuming you have a GlobalReturnSet object)
    if (!isOld) {
      console.log("❌ Not applicable: either not old or minimum RV rule disabled");
      return false;
    }

    // Actual condition
    if (MinRV > NETRV && MinRV >= OldRV && NETRV !== 0) {
      console.log("✅ Minimum RV applicable");
      return true;
    } else {
      console.log("❌ Minimum RV not applicable");
      return false;
    }
  } catch (err) {
    console.error("❌ Error in isApplicableForMinimumRV:", err.message);
    return false;
  }
};

export const isApplicableForMinimumRVRetain = async (ownerId, OldRV, NETRV, MinRV, Fact) => {
  try {
    console.log("🔹 Checking Minimum RV Retain applicability for OwnerID:", ownerId);
    console.log({ OldRV, NETRV, MinRV, Fact });

    // Check if property is old for appeal
    const isOld = await isPropertyOldForAppeal(ownerId);
    console.log("📌 isPropertyOldForAppeal:", isOld);

    // Check global setting (assuming you have a GlobalReturnSet object)
    if (!isOld) {
      console.log("❌ Not applicable: either not old or minimum RV rule disabled");
      return false;
    }

    // Actual conditions
    const condition1 = OldRV * Fact < MinRV && OldRV > 0 && NETRV > 0 && Fact > 0;
    const condition2 = MinRV > NETRV && MinRV >= OldRV && NETRV !== 0;

    console.log("📌 condition1:", condition1, "📌 condition2:", condition2);

    if (condition1 || condition2) {
      console.log("✅ Minimum RV Retain applicable");
      return true;
    } else {
      console.log("❌ Minimum RV Retain not applicable");
      return false;
    }
  } catch (err) {
    console.error("❌ Error in isApplicableForMinimumRVRetain:", err.message);
    return false;
  }
};
export const isApplicableForMixAssessment = async (ownerId, NETRV, OldRV) => {
  try {
    console.log("🔹 Checking Mix Assessment applicability for OwnerID:", ownerId);
    console.log({ NETRV, OldRV });

    // Get min and max years for the property
    const [minYear, maxYear] = await getMinMaxYearFormPropertyDetails(ownerId);
    console.log("📌 Property Years:", { minYear, maxYear });

    // Get old and new part NETRV
    const netOldNewRV = await getOldNewPartNETRV(ownerId);
    console.log("📌 Old/New Part NETRV:", netOldNewRV);

    // Calculate retention factor based on OldRV and old part NETRV
    const fact = await getRetainPolicyFactor(OldRV, netOldNewRV[0]);
    console.log("📌 Retention Factor:", fact);

    // Get max year for policy
    const maxPolicyYear = await getMaxYearForPolicy();
    console.log("📌 Max Policy Year:", maxPolicyYear);

    // Check if mix assessment is applicable
    const condition =
      maxYear > maxPolicyYear &&
      minYear <= maxPolicyYear &&
      fact > 0 &&
      Math.round(OldRV) !== 0 &&
      GlobalReturnSet?.IsMixAssessment &&
      fact * OldRV < netOldNewRV[0];

    console.log("📌 Mix Assessment Condition:", condition);

    if (condition) {
      // Store factor globally if needed
      MixFactor = fact; // if MixFactor is a global variable
      console.log("✅ Mix Assessment applicable. MixFactor set:", fact);
      return true;
    } else {
      console.log("❌ Mix Assessment not applicable");
      return false;
    }
  } catch (err) {
    console.error("❌ Error in isApplicableForMixAssessment:", err.message);
    return false;
  }
};
export const isApplicableForAsPerOld = async (OldRV, NETRV, MinRV, OwnerID) => {
  console.log(OwnerID, "owner id in isApplicableForAsPerOld");
  try {
    // Check if property is old and policy is enabled
    if (!isPropertyOldForAppeal(OwnerID)) {
      return false;
    }

    // Check rental value conditions
    if (OldRV > NETRV && Math.round(OldRV) !== 0 && OldRV > MinRV) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error in isApplicableForAsPerOld:", error.message);
    return false;
  }
};
export const isApplicableForAsPerOldToNewProp = async (OwnerID, OldRV, NETRV) => {
  try {
    const [minYear, maxYear] = await getMinMaxYearFromPropertyDetails(OwnerID);
    const maxPolicyYear = await getMaxYearForPolicy();

    if (
      maxYear > maxPolicyYear &&
      Math.round(OldRV) !== 0 &&
      OldRV > NETRV
    ) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error in isApplicableForAsPerOldToNewProp:", error.message);
    return false;
  }
};












export const getFactorInfo = async (req, res) => {
  try {
    const getFactorInfo = await Retaintionfactmaster.findAll();
    console.log(getFactorInfo, 'all factor information available');
    res.status(200).json({
      message: 'All factor information available',
      FactorDetails: getFactorInfo,
    });
  } catch (error) {
    console.error('Error getting factors:', error);
    res.status(500).json({
      error: 'An error occurred while getting factors.',
    });
  }
};

export const saveFactorInfo = async (req, res) => {
  try {
    const { FacterID, FromFactor, ToFactor, FactorValue } = req.body;

    // Ensure that the FacterID is provided
    if (!FacterID || !FromFactor || !ToFactor || !FactorValue) {
      return res.status(400).json({
        error: 'FacterID, FromFactor, ToFactor, and FactorValue are required.',
      });
    }

    // Fetch the factor by FacterID
    let factInfo;

    if (FacterID) {
      factInfo = await Retaintionfactmaster.findOne({
        where: { FacterID },
      });
    }

    // Check if the factor exists
    if (!factInfo) {
      return res.status(404).json({
        error: `Cannot update. Factor with ID ${FacterID} not found.`,
      });
    } else {
      // Update the factor record
      await factInfo.update({
        FromFactor,
        ToFactor,
        FactorValue,
      });

      // Return success response
      return res.status(200).json({
        message: 'Factors updated successfully',
        Factor: factInfo,
      });
    }
  } catch (error) {
    console.error('Error updating factors:', error);
    return res.status(500).json({
      error: 'An error occurred while updating factors.',
    });
  }
};

export const saveMinRVParameter = async (req, res) => {
  const { minRV, maxYear } = req.body
  try {
    const result = await AssessmentMaster.update(
      {
        MinRV: minRV,
        MaxYear: maxYear
      },
      {
        where: { AssessmentID: 1 }
      }
    );
    return res.status(200).json({ message: 'Saved SuccessFully' })
  } catch (error) {
    console.log(error, 'error in saving Min RV Parameter')
  }
}



// ✅ Check if property is old for appeal
export const isPropertyOldForAppeal = async (ownerId) => {
  console.log(ownerId, "owner id in isPropertyOldForAppeal");
  try {
    const years = await getMinMaxYearFormPropertyDetails(ownerId); // [minYear, maxYear]
    return years[1] <= await getMaxYearForPolicy();
  } catch (err) {
    console.error("Error in isPropertyOldForAppeal:", err);
    return false;
  }
};

// ✅ Check Retention policy
export const isApplicableForRetaintion = async (ownerId, oldRV, netRV, factorTable) => {
  console.log(ownerId, "owner id in isApplicableForRetaintion");
  try {
    const isOld = await isPropertyOldForAppeal(ownerId);
    const fact = await getRetainPolicyFactor(oldRV, netRV, factorTable);

    if (isOld && fact > 0 && Math.round(oldRV) !== 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error in isApplicableForRetaintion:", err);
    return false;
  }
};

// ✅ Check Minimum RV when OldRV == 0
export const isAppicableMinimumRVForOldRVZero = async (netRV, oldRV, minRV) => {
  try {
    return oldRV === 0 && minRV >= netRV;
  } catch (err) {
    console.error("Error in isAppicableMinimumRVForOldRVZero:", err);
    return false;
  }
};

// ✅ Apply AsPerOld
export const applyAsPerOld = async (ownerId, oldRV, reason) => {
  try {
    await saveAppeal(ownerId, oldRV, 1, new Date(), new Date().getFullYear(),Null, reason);
    return true;
  } catch (err) {
    console.error("Error in applyAsPerOld:", err);
    return false;
  }
};

// ✅ Apply Retention
export const applyRetaintion = async (ownerId, reason, fact, netRV, oldRV) => {
  try {
    await saveAppeal(ownerId, fact * oldRV, 1, new Date(), new Date().getFullYear(), Null, reason);
    return true;
  } catch (err) {
    console.error("Error in applyRetaintion:", err);
    return false;
  }
};

// ✅ Apply Mix Assessment
export const applyMixAssessment = async (ownerId, reason, fact, netRV, oldRV) => {
  try {
    const netOldNewRV = await getOldNewPartNETRV(ownerId); // [oldPartRV, newPartRV]
    const newPartRV = netOldNewRV[1];

    await saveAppeal(ownerId, (fact * oldRV) + newPartRV, 1, new Date(), new Date().getFullYear(), Null, reason);
    return true;
  } catch (err) {
    console.error("Error in applyMixAssessment:", err);
    return false;
  }
};
export const applyMinimumRV = async (OwnerID, Reason) => {
  try {
    // 1. Get minimum RV
    const MinRV = await getMinimumRV();

    // 2. Save appeal (Sequelize create)
    await AutoHearing.create({
      OwnerID: OwnerID,
      RV: MinRV,
      Status: 1,
      CreatedAt: new Date(),
      Year: new Date().getFullYear(),
      UserID: Null,
      Reason: Reason
    });

    return true;
  } catch (error) {
    console.error("❌ Error in applyMinimumRV:", error.message);
    return false;
  }
};
export const getOldNewPartNETRV = async (OwnerID) => {
  try {
    // Call the stored procedure
    const results = await sequelize.query(
      "call prcGetOldNewPartNETRV(:OwnerID)",
      {
        replacements: { OwnerID },
        type: QueryTypes.SELECT,
        raw: true,
        nest: true,
      }
    );
    // Stored procedure might return multiple recordsets
    // MSSQL with Sequelize may flatten the results into array of objects
    // We'll assume results[0] = Old, results[1] = New
    const OldPartNETRV = results[0]?.OldPartNETRV || 0;
    const NewPartNETRV = results[1]?.NewPartNETRV || 0;

    return [OldPartNETRV, NewPartNETRV];
  } catch (error) {
    console.error("Error in getOldNewPartNETRV:", error.message);
    return [0, 0];
  }
};









export const applyPolicy = async (req, res) => {
  console.log("📥 Apply policy payload:", req.body);

  const { WardNo, FromPropertyNo, ToPropertyNo } = req.body;
  const { asPerOld, minRv, retention, mixAssessment, newPropertyAsPerOld, minRvOldRvZero } = req.body.ApplyPolicy;
  try {
    console.log("🏘 WardNo:", WardNo);
    console.log(asPerOld, minRv, retention, mixAssessment, newPropertyAsPerOld, minRvOldRvZero, 'asPerOld, minRv, retention, mixAssessment, newPropertyAsPerOld, minRvOldRvZero')
    let ownerIdsList = [];
    if (!WardNo) {
      console.error("❌ Ward No is required");
      return res.status(400).json({
        error: 'Ward No required.'
      });
    }

    if (WardNo.length == 1) {
      ownerIdsList = await PropertyMast.findAll({
        where: sequelize.literal(
          `NewWardNo = ${WardNo} AND CAST(NewPropertyNo AS UNSIGNED) BETWEEN ${FromPropertyNo} AND ${ToPropertyNo}`
        ),
        attributes: ['OwnerID']
      });
    } else {
      ownerIdsList = await PropertyMast.findAll({
        where: {
          NewWardNo: {
            [Op.in]: WardNo
          }
        },
        attributes: ['OwnerID']
      });
    }

    console.log("🏘 Owner IDs fetched:", ownerIdsList.map(o => o.OwnerID));

    const MinRV = await getMinimumRV(); // move outside loop
    console.log("📊 Minimum RV:", MinRV);

    const factorTable = await Retaintionfactmaster.findAll({
      order: [['FromFactor', 'ASC']]
    });
    console.log("📈 Factor Table:", factorTable);

    for (const ownerObj of ownerIdsList) {
      const ownerId = ownerObj.OwnerID;
      console.log("🔑 Processing OwnerID:", ownerId);

      const NETRV = await getNETRV(ownerId);
      const OldRV = await getOldRV(ownerId);
      const Rent = await getRentForOnwerID(ownerId);

      console.log(`💰 NETRV: ${NETRV}, OldRV: ${OldRV}, Rent: ${Rent}`);

      let flag = false;

      if (NETRV === 0) {
        console.log("⚠ Skipping: NETRV is 0");
        continue;
      }

      const Fact = await getRetainPolicyFactor(OldRV, NETRV, factorTable);
      console.log("🧮 Retention Factor:", Fact);

      // RENT BASED
      if (Rent === (NETRV / 0.9) && Rent > 0) {
        console.log("🏠 Rent matches NETRV/0.9");
        if (asPerOld) {
          console.log("✅ asPerOld enabled for rent-based calculation");
          if (await isApplicableForAsPerOld(ownerId, OldRV, NETRV, MinRV)) {
            console.log("✔ Owner eligible for asPerOld");
            flag = await applyAsPerOld(ownerId, OldRV, "As Per Old");
            continue;
          }
        }
      } else {
        // MIX ASSESSMENT
        if (mixAssessment) {
          console.log("🔄 Checking mixAssessment eligibility");
          if (await isApplicableForMixAssessment(ownerId, NETRV, OldRV)) {
            const NetOldNewRV = await getOldNewPartNETRV(ownerId);
            console.log("🧩 NetOldNewRV:", NetOldNewRV);

            if (!Array.isArray(NetOldNewRV) || NetOldNewRV.length === 0) continue;

            const fact = await getRetainPolicyFactor(OldRV, NetOldNewRV[0], factorTable);
            console.log("🧮 Factor for Mix Assessment:", fact);

            flag = await applyMixAssessment(
              ownerId,
              "Mix Assessment",
              fact,
              NetOldNewRV[0],
              OldRV
            );
            continue;
          }
        }

        // AS PER OLD
        if (asPerOld) {
          console.log("✅ Checking asPerOld eligibility");
          if (await isApplicableForAsPerOld(ownerId, OldRV, NETRV, MinRV)) {
            console.log("✔ Eligible for asPerOld");
            flag = await applyAsPerOld(ownerId, OldRV, "As Per Old");
            continue;
          }
        }

        // MIN RV
        if (minRv) {
          console.log("🔍 Checking minimum RV conditions");
          if (
            retention &&
            await isApplicableForMinimumRVRetain(ownerId, OldRV, NETRV, MinRV, Fact)
          ) {
            console.log("✔ Eligible for min RV with retention");
            flag = await applyMinimumRV(ownerId, "Minimum RV");
            continue;
          } else if (
            await isApplicableForMinimumRV(ownerId, OldRV, NETRV, MinRV)
          ) {
            console.log("✔ Eligible for min RV");
            flag = await applyMinimumRV(ownerId, "Minimum RV");
            continue;
          }
        }

        // RETENTION
        if (retention) {
          console.log("🔒 Checking retention eligibility");
          if (await isApplicableForRetaintion(ownerId, OldRV, NETRV, factorTable)) {
            console.log("✔ Eligible for retention");
            flag = await applyRetaintion(
              ownerId,
              `${Fact} Times Set`,
              Fact,
              NETRV,
              OldRV
            );
            continue;
          }
        }

        // NEW PROPERTY AS PER OLD
        if (newPropertyAsPerOld) {
          console.log("🏢 Checking newPropertyAsPerOld eligibility");
          if (await isApplicableForAsPerOldToNewProp(ownerId, OldRV, NETRV)) {
            console.log("✔ Eligible for newPropertyAsPerOld");
            flag = await applyAsPerOld(ownerId, OldRV, "As Per Old For New");
            continue;
          }
        }

        // MIN RV for OldRV = 0
        if (minRvOldRvZero) {
          console.log("🔢 Checking minRvOldRvZero eligibility");
          if (await isAppicableMinimumRVForOldRVZero(NETRV, OldRV, MinRV)) {
            console.log("✔ Eligible for minRvOldRvZero");
            flag = await applyMinimumRV(ownerId, "Minimum RV");
            continue;
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
    }

    console.log("⚠ No policies applied for any owners");
    return res.status(200).json({
      message: 'No policies applied for any owners'
    });
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: 'Internal server error' })
  }
};
