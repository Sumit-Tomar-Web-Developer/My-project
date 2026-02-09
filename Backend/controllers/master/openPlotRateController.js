import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from 'sequelize';
import openPlotRateMaster from '../../models/models/openplotratemaster.js';
import { getAssessmentIdForOwner } from '../master/applyTaxController.js';


export const getOpenPlotRateInfo = async (req, res) => {
  try {
    const getOpenPlotRateInfo = await openPlotRateMaster.findAll();
    res.status(200).json(getOpenPlotRateInfo);
  } catch (error) {
    console.error('Error getting Open Plot Rate:', error);
    res.status(500).json({
      error: 'An error occurred while getting Open Plot Rate.',
    });
  }
};

export const saveOpenPlotRateInfo = async (req, res) => {
  const { ID, ZoneNo, Year, RateSquareMeter, TypeOfUse, OnRVOrALV } = req.body;

  const AssesmentID = await getAssessmentIdForOwner();
  console.log('Fetched assessment ID:', AssesmentID);

  let Id = 0;
  if (!ID) Id = 0;
  else Id = ID;
  try {
    if (!ZoneNo)
      return res.status(402).json({
        message: 'Zone No required',
      });
    if (!Year)
      return res.status(402).json({
        message: 'Year required',
      });
    else if (!Number.isInteger(Year) || Year < 0)
      return res.status(402).json({
        message: 'Year Must be Integer or greater than 0',
      });
    if (!RateSquareMeter)
      return res.status(402).json({
        message: 'Rate required',
      });
    else if (!Number.isInteger(RateSquareMeter) || RateSquareMeter < 0)
      return res.status(402).json({
        message: 'Rate Must be Integer or greater than 0',
      });
    if (!TypeOfUse)
      return res.status(402).json({
        message: 'Type Of Use required',
      });
    let OpenPlotRateInfo = await openPlotRateMaster.findOne({
      where: { ID: Id },
    });

    if (!OpenPlotRateInfo) {
      OpenPlotRateInfo = await openPlotRateMaster.create({
        ZoneNo,
        Year,
        RateSquareMeter,
        TypeOfUse,
        OnRVOrALV,
        AssesmentID,
        CreatedDate:new Date(),

      });
      return res.status(200).json({
        message: 'Open Plot Rate created successfully',
        OpenPlotRateInfo,
      });
    } else {
      await OpenPlotRateInfo.update({
        ZoneNo,
        Year,
        RateSquareMeter,
        TypeOfUse,
        OnRVOrALV,
        AssesmentID,
        UpdatedDate:new Date(),
    
      });
      return res.status(201).json({
        message: 'Open Plot Rate updated successfully',
        OpenPlotRate: OpenPlotRateInfo,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update/create Open Plot Rate',
      error: error.message,
    });
  }
};

export const deleteOpenPlotRateInfo = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const ids = req.body.IDs;  // Assuming you receive an array of IDs

    if (!Array.isArray(ids) || !ids.every(id => Number.isInteger(id) && id > 0)) {
      return res.status(400).json({
        message: 'Open Plot Rate IDs must be an array of positive integers'
      });
    }

    const openPlotRateRecords = await openPlotRateMaster.findAll({
      where: { ID: ids },
      transaction: t
    });

    if (openPlotRateRecords.length === 0) {
      await t.rollback();
      return res.status(203).json({ message: 'Open Plot Rate records not found' });
    }

    const result = await openPlotRateMaster.destroy({
      where: { ID: ids },
      transaction: t
    });

    if (result > 0) {
      await t.commit();
      res.status(200).json({ message: 'Open Plot Rate records deleted successfully' });
    } else {
      await t.rollback();
      res.status(203).json({ message: 'Records Not Found' });
    }
  } catch (error) {
    await t.rollback();
    console.error('Error deleting Open Plot Rate records:', error);
    res.status(500).json({
      error: 'An error occurred while deleting Open Plot Rate records.',
    });
  }
};
