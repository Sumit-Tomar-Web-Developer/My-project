import sequelize from "../../config/connectionDB.js";
import { Op, QueryTypes } from "sequelize";
import TaxMaster from "../../models/models/taxmaster.js";

export const getTaxMasterInfo = async (req, res) => {
  const taxName = req.query.TaxNametype;
  try {
    const getTaxMasterInfo = await TaxMaster.findAll({
      where: { TaxNametype: taxName },
    });
    res.status(200).json(getTaxMasterInfo);
  } catch (error) {
    console.error("Error getting Tax Master:", error);
    res.status(500).json({
      error: "An error occurred while getting Tax Master.",
    });
  }
};

export const saveTaxMasterInfo = async (req, res) => {
  console.log(req.body, 'request body');
  const {
    Taxnametype,
    Type,                 // <-- array of types
    Year,
    MinAmount,
    MaxAmount,
    Rate,
    AssessmentId,
    OnRVOrALV,
  } = req.body;

  try {
    // --- basic validation ---
    if (!Array.isArray(Type) || Type.length === 0) {
      return res.status(400).json({ message: "Type must be a non-empty array." });
    }
    if (Year != null && (!Number.isInteger(Year) || Year <= 0)) {
      return res.status(402).json({ message: "Year must be type of integer or greater than zero." });
    }
    if (AssessmentId != null && (!Number.isInteger(AssessmentId) || AssessmentId < 0)) {
      return res.status(402).json({ message: "Assessment ID must be type of integer or greater than zero." });
    }

    // --- normalize & dedupe the array ---
    const types = [...new Set(Type.map((t) => String(t).trim()).filter(Boolean))];

    const created = [];
    const updated = [];
    const failed = [];

    // Upsert per Type using natural key (Taxnametype, Year, Type)
    for (const t of types) {
      try {
        const existing = await TaxMaster.findOne({
          where: {
            Taxnametype: Taxnametype,
            Type: t,                 // <-- array of types
            Year: Year,
            MinAmount: MinAmount,
            MaxAmount: MaxAmount,
            Rate: Rate,
            AssessmentId: AssessmentId,
            OnRVOrALV: OnRVOrALV
          },
        });


        if (!existing) {
          const rec = await TaxMaster.create({
            Taxnametype,
            Type: t,
            Year,
            MinAmount,
            MaxAmount,
            Rate,
            AssessmentId,
            OnRVOrALV,
          });
          created.push(rec);
        } else {
          console.log(existing, 'existing record found');
          await existing.update({
            Type: t,
            Taxnametype,
            Year,
            MinAmount,
            MaxAmount,
            Rate,
            AssessmentId,
            OnRVOrALV,
          }, { where: { ID: req.body.ID } });
          updated.push(existing);
        }
      } catch (err) {
        failed.push({ Type: t, error: err.message });
      }
    }

    const status = failed.length ? 207 : (created.length && !updated.length ? 200 : 201);
    return res.status(status).json({
      message: failed.length
        ? "Completed with some failures"
        : created.length && !updated.length
          ? "Tax Masters created successfully"
          : created.length && updated.length
            ? "Tax Masters created/updated successfully"
            : "Tax Masters updated successfully",
      summary: {
        created: created.length,
        updated: updated.length,
        failed: failed.length,
      },
      created,
      updated,
      failed,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to save Tax Master info",
      error: error.message,
    });
  }
};

export const deleteTaxMasterInfo = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const ids = req.body.IDs;  // Assuming you receive an array of IDs

    if (!Array.isArray(ids) || !ids.every(id => Number.isInteger(id) && id > 0)) {
      return res.status(400).json({
        message: 'Tax Master IDs must be an array of positive integers'
      });
    }

    const taxMasterRecords = await TaxMaster.findAll({
      where: { ID: ids },
      transaction: t
    });

    if (taxMasterRecords.length === 0) {
      await t.rollback();
      return res.status(203).json({ message: 'Tax Master records not found' });
    }

    const result = await TaxMaster.destroy({
      where: { ID: ids },
      transaction: t
    });

    if (result > 0) {
      await t.commit();
      res.status(200).json({ message: 'Tax Master records deleted successfully' });
    } else {
      await t.rollback();
      res.status(203).json({ message: 'Records Not Found' });
    }
  } catch (error) {
    await t.rollback();
    console.error('Error deleting Tax Master records:', error);
    res.status(500).json({
      error: 'An error occurred while deleting Tax Master records.',
    });
  }
};
