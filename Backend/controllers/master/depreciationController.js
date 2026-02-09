import sequelize from '../../config/connectionDB.js';
import DepreciationMaster from '../../models/models/depreciationmaster.js';
import ConstructionTypeMaster from '../../models/models/constructiontypemaster.js';
import { getAssessmentIdForOwner } from '../master/applyTaxController.js';



// get distinct years
export const getDistinctYears = async (req, res) => {
  try {
    const years = await DepreciationMaster.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('Year')), 'Year']],
    });

    res.status(200).json(years);
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while fetching years.',
    });
  }
};

// get range according to selected year
export const getDepreciationRange = async (req, res) => {
  const { Year } = req.body;
  console.log('Requested Year:', Year);

  if (!Year) {
    return res.status(400).json({ error: 'Year is required' });
  }

  try {
    const depreciationData = await DepreciationMaster.findAll({
      where: { Year: Year },
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('MinYear')), 'MinYear'],
        'MaxYear',
      ],
      order: [['MinYear', 'ASC']],
      limit: 10,
    });

    const rates = await DepreciationMaster.findAll({
      where: { Year: Year },
      attributes: ['ConstructionID', 'Rate', 'MinYear', 'MaxYear'],
    });

    if (depreciationData.length === 0) {
      return res
        .status(203)
        .json({ error: 'No data found for the given Year' });
    }

    res.status(200).json({ depreciationData, rates });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

//get list of construction IDs
export const getConstructionType = async (req, res) => {
  try {
    const constructiontype = await ConstructionTypeMaster.findAll({
      attributes: ['ConstructionId'],
    });

    res.status(200).json(constructiontype);
  } catch (error) {
    res.status(500).json({
      message: 'An Error Occurred while fetching Construction Types',
    });
  }
};

export const addUpdateConstTypeRate = async (req, res) => {
  const ratesArray = req.body;

  const AssesmentId = await getAssessmentIdForOwner();
  console.log('Fetched assessment ID:', AssesmentId);

  try {
    const CreatedDate = new Date();
    const responses = [];

    for (const rate of ratesArray) {
      const { Year, MinYear, ConstructionID, MaxYear, Rate } = rate;

   if (
  Year === undefined || Year === null ||
  MinYear === undefined || MinYear === null ||
  MaxYear === undefined || MaxYear === null ||
  !ConstructionID ||  // Only check for empty string or null here
  Rate === undefined // Keep this check strict
) {
  console.error('Validation error: Missing required fields', rate);
  return res.status(400).json({
    message: 'Validation error: Missing required fields',
    rate,
  });
}


      try {
        // Check if the record exists
        const existingRate = await DepreciationMaster.findOne({
          where: {
            Year,
            ConstructionID,
            MinYear,
            MaxYear,
            AssessmentId: AssesmentId,
          },
        });

        if (existingRate) {
          // Update existing rate
          const [updatedCount] = await DepreciationMaster.update(
            {
              Rate,
              UpdatedDate: CreatedDate,
            
            },
            { where: { ID: existingRate.ID } }
          );

          if (updatedCount > 0) {
            responses.push({
              ID: existingRate.ID,
              message: 'Rates Updated successfully.',
            });
          } else {
            responses.push({
              ID: existingRate.ID,
              message: 'Not found or not updated',
            });
          }
        } else {
          // Create new rate
          const createdRate = await DepreciationMaster.create({
            Year,
            ConstructionID,
            MinYear,
            MaxYear,
            Rate,
            AssessmentId: AssesmentId,
            CreatedDate,
  
          });
          responses.push(createdRate);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({
          message: 'Database error while adding/updating rates',
          error: dbError.message,
          rate,
        });
      }
    }

    res
      .status(200)
      .json({ message: 'Rates added/updated successfully', responses });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      message: 'Unexpected error in adding/updating rates',
      error: error.message,
    });
  }
};

// Delete Data Related to Year
export const deleteDepData = async (req, res) => {
  const { Year } = req.body;

  try {
    const deleteData = await DepreciationMaster.destroy({
      where: { Year: Year },
    });

    if (deleteData) {
      res.status(200).json({ message: 'Data deleted successfully' });
    } else {
      res.status(203).json({ message: 'Data not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// GET all depreciation masters
export const getAllDeprMasterData = async (req, res) => {
  try {
    const depreciationMasters = await DepreciationMaster.findAll();
    res.json(depreciationMasters);
  } catch (error) {
    console.error('Error fetching depreciation masters:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to fetch distinct years
export const getYearList = async () => {
  try {
    const years = await RateMaster.findAll({
      attributes: [
        [RateMaster.sequelize.fn("DISTINCT", RateMaster.sequelize.col("Year")), "Year"]
      ],
      where: {
        Year: { [RateMaster.sequelize.Op.ne]: null } // exclude NULL years
      },
      order: [["Year", "DESC"]]
    });

    return years.map(y => y.Year);
  } catch (error) {
    throw error;
  }
};

export const deleteDepDataById = async (req, res) => {
  const { ID } = req.body;
  try {
    const deleted = await DepreciationMaster.destroy({ where: { ID } });
    if (deleted) {
      res.status(200).json({ message: 'Rate deleted successfully' });
    } else {
      res.status(404).json({ message: 'Rate not found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

