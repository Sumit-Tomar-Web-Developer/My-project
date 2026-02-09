import PropertyMast from '../../../models/models/propertymast.js';
import ApplyPenaltyTaxByOwnerIDWise from '../../../models/models/applypenaltytaxesmasterowneridwise.js';
import { Op } from 'sequelize';
import sequelize from '../../../config/connectionDB.js';
import { Sequelize } from 'sequelize';
import AssessmentRuleMaster from '../../../models/models/assessmentrulesmaster.js';
import AssessmentMaster from '../../../models/models/assessmentmaster.js';

export const getSearchedProperties = async (req, res) => {
  const { wardNo, fromPropertyNo, toPropertyNo } = req.body;

  if (fromPropertyNo === undefined || toPropertyNo === undefined) {
    return res.status(400).json({
      message:
        'Invalid property range. Both "from" and "to" values are required.',
    });
  }

  try {
    const properties = await PropertyMast.findAll({
      attributes: [
        [
          sequelize.fn(
            'TRIM',
            sequelize.literal(
              `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
            )
          ),
          'prop',
        ],
        'NewPartitionNo',
        'NewWardNo',
        'NewPropertyNo',
        'OwnerID',
      ],
      where: {
        NewWardNo: wardNo,
        [Op.and]: [
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.gte,
            fromPropertyNo
          ),
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.lte,
            toPropertyNo
          ),
        ],
      },
      order: sequelize.literal('NewPropertyNo + 1'),
    });

    if (properties.length === 0) {
      return res
        .status(404)
        .json({ message: 'No properties found for this ward and range' });
    }

    // Return both locked/unlocked properties and the list of unlocked OwnerIDs
    res.status(200).json({
      message: `properties fetched successfully.`,
      properties,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const ApplyPenaltyTaxByOwnerIdWise = async (req, res) => {
  const { dataToUpdate } = req.body;

  console.log(dataToUpdate,"penalty to be ownerid")
  let { selectedYear, selectedWard, ownerIds, ...updateFields } = dataToUpdate;

  if (!Array.isArray(ownerIds) || ownerIds.length === 0) {
    return res.status(400).json({ message: 'Invalid or missing ownerIds' });
  }

  const transaction =
    await ApplyPenaltyTaxByOwnerIDWise.sequelize.transaction();

  try {
    const currentTimestamp = new Date();

    // Map frontend keys to database columns
    const fieldMappings = {
      billGenerationDate: 'BillGenerationDate',
      startHalfOnCurrent: 'start_half_on_current',
      endHalfOnCurrent: 'end_half_on_current',
      startFullOnCurrent: 'start_full_on_current',
      endFullOnCurrent: 'end_full_on_current',
      startFullOnPending: 'start_full_on_pending',
      endFullOnPending: 'end_full_on_pending',
    };

    Object.keys(fieldMappings).forEach((key) => {
      if (updateFields[key] !== undefined) {
        updateFields[fieldMappings[key]] = updateFields[key];
        delete updateFields[key];
      }
    });

    console.log('Final updateFields:', updateFields);

    // Fetch existing records in bulk (avoiding loop queries)
    const existingRecords = await ApplyPenaltyTaxByOwnerIDWise.findAll({
      where: {
        OwnerID: { [Sequelize.Op.in]: ownerIds },
        Year: selectedYear,
      },
      attributes: ['OwnerID', 'Year'],
      raw: true,
    });

    const assessment = await AssessmentMaster.findOne({
      attributes: ['AssessmentID'],
      order: [['CreatedDate', 'ASC']],
    });

    const assessmentId = assessment.AssessmentID;

    const existingOwnerIds = new Set(existingRecords.map((rec) => rec.OwnerID));
    const newRecords = [];
    const updatedRecords = [];

    for (const ownerId of ownerIds) {
      if (existingOwnerIds.has(ownerId)) {
        // Update existing record
        await ApplyPenaltyTaxByOwnerIDWise.update(
          { ...updateFields, UpdatedDate: currentTimestamp },
          { where: { OwnerID: ownerId, Year: selectedYear }, transaction }
        );

        let updatedData = await ApplyPenaltyTaxByOwnerIDWise.findOne({
          where: { OwnerID: ownerId, Year: selectedYear },
          raw: true,
        });

        console.log(`🔄 Updated record for OwnerID: ${ownerId}`, updatedData);
        updatedRecords.push(updatedData);
      } else {
        // Prepare new record for batch insert
        newRecords.push({
          OwnerID: ownerId,
          AssessmentID: assessmentId,
          Year: selectedYear,
          NewWardNo: selectedWard || null,
          CreatedDate: currentTimestamp,
          UpdatedDate: currentTimestamp,
          ...updateFields,
        });
      }
    }

    let createdRecords = [];
    if (newRecords.length > 0) {
      const insertedRecords = await ApplyPenaltyTaxByOwnerIDWise.bulkCreate(
        newRecords,
        { transaction }
      );
      createdRecords = insertedRecords.map((rec) => rec.toJSON());
      console.log(`✅ Created ${createdRecords.length} new records`);
    }

    await transaction.commit();

    if (createdRecords.length > 0 && updatedRecords.length > 0) {
      return res.status(200).json({
        message: 'Penalty applied successfully. Created and updated records.',
        createdRecords,
        updatedRecords,
      });
    } else if (createdRecords.length > 0) {
      return res.status(200).json({
        message: 'Penalty applied successfully. New records created.',
        createdRecords,
      });
    } else if (updatedRecords.length > 0) {
      return res.status(201).json({
        message: 'Penalty applied successfully. Records updated.',
        updatedRecords,
      });
    } else {
      return res.status(204).json({
        message: 'No changes were made.',
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Error in ApplyPenaltyTaxByOwnerIdWise:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

// export const ApplyPenaltyTaxByOwnerIdWise = async (req, res) => {
//   const { dataToUpdate } = req.body;
//   let { selectedYear, selectedWard, ownerIds, ...updateFields } = dataToUpdate;

//   if (!Array.isArray(ownerIds) || ownerIds.length === 0) {
//     return res.status(400).json({ message: 'Invalid or missing ownerIds' });
//   }

//   const transaction =
//     await ApplyPenaltyTaxByOwnerIDWise.sequelize.transaction();
//   try {
//     const currentTimestamp = new Date();

//     // Map frontend keys to database columns
//     const fieldMappings = {
//       billGenerationDate: 'BillGenerationDate',
//       startHalfOnCurrent: 'start_half_on_current',
//       endHalfOnCurrent: 'end_half_on_current',
//       startFullOnCurrent: 'start_full_on_current',
//       endFullOnCurrent: 'end_full_on_current',
//       startFullOnPending: 'start_full_on_pending',
//       endFullOnPending: 'end_full_on_pending',
//     };

//     Object.keys(fieldMappings).forEach((key) => {
//       if (updateFields[key] !== undefined) {
//         updateFields[fieldMappings[key]] = updateFields[key];
//         delete updateFields[key];
//       }
//     });

//     console.log('Final updateFields:', updateFields);

//     // Fetch existing records in bulk (avoiding loop queries)
//     const existingRecords = await ApplyPenaltyTaxByOwnerIDWise.findAll({
//       where: {
//         OwnerID: { [Sequelize.Op.in]: ownerIds },
//         Year: selectedYear,
//       },
//       attributes: ['OwnerID', 'Year'],
//       raw: true,
//     });

//     const existingOwnerIds = new Set(existingRecords.map((rec) => rec.OwnerID));

//     // // Fetch `AssessmentID` for all `ownerIds` at once
//     // const assessmentRecords = await AssessmentRuleMaster.findAll({
//     //   attributes: ['OwnerID', 'AssessmentID'],
//     //   where: { OwnerID: { [Sequelize.Op.in]: ownerIds } },
//     //   raw: true,
//     // });

//     // // Create a mapping of OwnerID -> AssessmentID
//     // const assessmentMap = {};
//     // assessmentRecords.forEach(({ OwnerID, AssessmentID }) => {
//     //   assessmentMap[OwnerID] = AssessmentID;
//     // });

//     const newRecords = [];
//     const updatedRecords = [];

//     for (const ownerId of ownerIds) {
//       //const assessmentId = assessmentMap[ownerId] || null; // Get AssessmentID for ownerId

//       if (existingOwnerIds.has(ownerId)) {
//         // Update existing record
//         await ApplyPenaltyTaxByOwnerIDWise.update(
//           {
//             ...updateFields,
//             AssessmentID: assessmentId,
//             UpdatedDate: currentTimestamp,
//           },
//           { where: { OwnerID: ownerId, Year: selectedYear }, transaction }
//         );

//         let updatedData = await ApplyPenaltyTaxByOwnerIDWise.findOne({
//           where: { OwnerID: ownerId, Year: selectedYear },
//           raw: true,
//         });

//         console.log(` Updated record for OwnerID: ${ownerId}`, updatedData);
//         updatedRecords.push(updatedData);
//       } else {
//         // Prepare new record for batch insert
//         newRecords.push({
//           OwnerID: ownerId,
//           Year: selectedYear,
//           NewWardNo: selectedWard || null,
//           // AssessmentID: assessmentId,
//           CreatedDate: currentTimestamp,
//           UpdatedDate: currentTimestamp,
//           ...updateFields,
//         });
//       }
//     }

//     if (newRecords.length > 0) {
//       const insertedRecords = await ApplyPenaltyTaxByOwnerIDWise.bulkCreate(
//         newRecords,
//         { transaction }
//       );
//       console.log(`✅ Created ${insertedRecords.length} new records`);
//       updatedRecords.push(...insertedRecords.map((rec) => rec.toJSON()));
//     }

//     await transaction.commit();
//     res.status(200).json({
//       message: 'Penalty applied successfully for selected owner IDs.',
//       updatedRecords,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Error in ApplyPenaltyTaxByOwnerIdWise:', error);
//     res.status(500).json({
//       message: 'Internal Server Error',
//       error: error.message,
//     });
//   }
// };
