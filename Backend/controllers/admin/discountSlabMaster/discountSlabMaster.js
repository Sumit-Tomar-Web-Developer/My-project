import ZoneSectionDetails from "../../../models/models/zonesectiondetails.js";
import PaymentResourceMaster from "../../../models/models/paymentResourceMaster.js";
import DiscountSlabMaster from "../../../models/models/discountslabmaster.js";
import { Sequelize, Op } from "sequelize";

export const getZoneList = async (req, res) => {
  try {
    const zones = await ZoneSectionDetails.findAll({
      attributes: [
        [Sequelize.fn("TRIM", Sequelize.col("ZoneSectionNo")), "ZoneSectionNo"],
      ],
      where: {
        ZoneSectionNo: {
          [Op.ne]: null,
          [Op.ne]: "",
        },
      },
      group: ["ZoneSectionNo"],
      order: [["ZoneSectionNo", "ASC"]],
      raw: true,
    });

    if (!zones.length) {
      return res.status(404).json({ message: "Zones not found" });
    }

    return res.status(200).json(zones.map((z) => z.ZoneSectionNo));
  } catch (error) {
    console.error("Error fetching zone list:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* -------------------- GET WARDS BY ZONE -------------------- */

export const fetchZoneWiseWardList = async (req, res) => {
  try {
    const { zoneNo } = req.body;

    if (!Array.isArray(zoneNo) || zoneNo.length === 0) {
      return res.status(400).json({
        message: "Zone Number is required",
      });
    }

    const wardList = await ZoneSectionDetails.findAll({
      attributes: ["Ward"],
      where: {
        ZoneSectionNo: {
          [Op.in]: zoneNo,
        },
      },
      group: ["Ward"],
      order: [["Ward", "ASC"]],
      raw: true,
    });

    if (wardList.length === 0) {
      return res.status(404).json({
        message: "Wards not found for selected zone",
      });
    }

    const wards = wardList.map((w) => w.Ward);

    return res.status(200).json(wards);
  } catch (error) {
    console.error("Error fetching ward list:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const fetchPaymentResouceList = async (req, res) => {
  try {
    const paymentResouce = await PaymentResourceMaster.findAll({
      attributes: ["Resource"],
      raw: true,
    });

    if (paymentResouce.length === 0) {
      return res.status(404).json({
        message: "PaymentResouce not found ",
      });
    }
    const paymentResouces = paymentResouce.map((p) => p.Resource);
    return res.status(200).json(paymentResouces);
  } catch (error) {
    console.error("Error fetching paymentResouces list:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const fetchTaxType = async (req, res) => {
  try {
    const taxTypeList = await Transmast.findAll({
      attributes: [],
      raw: true,
    });

    return res.status(200).json(taxTypeList);
  } catch (error) {
    console.error("Error fetching paymentResouces list:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const saveDiscountSlabEntries = async (req, res) => {
  try {
    const {
      zoneNo,
      wardNo,
      paymentType,
      selectedResource,
      selectedTaxType,
      percentage,
      currentYear,
      fromDate,
      toDate,
    } = req.body;

    console.log("saveDiscountSlabEntries", req.body);

    // Validation
    if (
      !zoneNo?.length ||
      !wardNo?.length ||
      !paymentType?.length ||
      !selectedResource?.length ||
      !selectedTaxType?.length ||
      !fromDate ||
      !toDate
    ) {
      return res.status(400).json({ message: "All selections are required." });
    }

    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({ message: "Invalid discount percentage." });
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({ message: "Invalid date range." });
    }

    const currYear = Number(currentYear) || new Date().getFullYear();

    const selections = [
      zoneNo,
      wardNo,
      paymentType,
      selectedResource,
      selectedTaxType,
    ];
    const fieldNames = [
      "ZoneSectionNo",
      "Ward",
      "PaymentType",
      "PaymentResource",
      "TaxName",
    ];

    const batchSize = 1000;
    let batch = [];
    let insertedRecords = [];
    let duplicateRecords = [];

    function* cartesian(arrays) {
      const n = arrays.length;
      const indices = Array(n).fill(0);
      while (true) {
        yield indices.map((v, i) => arrays[i][v]);
        let i = n - 1;
        while (i >= 0) {
          indices[i]++;
          if (indices[i] < arrays[i].length) break;
          indices[i] = 0;
          i--;
        }
        if (i < 0) break;
      }
    }

    for (const combo of cartesian(selections)) {
      const entry = combo.reduce((acc, val, i) => {
        acc[fieldNames[i]] = val;
        return acc;
      }, {});

      entry.DiscountPercentage = percentage;
      entry.DiscountFromDate = new Date(fromDate);
      entry.DiscountToDate = new Date(toDate);
      entry.DiscountFinanceYear = currYear;
      entry.DiscountPendingYear =
        entry.PaymentType === "Pending" ? currYear - 1 : currYear;

      batch.push(entry);

      if (batch.length === batchSize) {
        try {
          const created = await DiscountSlabMaster.bulkCreate(batch, {
            ignoreDuplicates: false,
          });
          insertedRecords.push(...created.map((r) => r.get({ plain: true })));
        } catch (err) {
          if (err instanceof Sequelize.UniqueConstraintError) {
            // Separate duplicates from successful inserts
            duplicateRecords.push(...err.errors.map((e) => e.value));
          } else {
            throw err;
          }
        }
        batch = [];
      }
    }

    // Insert remaining batch
    if (batch.length) {
      try {
        const created = await DiscountSlabMaster.bulkCreate(batch, {
          ignoreDuplicates: false,
        });
        insertedRecords.push(...created.map((r) => r.get({ plain: true })));
      } catch (err) {
        if (err instanceof Sequelize.UniqueConstraintError) {
          duplicateRecords.push(...err.errors.map((e) => e.value));
        } else {
          throw err;
        }
      }
    }

    let message = "Discountslabs Data entries Saved successfully.";

    if (insertedRecords.length === 0 && duplicateRecords.length > 0) {
      message = "Duplicate entries found. No new records inserted.";
    } else if (insertedRecords.length > 0 && duplicateRecords.length > 0) {
      message = "Some records inserted. Some duplicates were skipped.";
    }

    return res.status(200).json({
      message,
      totalInserted: insertedRecords.length,
      totalDuplicates: duplicateRecords.length,
      insertedRecords,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};
