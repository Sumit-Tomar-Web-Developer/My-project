import sequelize from "../../config/connectionDB.js";
import { Op, QueryTypes } from "sequelize";
import TransYearMast from "../../models/models/transyearmast.js";

export const getYearInfo = async (req, res) => {
  try {
    const getYearInfo = await TransYearMast.findAll();
    res.status(200).json(getYearInfo);
  } catch (error) {
    console.error("Error getting Year Info:", error);
    res.status(500).json({
      error: "An error occurred while getting Year Info.",
    });
  }
};

export const saveYearInfo = async (req, res) => {
  const {
    FinanceYear,UserID
  } = req.body;

  try {
    if (FinanceYear != null && (!Number.isInteger(FinanceYear) || FinanceYear <= 0))
      return res.status(402).json({
        message: "Year must be type of integer or greater than zero.",
      });
    let YearInfo = await TransYearMast.findOne({
      where: { FinanceYear },
    });

    const isDuplicate = await TransYearMast.findOne({
      where: { FinanceYear },
    });
    if (!YearInfo) {
      if (isDuplicate)
        return res.status(202).json({
          message: "Duplicate Records Found",
          YearInfo,
        });

      YearInfo = await TransYearMast.create({
        FinanceYear,
        CreatedBy: UserID,        
        CreatedDate: new Date()
      });

      return res.status(200).json({
        message: "Year Info created successfully",
        YearInfo,
      });
    } else {
      if (isDuplicate)
        return res.status(202).json({
          message: "Duplicate Records Found",
          YearInfo,
        });

      await YearInfo.update({
        FinanceYear,
        UpdatedBy: UserID,       
        UpdatedDate: new Date()
      });

      return res.status(201).json({
        message: "Year Info updated successfully",
        YearInfo: YearInfo,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update/create Year Info",
      error: error.message,
    });
  }
};

export const deleteYearInfo = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const financeYears = req.body.FinanceYears;  

    if (!Array.isArray(financeYears) || !financeYears.every(year => Number.isInteger(year) && year > 0)) {
      return res.status(400).json({
        message: 'Finance Years must be an array of positive integers'
      });
    }

    const yearInfoRecords = await TransYearMast.findAll({
      where: { FinanceYear: financeYears },
      transaction: t
    });

    if (yearInfoRecords.length === 0) {
      await t.rollback();
      return res.status(203).json({ message: 'Year Info records not found' });
    }

    const result = await TransYearMast.destroy({
      where: { FinanceYear: financeYears },
      transaction: t
    });

    if (result > 0) {
      await t.commit();
      res.status(200).json({ message: 'Year Info records deleted successfully' });
    } else {
      await t.rollback();
      res.status(203).json({ message: 'Records Not Found' });
    }
  } catch (error) {
    await t.rollback();
    console.error('Error deleting Year Info records:', error);
    res.status(500).json({
      error: 'An error occurred while deleting Year Info records.',
    });
  }
};



