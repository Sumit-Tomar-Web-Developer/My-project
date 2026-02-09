import sequelize from "../../config/connectionDB.js";
import { Op, QueryTypes } from "sequelize";
import ZoneSectionMaster from "../../models/models/ZoneSectionmaster.js";
import RateMaster from "../../models/models/ratemaster.js";
import ZoneSectionDetails from "../../models/models/zonesectiondetails.js";

export const getZoneSectionInfo = async (req, res) => {
  try {
    const getZoneSectionInfo = await ZoneSectionMaster.findAll();
    res.status(200).json(getZoneSectionInfo);
  } catch (error) {
    console.error("Error getting Zone Section:", error);
    res.status(500).json({
      error: "An error occurred while getting Zone Section.",
    });
  }
};

export const getZoneSectionDetails = async (re, res) => {
  try {
    const getZones = await ZoneSectionDetails.findAll();
    res.status(200).json(getZones);
  } catch (error) {
    console.error("Error getting Zone Details:", error);
    res.status(500).json({
      error: "An error occurred while getting Zone Details.",
    });
  }
};

export const addWardToZone = async (req, res) => {
  const data = req.body;
   console.log( req.body,' req.body;')
  try {
    // Check if ZoneSectionNo and WardList are provided
    
    if (data.ZoneSectionNo != null && data.ZoneSectionNo !== "") {
      
      // If WardList is empty, delete all wards for that ZoneSectionNo
      if (data.WardList.length === 0) {
        await ZoneSectionDetails.destroy({ where: { ZoneSectionNo: data.ZoneSectionNo } });
        return res.status(200).json({ message: `All wards removed from Zone ${data.ZoneSectionNo}.` });
      }

      // Check for conflicts where the Ward already exists in another ZoneSection
      for (let i = 0; i < data.WardList.length; i++) {
        const Ward = data.WardList[i];
        const ZoneSectionNo = data.ZoneSectionNo;
        const isExists = await ZoneSectionDetails.findOne({ where: { Ward } });
        
        // If Ward already exists and is associated with a different ZoneSectionNo
        if (isExists && isExists.ZoneSectionNo !== ZoneSectionNo) {
          return res.status(202).json({
            error: `Ward ${Ward} already present in a different Zone.`,
          });
        }
      }

      // Proceed to delete and create new records
      for (let i = 0; i < data.WardList.length; i++) {
        const Ward = data.WardList[i];
        const ZoneSectionNo = data.ZoneSectionNo;

        // First, delete any existing record for the Ward in the current Zone
        await ZoneSectionDetails.destroy({ where: { Ward, ZoneSectionNo } });

        // Then create a new record for the Ward under the new ZoneSectionNo
        await ZoneSectionDetails.create({
          ZoneSectionNo,
          Ward,
        });
      }

      return res.status(200).json({
        message: `Wards successfully added to Zone ${data.ZoneSectionNo}.`,
      });

    } else {
      return res.status(400).json({
        error: "Zone Section Number is required.",
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      error: "An error occurred while adding Ward to Zone Section.",
    });
  }
};

export const saveZoneSectionInfo = async (req, res) => {
  const { ZoneID, ZoneSectionNo, ZoneSectionType, Remark, Status } = req.body;

  let Id = 0;
  if (!ZoneID) Id = 0;
  else Id = ZoneID;
  try {
    if (ValidateTypeTaxableStatus(Status)) {
      return res.status(400).json({
        message: "Invalid value for Status. Must be 0, 1, true, or false.",
      });
    }
    let ZoneSectionInfo = await ZoneSectionMaster.findOne({
      where: { ZoneID: Id },
    });

    if (!ZoneSectionInfo) {
      let isTypeExists = await ZoneSectionMaster.findOne({
        where: { ZoneSectionNo },
      });
      if (isTypeExists)
        return res.status(202).json({
          message: `Duplicate Zone Section No ${ZoneSectionNo} found`,
          ZoneSectionInfo,
        });
      ZoneSectionInfo = await ZoneSectionMaster.create({
        ZoneSectionNo,
        ZoneSectionType,
        Remark,
        Status,
      });

      return res.status(200).json({
        message: "Zone Section created successfully",
        ZoneSectionInfo,
      });
    } else {
      let isTypeExists = await ZoneSectionMaster.findOne({
        where: { ZoneSectionNo },
      });
      if (isTypeExists)
        if (isTypeExists.ZoneID != ZoneID)
          return res.status(202).json({
            message: `Duplicate Zone Section No ${ZoneSectionNo} found`,
            ZoneSectionInfo,
          });
      await ZoneSectionInfo.update({
        ZoneSectionNo,
        ZoneSectionType,
        Remark,
        Status,
      });

      return res.status(201).json({
        message: "Zone Section updated successfully",
        ZoneSectionInfo,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update/create Zone Section",
      error: error.message,
    });
  }
};

export const deleteZoneSectionInfo = async (req, res) => {
  const { IDs } = req.body; // Assuming you receive an array of ZoneIDs

  if (
    !Array.isArray(IDs) ||
    !IDs.every((id) => Number.isInteger(id) && id > 0)
  ) {
    return res.status(400).json({
      message: "Zone Section IDs must be an array of positive integers",
    });
  }

  const t = await sequelize.transaction();
  try {
    const zoneSectionRecords = await ZoneSectionMaster.findAll({
      where: { ZoneID: IDs },
      transaction: t,
    });

    if (zoneSectionRecords.length === 0) {
      await t.rollback();
      return res
        .status(203)
        .json({ message: "Zone Section records not found" });
    }

    const zoneSectionNos = zoneSectionRecords.map(
      (record) => record.ZoneSectionNo
    );

    // Check if any Zone Sections are present in RateMaster table
    const rateMasterRecords = await RateMaster.findAll({
      where: { ZoneSectionNo: zoneSectionNos },
      transaction: t,
    });

    if (rateMasterRecords.length > 0) {
      await t.rollback();
      return res.status(203).json({
        message:
          "Cannot delete Zone Section records as they are present in RateMaster table",
      });
    }

    // Delete related records in ZoneSectionDetails
    await ZoneSectionDetails.destroy({
      where: { ZoneSectionNo: zoneSectionNos },
      transaction: t,
    });

    // Delete Zone Section records
    await ZoneSectionMaster.destroy({
      where: { ZoneID: IDs },
      transaction: t,
    });

    await t.commit();
    res
      .status(200)
      .json({ message: "Zone Section records deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting Zone Section records:", error);
    res.status(500).json({
      error: "An error occurred while deleting Zone Section records.",
    });
  }
};

function ValidateTypeTaxableStatus(value) {
  // Check if value is a boolean, if so, convert to corresponding integer
  if (typeof value === "boolean") {
    return false;
  }

  // Check if value is an integer and within the range of 0 and 1
  if (Number.isInteger(value) && (value === 0 || value === 1)) {
    return false;
  }

  // If the value does not match any valid type, throw an error
  return true;
}
