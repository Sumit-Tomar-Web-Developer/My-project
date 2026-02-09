import { Sequelize } from 'sequelize';

import sequelize from '../../../config/connectionDB.js';
import ApplyTaxesMaster from '../../../models/models/applytaxesmaster.js';
import PropertyMast from '../../../models/models/propertymast.js';
import TransMast from '../../../models/models/transmast.js';
import { OldPropertyMast } from '../../../models/models/oldpropertymast.js';
import Op from 'sequelize';

ApplyTaxesMaster.belongsTo(PropertyMast, { foreignKey: 'OwnerID' })
OldPropertyMast.belongsTo(PropertyMast, { foreignKey: 'OwnerID' });

export const getOwnersForAutoHearingAppComm = async (req, res) => {
  try {
    const { isAutoHearing, newWardNo } = req.body;

    // ApplyTaxesMaster conditions
    const applyTaxWhere = {
      [isAutoHearing ? 'InHearing' : 'InAppComm']: 1,
    };

    // PropertyMast conditions
    const propertyWhere = {};
    if (newWardNo && newWardNo !== 'ALL') {
      propertyWhere.NewWardNo = newWardNo;
    }

    const owners = await ApplyTaxesMaster.findAll({
      attributes: ['OwnerID'],
      where: applyTaxWhere,
      include: [
        {
          model: PropertyMast,
          required: true,
          attributes: [],
          where: propertyWhere,
        },
      ],
      raw: true,
    });
    console.log('owners', owners)

    return res.status(200).json(owners);
  } catch (error) {
    console.error('Error fetching owners:', error);
    return {
      success: false,
      message: 'An error occurred while fetching owners',
      error: error.message,
    };
  }
};


export const getLatestRV = async (ownerID) => {
  try {

    const result = await sequelize.query(
      'call funGetLatestRV (:ownerID,1)',
      {
        replacements: { ownerID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log(result[0][0], 'result')
    return result[0][0].RV;
  } catch (error) {
    console.error('Error in getLatestRV:', error);
    return 0;
  }
};

export const getMaxNetRvUsingConstructionType = async (ownerID) => {
  try {

    const result = await sequelize.query(
      'call getMaxNetRVUSINGConstructionType (:ownerID)',
      {
        replacements: { ownerID },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    return result.length > 0 ? result[0].Type : '';
  } catch (error) {
    console.error('Error in getMaxNetRvUsingConstructionType:', error);
    return '';
  }
};

export const applyAppeal = async (req, res) => {
  try {
    const {
      constructionTypeList,
      TypeofUseList,
      isConstrWise,
      isAutoHearing,
      ownerIDs,
    } = req.body;

    // Validate that ownerIDs is an array and not empty
    if (!Array.isArray(ownerIDs) || ownerIDs.length === 0) {
      return res.status(400).json({ message: 'No owner IDs provided' });
    }

    // Loop through each ownerID
    for (const ownerID of ownerIDs) {
      let percentage = 0;
      let type = '';
      let latestRV = 0;

      // Determine Type based on Construction or Property Use
      type = isConstrWise ? await constructionTypeList : await TypeofUseList;

      // Set Percentage from Table
      if (type) {
        percentage = isConstrWise
          ? getPercentageForConType(dt, type)
          : getPercentageForTypeOfUse(dt, type);
      }
      percentage = percentage / 100;

      // Get Latest RV for the current ownerID
      latestRV = await getLatestRV(ownerID);
      console.log(latestRV, 'latestRV')
      const adjustedRV = latestRV - (latestRV * percentage);

      // Apply Appeal if the computed value is greater than zero
      if (adjustedRV > 0) {
        await sequelize.query(
          `CALL PrcSetAppealMast(
      :ownerID,
      :adjustedRV,
      :statusID,
      :createdDate,
      :financeYear,
      :approvedBy,
      :source
    )`,
          {
            replacements: {
              ownerID: ownerID,
              adjustedRV: adjustedRV,
              statusID: isAutoHearing ? 2 : 3,
              createdDate: new Date(),
              financeYear: new Date().getFullYear(),
              approvedBy: null,
              source: isAutoHearing ? 'Hearing' : 'AppealCommittee'
            }
          }
        );
      }
    }
    console.log("completed")

    return res.status(200).json({ message: 'Appeals applied successfully' });
  } catch (error) {
    console.error('Error in applyAppeal:', error);
    return res.status(500).json({
      message: 'An error occurred while applying appeals',
      error: error.message,
    });
  }
};
export const getPropertyType = async (ownerID) => {
  let result;
  try {
    const result = await sequelize.queryquery(
      'call prcGetPropertyType (:ownerId)',
      {
        replacements: {
          ownerId: ownerID,
        },
        type: sequelize.QueryTypes.SELECT
      }
    );
    if (

      result.recordset.length > 0 &&
      result.recordset[0].Type !== undefined
    ) {
      return result.recordset[0].Type.toString();
    }

    return '';
  } catch (err) {
    // Equivalent to BAL_Logger.WriteFile
    console.error('getPropertyType error:', err.message, err.stack);
    return '';
  }
}
export const applyAppealInfo = async (req, res) => {
  try {
    const {
      constructionPercentages, // e.g., { A: '20', B: '30', C: '80' }
      typeOfUsePercentages, // e.g., { 'अनिवासी मालमत्ता': '45', 'धार्मिक स्थळ': '55' }
      isConstrWise, // Determines which percentage set to use
      isAutoHearing,
      ownerIDs,
    } = req.body;

    if (!Array.isArray(ownerIDs) || ownerIDs.length === 0) {
      return res.status(400).json({ message: 'No owner IDs provided' });
    }

    for (const ownerID of ownerIDs) {
      let percentage = 0;
      let propertyType = '';
      let latestRV = 0;

      // Determine property type based on the selected category
      if (isConstrWise) {
        propertyType = await getMaxNetRvUsingConstructionType({ ownerID });
      } else {
        propertyType = await getPropertyType(ownerID);
      }

      console.log(`OwnerID: ${ownerID}, PropertyType: ${propertyType}`);

      // Fetch percentage from the correct object
      if (propertyType) {
        if (isConstrWise) {
          percentage = parseFloat(constructionPercentages[propertyType]) || 0;
        } else {
          percentage = parseFloat(typeOfUsePercentages[propertyType]) || 0;
        }
      }

      // Convert percentage to fraction (e.g., 20% → 0.20)
      percentage = percentage / 100;
      console.log(`Applied Percentage: ${percentage * 100}%`);

      // Fetch latest RV
      latestRV = await getLatestRV(ownerID);
      console.log(`Latest RV for OwnerID ${ownerID}: ${latestRV}`);

      // Apply percentage reduction
      const newNetRV = latestRV - latestRV * percentage;
      console.log(`New Net RV for OwnerID ${ownerID}: ${newNetRV}`);

      // Save the appeal if newNetRV is positive
      if (newNetRV > 0) {
        await saveAppeal(
          ownerID,
          newNetRV,
          isAutoHearing ? 2 : 3,
          new Date(),
          new Date().getFullYear(),
          isAutoHearing ? 'Hearing' : 'AppealCommittee'
        );
        console.log(`Appeal saved for OwnerID ${ownerID}`);
      }
    }

    return res.status(200).json({ message: 'Appeals applied successfully' });
  } catch (error) {
    console.error('Error in applyAppeal:', error);
    return res.status(500).json({
      message: 'An error occurred while applying appeals',
      error: error.message,
    });
  }
};

// export const getDemandAnalysisData = async (req, res) => {
//   try {
//     const { RangeValue } = req.body;

//     // Fetch latest financial year
//     const latestFinanceYear = await TransMast.max('FinanceYear');

//     // Query to fetch data
//     const data = await PropertyMast.findAll({
//       include: [
//         {
//           model: TransMast,
//           as: 'transMast',
//           where: { FinanceYear: latestFinanceYear },
//           required: true,
//         },
//       ],
//       attributes: [
//         [Sequelize.literal("'Reason Placeholder'"), 'Reason'],
//         [
//           Sequelize.fn('COUNT', Sequelize.col('PropertyMast.OwnerID')),
//           'Properties',
//         ],

//         // Old values
//         [Sequelize.fn('SUM', Sequelize.col('PropertyMast.OldRV')), 'OldRV'],
//         [
//           Sequelize.fn('SUM', Sequelize.col('PropertyMast.OldPropertyTax')),
//           'OldPropDmd',
//         ],
//         [
//           Sequelize.fn('SUM', Sequelize.col('PropertyMast.OldTotalTax')),
//           'OldTotDmd',
//         ],

//         // New values
//         [
//           Sequelize.fn('SUM', Sequelize.col('transMast.RateableValue')),
//           'NewRV',
//         ],
//         [
//           Sequelize.fn('SUM', Sequelize.col('transMast.PropertyTax')),
//           'NewPropDmd',
//         ],
//         [Sequelize.fn('SUM', Sequelize.col('transMast.TaxTotal')), 'NewTotDmd'],

//         [Sequelize.literal('0'), 'Discount'],

//         // Final values
//         [
//           Sequelize.fn('SUM', Sequelize.col('transMast.PropertyTax')),
//           'FinalPropDmd',
//         ],
//         [
//           Sequelize.fn('SUM', Sequelize.col('transMast.TaxTotal')),
//           'FinalTotDmd',
//         ],
//       ],
//       group: ['PropertyMast.OwnerID'],
//       raw: true,
//     });

//     res.status(200).json({ success: true, data });
//   } catch (error) {
//     console.error('Error fetching demand analysis data:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };

export const getDemandAnalysisData = async (req, res) => {
  try {
    const { RangeValue } = req.body;

    const { minValue, maxValue } = RangeValue;
    ('');

    // Fetch latest financial year
    const latestFinanceYear = await TransMast.max('FinanceYear');

    // Query to fetch data
    const data = await PropertyMast.findAll({
      include: [
        {
          model: TransMast,
          as: 'transMast',
          attributes: [],
          where: { FinanceYear: latestFinanceYear },
          required: true,
        },
        {
          model: OldPropertyMast,
          as: 'oldpropertymast',
          attributes: [],
          required: true,
        }
      ],
      attributes: [
        [Sequelize.literal(`'${minValue} - ${maxValue}'`), 'Reason'],
        [Sequelize.fn('COUNT', Sequelize.col('PropertyMast.OwnerID')), 'Properties'],
        [Sequelize.fn('SUM', Sequelize.col('oldpropertymast.OldRV')), 'OldRV'],
        [Sequelize.fn('SUM', Sequelize.col('oldpropertymast.OldPropertyTax')), 'OldPropDmd'],
        [Sequelize.fn('SUM', Sequelize.col('oldpropertymast.OldTotalTax')), 'OldTotDmd'],
        [Sequelize.fn('SUM', Sequelize.col('transMast.RateableValue')), 'NewRV'],
        [Sequelize.fn('SUM', Sequelize.col('transMast.PropertyTax')), 'NewPropDmd'],
        [Sequelize.fn('SUM', Sequelize.col('transMast.TaxTotal')), 'NewTotDmd'],
        [Sequelize.literal('0'), 'Discount'],
        [Sequelize.fn('SUM', Sequelize.col('transMast.PropertyTax')), 'FinalPropDmd'],
        [Sequelize.fn('SUM', Sequelize.col('transMast.TaxTotal')), 'FinalTotDmd'],
      ],
      where: Sequelize.literal(`
    transMast.RateableValue >= oldpropertymast.OldRV * ${minValue}
    AND
    transMast.RateableValue <= oldpropertymast.OldRV * ${maxValue}
  `),
      group: ['PropertyMast.OwnerID'],
      raw: true,
    });


    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching demand analysis data:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const setAutoHearingAppealRatioWise = async (req, res) => {
  const { dt, selectOneForTax, selectOneForAppeal, loggedInUserRole } = req.body
  const appealReason = selectOneForAppeal ? "Hearing" : "Appeal"
  try {
    let lessEq = 0;

    for (const row of dt) {

      if (toDouble(row.Properties) === 0 && toDouble(row.Discount) === 0) {
        continue;
      }

      const values = row.Reason.toString().split('-');

      let whereClause = '';
      const replacements = { selectOneForTax };

      if (toDouble(values[0]) === 0 && values[0] !== 'New' && values[0] !== 'Zero') {
        whereClause = `
                    WHERE A.OldRV > B.RateableValue
                    AND A.OldRV > 0
                `;
      }
      else if (
        toDouble(values[1]) === 0 &&
        values[0] !== 'New' &&
        values[0] !== 'Zero' &&
        lessEq === 1
      ) {
        whereClause = `
                    WHERE B.RateableValue <= A.OldRV + :v0
                    AND A.OldRV > 0
                `;
        replacements.v0 = toDouble(values[0]);
      }
      else if (
        toDouble(values[1]) === 0 &&
        values[0] !== 'New' &&
        values[0] !== 'Zero'
      ) {
        whereClause = `
                    WHERE B.RateableValue < A.OldRV + :v0
                    AND A.OldRV > 0
                `;
        replacements.v0 = toDouble(values[0]);
      }
      else if (values[0] === 'New') {
        whereClause = `
                    WHERE B.RateableValue > 0
                    AND A.OldRV = 0
                `;
      }
      else if (values[0] === 'Zero') {
        whereClause = `
                    WHERE B.RateableValue = 0
                `;
      }
      else if (lessEq === 1) {
        whereClause = `
                    WHERE B.RateableValue <= A.OldRV + :v0
                    AND B.RateableValue >= A.OldRV + :v1
                    AND A.OldRV > 0
                `;
        replacements.v0 = toDouble(values[0]);
        replacements.v1 = toDouble(values[1]);
      }
      else {
        whereClause = `
                    WHERE B.RateableValue < A.OldRV + :v0
                    AND B.RateableValue >= A.OldRV + :v1
                    AND A.OldRV > 0
                `;
        replacements.v0 = toDouble(values[0]);
        replacements.v1 = toDouble(values[1]);
      }

      const sql = `
                SELECT
                    A.OwnerID,
                    A.OldRV,
                    B.RateableValue AS RV
                FROM PropertyMast A
                INNER JOIN dbo.funGetAllLatestTaxes(
                    '1S', NULL, NULL, NULL, NULL, :selectOneForTax, NULL, NULL
                ) B ON A.OwnerID = B.OwnerID
                ${whereClause}
            `;

      const dt1 = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements
      });

      lessEq++;

      if (dt1 && dt1.length > 0) {
        await applyAutoHearingRatioWise(
          dt1,
          toDouble(row.Discount),
          selectOneForAppeal,
          appealReason,
          loggedInUserRole
        );
      }
    }

    return res.status(200).json({ Message: 'Applied Successfully' });
  }
  catch (err) {
    console.error('setAutoHearingAppealRatioWise error:', err);
    return res.status(501).json({ Message: 'Internal server error' });
  }
}

export const applyAutoHearingRatioWise = async (dt, discount, selectOne, reason, loggedInUserRole) => {
  try {
    if (discount > 0) {
      const minRV = await getMinimumRV();

      for (const row of dt) {

        const rvCalculated = Math.round(
          toDouble(row.RV) - (toDouble(row.RV) * discount / 100)
        );

        if (
          await isApplicableForMinimumRV(
            Number(row.OwnerID),
            toDouble(row.OldRV),
            rvCalculated,
            minRV
          )
        ) {
          // Set Minimum RV
          await saveAppeal(
            Number(row.OwnerID),
            minRV,
            selectOne,
            new Date(),
            new Date().getFullYear(),
            loggedInUserRole,
            reason
          );
        }
        else if (rvCalculated === toDouble(row.OldRV)) {
          // Set New RV
          await saveAppeal(
            Number(row.OwnerID),
            rvCalculated,
            selectOne,
            new Date(),
            new Date().getFullYear(),
            loggedInUserRole,
            reason
          );
        }
        else {
          // Set As Per Old RV
          await saveAppeal(
            Number(row.OwnerID),
            toDouble(row.OldRV),
            selectOne,
            new Date(),
            new Date().getFullYear(),
            loggedInUserRole,
            reason
          );
        }
      }
    }

    return true;
  }
  catch (err) {
    console.error(err);
    return false;
  }
}
