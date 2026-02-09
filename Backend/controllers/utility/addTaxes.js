import { TaxPendingDetails } from "../../models/models/taxpendingdetails.js";
import TransMast from "../../models/models/transmast.js";
import BillTransactionAdvanceResult from '../../models/models/billtransactionadvanceresult.js';
import sequelize from "../../config/connectionDB.js";
import PropertyMast from '../../models/models/propertymast.js';
import BillTransactionDetailsAdvance from '../../models/models/billtransactiondetailsadvance.js';
import TransYearMast from '../../models/models/transyearmast.js'
import { Op, fn, col } from "sequelize";

PropertyMast.hasMany(BillTransactionDetailsAdvance, { foreignKey: 'OwnerID' });
BillTransactionDetailsAdvance.belongsTo(PropertyMast, { foreignKey: 'OwnerID' });

PropertyMast.hasMany(BillTransactionAdvanceResult, { foreignKey: 'OwnerID' });
BillTransactionAdvanceResult.belongsTo(PropertyMast, { foreignKey: 'OwnerID' });

export const fetchFinanceYearProperty = async (req, res) => {
  try {
    const result = await TransMast.findAll({
      attributes: [
        'FinanceYear', // We just need the FinanceYear as you want to group by it
        [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('OwnerID'))), 'OwnerCount'] // Corrected distinct count
      ],
      group: ['FinanceYear'],
      raw: true
    });

    console.log(result); // Log the result to the console

    return res.send(result);

  } catch (error) {
    console.error('Error fetching finance year owner count:', error);
  }

}



// Add taxes for a specific financial year and Selected ward
export const addTaxes = async (req, res) => {

  const { financeYear, ward } = req.body.data;
  console.log(financeYear.FinanceYear, ward);
  try {
    // Get financeYear, ward, fromPropertyNo, and toPropertyNo from frontend
    if (!financeYear || !ward) {
      return res.status(400).json({ error: 'financeYear, ward are required' });
    }
    for (const wardNo of ward) {
      const OwnerIDs = await PropertyMast.findOne({
        attributes: [
          [fn('MIN', col('NewPropertyNo')), 'FromProperty'],
          [fn('MAX', col('NewPropertyNo')), 'ToProperty'],
        ],
        where: {
          NewWardNo: wardNo,
          NewPropertyNo: { [Op.ne]: null },
        },
        raw: true,
      });
      const failedOwnerIds = [];
      {
        const query = 'CALL prcAddTaxes(:param1, :param2, :param3, :param4,null, null,null , null,null ,null ,null )';
        try {
          const result = await sequelize.query(query, {
            replacements: {
              param1: financeYear.FinanceYear,
              param2: wardNo,
              param3: OwnerIDs.FromProperty,
              param4: OwnerIDs.ToProperty

            },
            type: sequelize.QueryTypes.RAW
          });
          console.log(`Success for OwnerID `, result);
        } catch (error) {
          console.error(`Error for OwnerID `, error.message);
          failedOwnerIds.push({
            ownerId: item.OwnerID,
            error: error.message || 'Unknown error'
          });
        }
      }
      console.log(' Processing complete');
      console.log(' Failed:', failedOwnerIds);


      if (failedOwnerIds.length > 0) {
        return res.status(200).json({
          message: 'Some records failed to process',
          failedOwnerIds: failedOwnerIds

        });
      }
      else {
        return res.status(200).json({
          message: 'Balance tax for all records in the given ward and property number range has been successfully calculated and updated.',
        });
      }


    }
  } catch (error) {
    console.error('Error calculating and updating balance tax:', error);
    return res.status(500).json({ error: 'Error calculating and updating balance tax.' });
  }

};



// Remove taxes for a specific financial year For both tab
export const removeTaxes = async (req, res) => {
  const { financialYear } = req.body;
  console.log(financialYear.FinanceYear, ' financialYear');
  try {
    const query = "CALL prcRemoveAddTaxes(:param1)";
    await sequelize.query(query, {
      replacements: { param1: financialYear.FinanceYear },
      type: sequelize.QueryTypes.RAW,
    });
    console.log(`Procedure executed successfully for year: ${financialYear.FinanceYear}`);
    return res.status(200).json({
      message: `Taxes removed successfully for the ${financialYear.FinanceYear} financial year.`,
    });
  } catch (error) {
    console.error("Error executing stored procedure:", error);
  }
}

// Advance deduction for a specific financial year and Selected ward
export const updateAdvanceDeduction = async (req, res) => {
  console.log('controller');
  // Extract financeYear and ward from the request body
  const { financeYear, ward } = req.body.data;
  console.log(financeYear.FinanceYear, 'financeYear');
  console.log(ward, ' ward');
  try {
    // Get financeYear, ward, fromPropertyNo, and toPropertyNo from frontend
    if (!financeYear.FinanceYear || !ward) {
      return res.status(400).json({ error: 'financeYear, ward are required' });
    }
    for (const wardNo of ward) {
      const query = "CALL PrcDistributeAdvancePaymentPrime(:financeYear,  :userId,:WardNo)";

      await sequelize.query(query, {
        replacements: {
          financeYear: Number(financeYear.FinanceYear),
          userId: null,
          WardNo: Number(wardNo),
        },
        type: sequelize.QueryTypes.RAW,
      });
      console.log(query, 'query');
    }
    console.log(`Advance amount updated successfully for the ${financeYear.FinanceYear} financial year.`);
    return res.status(200).json({
      message: `Advance amount updated successfully for the ${financeYear.FinanceYear} financial year.`,
    });
  } catch (error) {
    console.error('Error Updating advance amount:', error);
    return res.status(500).json({ error: 'Error Updating advance amount.' });
  }
};

export const getPropertiesForAdvanceDeduction = async (req, res) => {
  const { wardNo, financeYear } = req.query;
  console.log('financialYear', financeYear.FinanceYear);
  if (!wardNo || !financeYear) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    // Query the database using Sequelize
    const propertiesForMiscellaneousFee = await PropertyMast.findAll({
      attributes: ["NewWardNo", "NewPropertyNo", "NewPartitionNo", "OwnerID"],
      where: {
        NewWardNo: wardNo,
        NewPropertyNo: {
          [Op.not]: null
        }
      }, include: {
        model: BillTransactionDetailsAdvance,
        attributes: ['MiscellaneousFee'],
        where: {
          MiscellaneousFee: { [Op.not]: null },
          financeYear: financeYear.FinanceYear
        }
      }
      ,
      raw: true
    });

    const propertiesForAdvanceDeduction = await PropertyMast.findAll({
      attributes: ["NewWardNo", "NewPropertyNo", "NewPartitionNo", "OwnerID"],
      where: {
        NewWardNo: wardNo,
        NewPropertyNo: {
          [Op.not]: null
        }
      }, include: {
        model: BillTransactionAdvanceResult,
        attributes: ['OpenBal'],
        where: {
          OpenBal: { [Op.gt]: 0 },
          financeYear: financeYear.FinanceYear
        }
      },
      raw: true
    });

    console.log(propertiesForMiscellaneousFee, 'propertiesForMiscellaneousFee');
    console.log(propertiesForAdvanceDeduction, 'propertiesForAdvanceDeduction');

    const result = [];
    result.push(propertiesForMiscellaneousFee || []);
    result.push(propertiesForAdvanceDeduction || []);

    return res.status(200).json({
      message: 'Properties fetched successfully',
      data: result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}



// Add taxes for a range of properties in a specific ward
export const addTaxesFromTo = async (req, res) => {
  console.log('controller');
  const { financeYear, ward, fromPropertyNo, toPropertyNo } = req.body.data;
  console.log('Adding taxes from', fromPropertyNo, 'to', toPropertyNo, 'for ward', ward);






  const query = 'CALL prcAddTaxesFromTo(:param1, :param2, :param3, :param4 )';
  try {
    const result = await sequelize.query(query, {
      replacements: {
        param1: financeYear.FinanceYear,
        param2: ward,
        param3: fromPropertyNo,
        param4: toPropertyNo

      },
      type: sequelize.QueryTypes.RAW
    });
    console.log(`Success for OwnerID `, result);
   res.status(200).json(result);
   
  } catch (error) {
    console.error(`Error for OwnerID `, error.message);
  }

};





//  Advance deduction from property
export const updateAdvanceDeductionFromProperty = async (req, res) => {
  const { financeYear, ward, fromPropertyNo, toPropertyNo } = req.body.data;
  console.log('controller');
  console.log(financeYear.FinanceYear, 'financeYear');
  try {
    // Get financeYear, ward, fromPropertyNo, and toPropertyNo from frontend
    if (!ward || !fromPropertyNo || !toPropertyNo || !financeYear) {
      return res.status(400).json({ error: 'financialYear, ward, fromPropertyNo and toPropertyNo are required' });
    }
    const OwnerIds = await PropertyMast.findAll({
      attributes: ['OwnerID'],
      where: {
        NewWardNo: ward,
        NewPropertyNo: {
          [Op.between]: [
            sequelize.cast(fromPropertyNo, 'UNSIGNED'),
            sequelize.cast(toPropertyNo, 'UNSIGNED')
          ]
        }
      },
      raw: true // This will return plain objects instead of model instances
    });

    for (const item of OwnerIds) {
      const query = "CALL prcDistributeAdvancePaymentSecond(:financeYear, :OwnerId, :userId)";
      await sequelize.query(query, {
        replacements: {
          financeYear: financeYear.FinanceYear,
          OwnerId: item.OwnerID,
          userId: null
        },
        type: sequelize.QueryTypes.RAW,
      });
    }

    return res.status(200).json({
      message: `Advance deduction updated successfully for the ${financeYear.FinanceYear} financial year.`,
    });
  } catch (error) {
    console.error("Error executing stored procedure:", error);
    return res.status(500).json({ error: 'Error updating advance deduction.' });
  }
}


//SHOW button functionality for 2d tab
export const getMiscellaneouseFromTo = async (req, res) => {

  let { wardNo, fromPropertyNo, toPropertyNo } = req.query;

  if (!wardNo || !fromPropertyNo || !toPropertyNo) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  // Convert to strings to handle the data as strings in the query
  wardNo = String(wardNo);
  fromPropertyNo = String(fromPropertyNo);  // Make sure property numbers are strings
  toPropertyNo = String(toPropertyNo);  // Make sure property numbers are strings

  try {
    // Query the database using Sequelize
    const properties = await PropertyMast.findAll({
      attributes: ["NewWardNo", "NewPropertyNo", "NewPartitionNo"],
      where: {
        NewWardNo: wardNo,
        NewPropertyNo: {
          [Op.between]: [sequelize.cast(fromPropertyNo, 'UNSIGNED'),
          sequelize.cast(toPropertyNo, 'UNSIGNED')],
        },
      },
      order: [
        ['NewPropertyNo', 'ASC'],
        ['NewPartitionNo', 'ASC'],
      ],
    });

    // Check if properties were found
    if (properties.length === 0) {
      return res.status(404).json({ message: 'No properties found' });
    }

    return res.json(properties);  // Send the found properties as JSON
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFinanceYearList = async (req, res) => {
  try {

    const result = await TransYearMast.findAll({
      attributes: ['FinanceYear']
    })
    console.log(result)
    return res.json(result)

  } catch (error) {
    console.log(error)
    res.send(error)
  }

}

