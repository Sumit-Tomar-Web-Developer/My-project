import sequelize from "../../config/connectionDB.js";

import TaxNameMaster from "../../models/models/taxnamemaster.js";

export const getTaxNameList = async (req, res) => {
  try {
    const taxName = await TaxNameMaster.findAll();
    res.status(200).json(taxName);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Occurred while fetching Tax Name List", error: error.message });
  }
};

export const postTaxNameList = async (req, res) => {
  const taxNames = req.body;

  try {
    for (const taxNameEntry of taxNames) {
      const { ID, TaxName, AliseName, Status } = taxNameEntry;

      if (TaxName === undefined) {
        return res.status(401).json({ message: "Tax Name is Required" });
      }

      if (AliseName === undefined) {
        return res.status(402).json({ message: "Alias Name is Required" });
      }

      let Id = ID !== undefined ? ID : 0;

      let taxNameInfo = await TaxNameMaster.findOne({ where: { ID: Id } });

      if (!taxNameInfo) {
        let isTaxNameExists = await TaxNameMaster.findOne({ where: { TaxName } });
        if (isTaxNameExists) {
          return res
            .status(202)
            .json({ message: `Duplicate Tax Name '${TaxName}' found` });
        }
        taxNameInfo = await TaxNameMaster.create({ TaxName, AliseName, Status });
        return res
          .status(200)
          .json({ message: "Tax Name Created Successfully", taxNameInfo });
      } else {
        let isTaxExists = await TaxNameMaster.findOne({ where: { TaxName } });
        if (isTaxExists && isTaxExists.ID != ID) {
          return res
            .status(202)
            .json({ message: `Duplicate Tax Name '${TaxName}' found` });
        }
      }

      await taxNameInfo.update({ TaxName, AliseName, Status });
    }

    return res.status(201).json({ message: "Tax Names Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to Process Tax Names", error: error.message });
  }
};

export const deleteTaxName = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const taxIds = req.body.IDs;  // Assuming you receive an array of IDs

    if (!Array.isArray(taxIds) || !taxIds.every(id => Number.isInteger(id) && id > 0)) {
      return res.status(400).json({
        message: 'Tax IDs must be an array of positive integers'
      });
    }

    const taxNameRecords = await TaxNameMaster.findAll({
      where: { ID: taxIds },
      transaction: t
    });

    if (taxNameRecords.length === 0) {
      await t.rollback();
      return res.status(203).json({ message: 'Tax Name records not found' });
    }

    const result = await TaxNameMaster.destroy({
      where: { ID: taxIds },
      transaction: t
    });

    if (result > 0) {
      await t.commit();
      res.status(200).json({ message: 'Tax Name records deleted successfully' });
    } else {
      await t.rollback();
      res.status(203).json({ message: 'Records Not Found' });
    }
  } catch (error) {
    await t.rollback();
    console.error('Error deleting Tax Name records:', error);
    res.status(500).json({
      error: 'An error occurred while deleting Tax Name records.',
    });
  }
};
