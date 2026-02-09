import PropertyMast from '../../../models/models/propertymast.js';
import { Op } from 'sequelize';
import sequelize from '../../../config/connectionDB.js';

export const getLockedUnLockedProperties = async (req, res) => {
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
        'isPropertyLock',
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

    // Convert isPropertyLock to boolean and filter properties
    const modifiedProperties = properties.map((property) => ({
      ...property.toJSON(),
      isPropertyLock: property.isPropertyLock === 1 ? true : false,
    }));

    const lockedProperties = modifiedProperties.filter(
      (property) => property.isPropertyLock === true
    );

    const unlockedProperties = modifiedProperties.filter(
      (property) => property.isPropertyLock === false
    );

    // Extract OwnerIDs from unlocked properties
    const unlockedOwnerIds = unlockedProperties.map(
      (property) => property.OwnerID
    );

    // Return the list of locked OwnerIDs
    const lockedOwnerIds = lockedProperties.map((property) => property.OwnerID);

    // Return both locked/unlocked properties and the list of unlocked OwnerIDs
    res.status(200).json({
      message: `Locked and UnLocked properties fetched successfully.`,
      lockedProperties,
      unlockedProperties,
      unlockedOwnerIds,
      lockedOwnerIds,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const PropertiesLockedByOwnerId = async (req, res) => {
  const { wardNo, fromPropertyNo, toPropertyNo, ownerIds } = req.body;

  if (!ownerIds || !Array.isArray(ownerIds) || ownerIds.length === 0) {
    return res.status(400).json({ message: 'Invalid or missing Owner IDs.' });
  }

  try {
    // Fetch properties that match the criteria and check if they are already locked
    const existingLockedProperties = await PropertyMast.findAll({
      where: {
        NewWardNo: wardNo,
        OwnerID: { [Op.in]: ownerIds },
        isPropertyLock: true,
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
    });

    if (existingLockedProperties.length === ownerIds.length) {
      return res
        .status(400)
        .json({ message: 'All selected properties are already locked.' });
    }

    // Lock properties that are not already locked
    await PropertyMast.update(
      { isPropertyLock: true },
      {
        where: {
          NewWardNo: wardNo,
          OwnerID: { [Op.in]: ownerIds },
          isPropertyLock: false,
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
      }
    );

    // Fetch updated properties
    const updatedProperties = await PropertyMast.findAll({
      attributes: [
        'NewWardNo',
        'NewPartitionNo',
        'NewPropertyNo',
        'OwnerID',
        'isPropertyLock',
      ],
      where: {
        NewWardNo: wardNo,
        OwnerID: { [Op.in]: ownerIds },
      },
    });

    res.status(201).json({
      message: `${updatedProperties.length} properties locked successfully.`,
      updatedProperties,
    });
  } catch (error) {
    console.error('Error locking properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const PropertiesUnLockedByOwnerId = async (req, res) => {
  const { wardNo, fromPropertyNo, toPropertyNo, ownerIds } = req.body;

  if (!ownerIds || !Array.isArray(ownerIds) || ownerIds.length === 0) {
    return res.status(400).json({ message: 'Invalid or missing Owner IDs.' });
  }

  try {
    await PropertyMast.update(
      { isPropertyLock: false },
      {
        where: {
          NewWardNo: wardNo,
          OwnerID: { [Op.in]: ownerIds },
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
      }
    );

    // Fetch updated properties
    const updatedProperties = await PropertyMast.findAll({
      attributes: [
        'NewWardNo',
        'NewPartitionNo',
        'NewPropertyNo',
        'OwnerID',
        'isPropertyLock',
      ],
      where: {
        NewWardNo: wardNo,
        OwnerID: { [Op.in]: ownerIds },
      },
    });

    res.status(201).json({
      message: `${updatedProperties.length} properties unlocked successfully.`,
      updatedProperties,
    });
  } catch (error) {
    console.error('Error unlocking properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
