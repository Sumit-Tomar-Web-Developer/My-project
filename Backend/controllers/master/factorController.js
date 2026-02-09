import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from 'sequelize';
import Retaintionfactmaster from '../../models/models/retaintionfactmaster.js';


export const getFactorInfo = async (req, res) => {
  try {
    const getFactorInfo = await Retaintionfactmaster.findAll();
    res.status(200).json(getFactorInfo);
  } catch (error) {
    console.error('Error getting factors:', error);
    res.status(500).json({
      error: 'An error occurred while getting factors.',
    });
  }
};

export const saveFactorInfo = async (req, res) => {
  const { FacterID, FromYear, ToYear, FromFactor, ToFactor, FactorValue } =
    req.body;

  if (!FactorValue || FactorValue <= 0) {
    return res.status(400).json({
      message: 'Factor Value is required and must be greater than zero',
    });
  }

  try {
    let factInfo;

    if (FacterID) {
      factInfo = await Retaintionfactmaster.findOne({
        where: { FacterID },
      });
    }

    if (!factInfo) {
      factInfo = await Retaintionfactmaster.create({
        FromYear,
        ToYear,
        FromFactor,
        ToFactor,
        FactorValue,
        CreatedDate:new Date(),
   
      });

      return res.status(201).json({
        message: 'Factors created successfully',
        factInfo,
      });
    } else {
      await factInfo.update({
        FromYear,
        ToYear,
        FromFactor,
        ToFactor,
        FactorValue,
        UpdatedDate:new Date(),
        
      });

      return res.status(200).json({
        message: 'Factors updated successfully',
        Factor: factInfo,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update/create factor',
      error: error.message,
    });
  }
};

export const deleteFactorInfo = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const factIds = req.body.FacterIDs;  // Assuming you receive an array of IDs

    if (!Array.isArray(factIds) || !factIds.every(id => Number.isInteger(id) && id > 0)) {
      return res.status(400).json({
        message: 'Factor IDs must be an array of positive integers'
      });
    }

    const result = await Retaintionfactmaster.destroy({
      where: { FacterID: factIds },
      transaction: t
    });

    if (result > 0) {
      await t.commit();
      res.status(200).json({ message: 'Factors deleted successfully' });
    } else {
      await t.rollback();
      res.status(203).json({ message: 'Records Not Found' });
    }
  } catch (error) {
    await t.rollback();
    console.error('Error deleting factors:', error);
    res.status(500).json({
      error: 'An error occurred while deleting factors.',
    });
  }
};
