import PropertyMast from "../../../models/models/propertymast.js";
import { OldPropertyMast } from "../../../models/models/oldpropertymast.js";
import PropertyImageMast from "../../../models/models/propertyimagesmast.js";
import PropertyDetailsNew from "../../../models/models/propertydetailsnew.js";
import CombinedOwnerName from "../../../models/models/combinedownerrenternames.js";
import JoinOwnerDetails from "../../../models/models/jointownerdetails.js";
import PropertyTypeMaster from "../../../models/models/propertytypemaster.js";
import TransMast from "../../../models/models/transmast.js";
import TypeofUseMaster from "../../../models/models/typeofusemaster.js";
import AssessmentMaster from "../../../models/models/assessmentmaster.js";
import MutationDetails from "../../../models/models/mutationdetails.js";
import { ApplyTaxMasterPrime } from "../../../models/models/applytaxesmasterprime.js";
import ApplyTaxesMaster from "../../../models/models/applytaxesmaster.js";
import BillBookEntry from "../../../models/models/billbookentry.js";
import InvoiceNoMaster from "../../../models/models/invoicemaster.js";
import BillTransactionDetailsAdvance from "../../../models/models/billtransactiondetailsadvance.js";
import BillTransactionDetails from "../../../models/models/billtransactiondetails.js";
import { Op, Sequelize, where, cast, col } from "sequelize";
import sequelize from "../../../config/connectionDB.js";

PropertyMast.hasOne(JoinOwnerDetails, {
  foreignKey: "OwnerID",
  as: "joinOwnerDetails",
});

PropertyMast.belongsTo(PropertyTypeMaster, {
  foreignKey: "PropertyTypeID",
  targetKey: "PropertyTypeID",
  as: "propertyTypeMaster",
});

PropertyMast.hasOne(PropertyDetailsNew, {
  foreignKey: "OwnerID",
  as: "propertyDetailsNew",
});

PropertyMast.hasOne(TransMast, {
  foreignKey: "OwnerID",
  as: "transMast",
});

PropertyMast.hasOne(ApplyTaxesMaster, {
  foreignKey: "OwnerID",
  as: "applyTaxesMaster",
});

PropertyDetailsNew.belongsTo(ApplyTaxMasterPrime, {
  foreignKey: "TypeOFUse", // column IN PropertyDetailsNew
  targetKey: "TypeofUseId", // column IN ApplyTaxesMasterPrime
  as: "applyTaxMasterPrime",
});

export const getMissingPhotos = async (req, res) => {
  try {
    const { photoA, photoB, photoC, photoD, planPhoto, wardNo } = req.body;
    console.log("get missing photos", req.body);

    // Validate ward numbers
    if (!wardNo || wardNo.length === 0) {
      return res
        .status(400)
        .json({ message: "Ward number(s) must be provided." });
    }

    const intWardNo = wardNo.map((item) => parseInt(item.trim(), 10));

    // Build dynamic missing photo conditions
    const missingConditions = [];
    if (photoA) missingConditions.push({ PropertyPhotoA: null });
    if (photoB) missingConditions.push({ PropertyPhotoB: null });
    if (photoC) missingConditions.push({ PropertyPhotoC: null });
    if (photoD) missingConditions.push({ PropertyPhotoD: null });
    if (planPhoto) missingConditions.push({ PlanPhoto: null });

    console.log("missingConditions", missingConditions);

    if (missingConditions.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid photo filter criteria provided." });
    }

    // Extract only missing keys → ['PropertyPhotoA', 'PlanPhoto', ...]
    const missingKeys = missingConditions.map((obj) => Object.keys(obj)[0]);

    // Fetch missing photos
    const missingPhotosData = await PropertyImageMast.findAll({
      where: {
        [Op.and]: missingConditions,
      },
      include: [
        {
          model: PropertyMast,
          as: "property",
          attributes: [
            "OwnerID",
            "NewZoneNo",
            "NewWardNo",
            "NewPropertyNo",
            "NewPartitionNo",
            "BuildingOrShopNameMarathi",
            "OwnerPatta",
          ],
          where: {
            NewWardNo: {
              [Op.in]: intWardNo,
            },
          },
          include: [
            {
              model: PropertyTypeMaster,
              as: "propertyTypeMaster",
              attributes: ["PropertyDescription"],
            },
          ],
        },
        {
          model: OldPropertyMast,
          as: "oldProperty",
          attributes: ["OldWardNo", "OldPropertyNo", "OldPartitionNo"],
        },
        {
          model: CombinedOwnerName,
          as: "combinedOwnerName",
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
        },
      ],
      order: [
        [{ model: PropertyMast, as: "property" }, "NewWardNo", "ASC"],
        [{ model: PropertyMast, as: "property" }, "NewPropertyNo", "ASC"],
        [{ model: PropertyMast, as: "property" }, "NewPartitionNo", "ASC"],
      ],
    });

    if (!missingPhotosData || missingPhotosData.length === 0) {
      return res.status(404).json({
        message: "No properties found with missing photos ",
      });
    }

    // Format output dynamically
    const formattedData = missingPhotosData.map((item) => {
      const obj = {
        OwnerID: item.property?.OwnerID ?? "",
        NewZoneNo: item.property?.NewZoneNo ?? "",
        NewWardNo: item.property?.NewWardNo ?? "",
        NewPropertyNo: item.property?.NewPropertyNo ?? "",
        NewPartitionNo: item.property?.NewPartitionNo ?? "",
        OldWardNo: item.oldProperty?.OldWardNo ?? "",
        OldPropertyNo: item.oldProperty?.OldPropertyNo ?? "",
        OldPartitionNo: item.oldProperty?.OldPartitionNo ?? "",
        MarathiOwnerName: item.combinedOwnerName?.MarathiOwnerName ?? "",
        MarathiRenterName: item.combinedOwnerName?.MarathiRenterName ?? "",
        BuildingOrShopNameMarathi:
          item.property?.BuildingOrShopNameMarathi ?? "",
        PropertyDescription:
          item.property?.propertyTypeMaster?.PropertyDescription ?? "",
        OwnerPatta: item.property?.OwnerPatta ?? "",
      };

      // Add only selected missing photo fields
      missingKeys.forEach((key) => {
        let label = key; 

        if (key === "PropertyPhotoA") label = "Photo A";
        else if (key === "PropertyPhotoB") label = "Photo B";
        else if (key === "PropertyPhotoC") label = "Photo C";
        else if (key === "PropertyPhotoD") label = "Photo D";
        else if (key === "PlanPhoto") label = "PlanPhoto"; 

        obj[label] = item[key] ? "Available" : "Missing";
      });

      return obj;
    });

    //console.log("Result of missing data", formattedData);
    return res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching missing photos:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the missing photos.",
    });
  }
};

// Function for missing floorinfo/address
export const getMissingData = async (req, res) => {
  const { floorInfo, wardNo } = req.body;

  if (!floorInfo || !wardNo || !Array.isArray(wardNo) || wardNo.length === 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item?.trim() || 0));

  try {
    let result;

    // Common helper to map result data
    const mapResult = (item, extraFields = {}) => ({
      OwnerID: item?.OwnerID ?? "",
      NewZoneNo: item?.NewZoneNo ?? "",
      NewWardNo: item?.NewWardNo ?? "",
      NewPropertyNo: item?.NewPropertyNo ?? "",
      NewPartitionNo: item?.NewPartitionNo ?? "",
      BuildingOrShopNameMarathi: item?.BuildingOrShopNameMarathi ?? "",
      ...extraFields,
    });

    switch (floorInfo) {
      case "option1":
        result = await PropertyMast.findAll({
          where: {
            NewWardNo: { [Op.in]: intWardNo },
            OpenPlot: { [Op.notIn]: [1] },
            CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
          },
          attributes: [
            "OwnerID",
            "NewZoneNo",
            "NewWardNo",
            "NewPropertyNo",
            "NewPartitionNo",
            "BuildingOrShopNameMarathi",
            "OwnerPatta",
            "OpenPlot",
          ],
          include: [
            {
              model: CombinedOwnerName,
              attributes: ["MarathiOwnerName", "MarathiRenterName"],
              required: true,
            },
            {
              model: PropertyDetailsNew,
              as: "propertyDetailsNew",
              attributes: ["OwnerID"],
              required: false, // LEFT JOIN
            },
          ],
          order: [
            [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
            [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
            [
              Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"),
              "ASC",
            ],
          ],
        });
        result = result.filter((item) => !item.propertyDetailsNew);

        result = result.map((item) =>
          mapResult(item, {
            MarathiOwnerName: item?.combinedownerrenternames
              ? item.combinedownerrenternames
                  .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
                  .join(", ")
              : "",
            MarathiRenterName: item?.combinedownerrenternames
              ? item.combinedownerrenternames
                  .flatMap((c) => c.dataValues?.MarathiRenterName || [])
                  .join(", ")
              : "",
            OpenPlot: !item?.OpenPlot || item?.OpenPlot === 0 ? "No" : "Yes",
            FloorInfo: "No", // Because these rows have NO entry in PropertyDetailsNew
            //FloorInfo: item?.propertyDetailsNew?.floorId ? "Yes" : "No",
          })
        );
        break;

      case "option2":
        result = await PropertyMast.findAll({
          where: {
            NewWardNo: { [Op.in]: intWardNo },
            CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
            [Op.or]: [
              { BuildingOrShopNameMarathi: { [Op.eq]: null } },
              { BuildingOrShopNameMarathi: "" },
              { BuildingOrShopNameMarathi: { [Op.eq]: "." } },
            ],
          },
          attributes: [
            "OwnerID",
            "NewZoneNo",
            "NewWardNo",
            "NewPropertyNo",
            "NewPartitionNo",
            "OwnerNameMarathi",
            "BuildingOrShopNameMarathi",
          ],
          include: [
            {
              model: CombinedOwnerName,
              attributes: ["MarathiOwnerName", "MarathiRenterName"],
              required: true,
            },
            {
              model: PropertyTypeMaster,
              as: "propertyTypeMaster",
              attributes: ["PropertyDescription"],
              where: {
                PropertyTypeID: {
                  [Op.in]: [9, 10, 13, 14, 19, 23, 28, 29, 30, 31, 32, 37, 38],
                },
              },
              required: true,
            },
          ],
          order: [
            [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
            [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
            [
              Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"),
              "ASC",
            ],
          ],
        });
        result = result.map((item) =>
          mapResult(item, {
            MarathiOwnerName: item?.combinedownerrenternames
              ? item.combinedownerrenternames
                  .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
                  .join(", ")
              : "",
            MarathiRenterName: item?.combinedownerrenternames
              ? item.combinedownerrenternames
                  .flatMap((c) => c.dataValues?.MarathiRenterName || [])
                  .join(", ")
              : "",
            PropertyDescription:
              item?.propertyTypeMaster?.PropertyDescription || "",
            BuildingOrShopNameMarathi: item?.BuildingOrShopNameMarathi
              ? "Yes"
              : "No",
          })
        );
        break;

      case "option3":
        result = await PropertyMast.findAll({
          where: {
            NewWardNo: { [Op.in]: intWardNo },
            CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
            [Op.or]: [
              { OwnerPatta: null },
              { OwnerPatta: "" },
              { OwnerPatta: "." },
            ],
          },
          attributes: [
            "OwnerID",
            "NewZoneNo",
            "NewWardNo",
            "NewPropertyNo",
            "NewPartitionNo",
            "OwnerPatta",
            "BuildingOrShopNameMarathi",
          ],
          include: [
            {
              model: CombinedOwnerName,
              attributes: ["MarathiOwnerName", "MarathiRenterName"],
              required: true,
            },
            {
              model: JoinOwnerDetails,
              as: "joinOwnerDetails",
              attributes: ["OwnerPatta"],
              where: {
                [Op.or]: [
                  { OwnerPatta: null },
                  { OwnerPatta: "" },
                  { OwnerPatta: "." },
                ],
              },
              required: true,
            },
          ],
          order: [
            [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
            [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
            [
              Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"),
              "ASC",
            ],
          ],
        });

        result = result.map((item) =>
          mapResult(item, {
            MarathiOwnerName: item?.combinedownerrenternames
              ? item.combinedownerrenternames
                  .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
                  .join(", ")
              : "",
            MarathiRenterName: item?.combinedownerrenternames
              ? item.combinedownerrenternames
                  .flatMap((c) => c.dataValues?.MarathiRenterName || [])
                  .join(", ")
              : "",
            OwnerPatta:
              !item?.OwnerPatta || item.OwnerPatta === "." ? "No" : "Yes",
          })
        );
        break;

      case "option4":
        result = await PropertyMast.findAll({
          where: {
            NewWardNo: { [Op.in]: intWardNo },
            CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
            [Op.or]: [{ PlotArea: null }, { PlotArea: "" }, { PlotArea: 0 }],
          },
          attributes: [
            "OwnerID",
            "NewZoneNo",
            "NewWardNo",
            "NewPropertyNo",
            "NewPartitionNo",
            "BuildingOrShopNameMarathi",
            "OwnerPatta",
            "PlotArea",
          ],
          include: [
            {
              model: OldPropertyMast,
              attributes: ["OldWardNo", "OldPropertyNo", "OldPartitionNo"],
            },
            {
              model: CombinedOwnerName,
              attributes: ["MarathiOwnerName", "MarathiRenterName"],
              required: true,
            },
            {
              model: PropertyTypeMaster,
              as: "propertyTypeMaster",
              attributes: ["PropertyDescription"],
              required: true,
            },
          ],
          order: [
            [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
            [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
            [
              Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"),
              "ASC",
            ],
          ],
        });
        result = result.map((item) =>
          mapResult(item, {
            OldWardNo: item?.oldpropertymast?.OldWardNo || "",
            OldPropertyNo: item?.oldpropertymast?.OldPropertyNo || "",
            OldPartitionNo: item?.oldpropertymast?.OldPartitionNo || "",
            MarathiOwnerName: item.combinedownerrenternames
              ? item.combinedownerrenternames
                  .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
                  .join(", ")
              : "",
            MarathiRenterName: item.combinedownerrenternames
              ? item.combinedownerrenternames
                  .flatMap((c) => c.dataValues?.MarathiRenterName || [])
                  .join(", ")
              : "",
            PropertyDescription:
              item?.propertyTypeMaster?.PropertyDescription || "",
            OwnerPatta: item?.OwnerPatta || "",
            PlotArea: !item?.PlotArea || item.PlotArea === 0 ? "No" : "Yes",
          })
        );
        break;

      case "option5":
        result = await PropertyMast.findAll({
          where: {
            NewWardNo: { [Op.in]: intWardNo },
            CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
            [Op.or]: [{ MobileNo: null }, { MobileNo: "" }],
          },
          attributes: [
            "OwnerID",
            "NewZoneNo",
            "NewWardNo",
            "NewPropertyNo",
            "NewPartitionNo",
            "BuildingOrShopNameMarathi",
            "MobileNo",
          ],
          include: [
            {
              model: CombinedOwnerName,
              attributes: ["MarathiOwnerName", "MarathiRenterName"],
              required: true,
            },
            { model: JoinOwnerDetails, as: "joinOwnerDetails", required: true },
          ],
          order: [
            [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
            [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
            [
              Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"),
              "ASC",
            ],
          ],
        });

        result = result.map((item) =>
          mapResult(item, {
            MobileNo: item?.MobileNo ? "Yes" : "No",
          })
        );
        break;

      default:
        return res.status(400).json({ message: "Invalid option selected" });
    }

    if (result && result.length > 0) {
      console.log("missing floor formattedData", result);
      return res.json(result);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for the selected option" });
    }
  } catch (err) {
    console.error("Error fetching missing data:", err.message);
    return res
      .status(500)
      .json({ message: "Server error while fetching missing data" });
  }
};

export const getMissingPropertyNo = async (req, res) => {
  const { selectedOption, wardNo } = req.body;

  // Validate input
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((w) => parseInt(w));
  const finalMissing = [];

  try {
    for (const singleWard of intWardNo) {
      // STEP 1: Find min and max property numbers for this ward
      const range = await PropertyMast.findOne({
        attributes: [
          [
            Sequelize.fn(
              "MIN",
              Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED")
            ),
            "minProp",
          ],
          [
            Sequelize.fn(
              "MAX",
              Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED")
            ),
            "maxProp",
          ],
        ],
        where: { NewWardNo: singleWard },
        raw: true,
      });

      const start = Number(range.minProp || -1);
      const end = Number(range.maxProp || -1);
      if (start === -1 || end === -1) continue;

      // STEP 2: Fetch actual property + partitions using numeric comparison
      const actualData = await PropertyMast.findAll({
        attributes: ["NewPropertyNo", "NewWardNo", "NewPartitionNo"],
        where: {
          NewWardNo: singleWard,
          [Op.and]: Sequelize.literal(
            `CAST(NewPropertyNo AS UNSIGNED) BETWEEN ${start} AND ${end}`
          ),
        },
        raw: true,
        order: [
          [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        ],
      });

      // Create a Set for quick lookup of actual entries
      const actualSet = new Set(
        actualData.map(
          (row) => `${row.NewPropertyNo}|${row.NewPartitionNo || ""}`
        )
      );

      // STEP 3: Build expected full range including partitions
      const expectedRows = [];
      for (let i = start; i <= end; i++) {
        expectedRows.push({
          NewPropertyNo: String(i),
          NewWardNo: singleWard,
          NewPartitionNo: "",
        });
      }

      for (const row of actualData) {
        if (row.NewPartitionNo) {
          expectedRows.push({
            NewPropertyNo: row.NewPropertyNo,
            NewWardNo: row.NewWardNo,
            NewPartitionNo: row.NewPartitionNo,
          });
        }
      }

      // STEP 4: Remove duplicates
      const distinctMap = new Map();
      for (const row of expectedRows) {
        const key = `${row.NewPropertyNo}|${row.NewPartitionNo}`;
        distinctMap.set(key, row);
      }
      const distinctList = Array.from(distinctMap.values());

      // STEP 5: Find missing entries
      for (const row of distinctList) {
        const key = `${row.NewPropertyNo}|${row.NewPartitionNo}`;
        if (!actualSet.has(key)) {
          finalMissing.push({
            NewWardNo: row.NewWardNo,
            NewPropertyNo: row.NewPropertyNo,
            NewPartitionNo: row?.NewPartitionNo,
            Missing: "YES",
          });
        }
      }
    }

    if (finalMissing.length > 0) {
      return res.json(finalMissing);
    } else {
      return res.status(404).json({ message: "No missing properties found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error while fetching missing property data",
    });
  }
};

export const getToiletData = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log("Selected Option:", selectedOption, "Ward No:", wardNo);

  // Validate input
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    let result = [];
    let formattedData = [];

    switch (selectedOption) {
      // =============== OPTION 1 (Toilet Available + Open Plot) ===============
      case "option1":
        result = await PropertyMast.findAll({
          where: {
            NewWardNo: { [Op.in]: intWardNo },
            OpenPlot: {
              [Op.eq]: 1,
            },
            // At least one toilet present
            [Op.or]: [
              { NewToiletNo: { [Op.gt]: 0 } },
              { commToiletNo: { [Op.gt]: 0 } },
            ],
          },

          attributes: [
            "OwnerID",
            "NewZoneNo",
            "NewWardNo",
            "NewPropertyNo",
            "NewPartitionNo",
            "BuildingOrShopNameMarathi",
            "OwnerPatta",
            "NewToiletNo",
            "commToiletNo",
          ],

          include: [
            {
              model: CombinedOwnerName,
              attributes: ["MarathiOwnerName", "MarathiRenterName"],
            },
            {
              model: OldPropertyMast,
              attributes: ["OldWardNo", "OldPropertyNo", "OldPartitionNo"],
            },
            {
              model: PropertyTypeMaster,
              as: "propertyTypeMaster",
              attributes: ["PropertyDescription"],
              required: true,
            },
          ],

          order: [
            [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
            [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
            [
              Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"),
              "ASC",
            ],
          ],
        });
        break;
      // =============== OPTION 2 (No Toilets) ===============
      case "option2":
        result = await PropertyMast.findAll({
          where: {
            NewWardNo: { [Op.in]: intWardNo },

            // Both toilets missing
            NewToiletNo: {
              [Op.or]: [{ [Op.eq]: 0 }, { [Op.is]: null }, { [Op.eq]: " " }],
            },
            commToiletNo: {
              [Op.or]: [{ [Op.eq]: 0 }, { [Op.is]: null }, { [Op.eq]: " " }],
            },
          },

          attributes: [
            "OwnerID",
            "NewZoneNo",
            "NewWardNo",
            "NewPropertyNo",
            "NewPartitionNo",
            "BuildingOrShopNameMarathi",
            "OwnerPatta",
            "NewToiletNo",
            "commToiletNo",
          ],

          include: [
            {
              model: CombinedOwnerName,
              attributes: ["MarathiOwnerName", "MarathiRenterName"],
            },
            {
              model: OldPropertyMast,
              attributes: ["OldWardNo", "OldPropertyNo", "OldPartitionNo"],
            },
            {
              model: PropertyTypeMaster,
              as: "propertyTypeMaster",
              attributes: ["PropertyDescription"],
              required: true,
            },
            {
              model: PropertyDetailsNew,
              as: "propertyDetailsNew",
              where: {
                TypeOFUse: {
                  [Op.or]: [{ [Op.eq]: "V" }, { [Op.like]: "%W%" }],
                },
              },
              attributes: ["TypeOFUse"],
              required: true,
            },
          ],

          order: [
            [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
            [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
            [
              Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"),
              "ASC",
            ],
          ],
        });
        break;

      default:
        return res.status(400).json({ message: "Invalid option selected" });
    }
    const oldDetails = result.map((item) => item.dataValues);
    console.log("toilet data", oldDetails);
    // ---------- FORMAT FINAL OUTPUT ----------
    formattedData = result.map((p) => {
      const NewtoiletAvailable =
        p?.NewToiletNo && p?.NewToiletNo > 0 ? "Yes" : "No";
      const commToiletAvailable =
        p?.commToiletNo && p?.commToiletNo > 0 ? "Yes" : "No";

      return {
        OwnerID: p?.OwnerID || "",
        NewZoneNo: p?.NewZoneNo || "",
        NewWardNo: p?.NewWardNo || "",
        NewPropertyNo: p?.NewPropertyNo || "",
        NewPartitionNo: p?.NewPartitionNo || "",

        OldWardNo: p?.oldpropertymast?.OldWardNo || "",
        OldPropertyNo: p?.oldpropertymast?.OldPropertyNo || "",
        OldPartitionNo: p?.oldpropertymast?.OldPartitionNo || "",

        MarathiOwnerName: p?.combinedownerrenternames
          ? p.combinedownerrenternames
              .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
              .join(", ")
          : "",
        MarathiRenterName: p?.combinedownerrenternames
          ? p.combinedownerrenternames
              .flatMap((c) => c.dataValues?.MarathiRenterName || [])
              .join(", ")
          : "",

        BuildingOrShopNameMarathi: p?.BuildingOrShopNameMarathi || "",
        PropertyDescription: p?.propertyTypeMaster?.PropertyDescription || "",
        OwnerPatta: p?.OwnerPatta || "",
        NewtoiletAvailable: NewtoiletAvailable,
        commToiletAvailable: commToiletAvailable,
      };
    });

    if (formattedData.length > 0) {
      return res.json(formattedData);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for the selected option" });
    }
  } catch (error) {
    console.log("getToiletData", error.message);
    return res.status(500).json({
      message: "Server error while fetching toilet data",
    });
  }
};

//Property is non taxtable but total tax is greater than zero
export const getNonTaxableData = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log("Selected Option:", selectedOption, "Ward No:", wardNo);

  // Validate input
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    // Step 1: Get latest FinanceYear
    const latestFinanceYear = await TransMast.max("FinanceYear");

    // Step 2: Fetch PropertyMast with all joins
    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        [Op.or]: [
          { NewZoneNo: "Z" },
          Sequelize.literal(`propertyTypeMaster.Type IN ('N','T','V')`),
        ],
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: false,
        },
        {
          model: OldPropertyMast,
          attributes: ["OldRV", "OldPropertyTax", "OldTotalTax"],
          required: false,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: true,
          //where: { Type: { [Op.in]: ["N", "T", "V"] } }, // filter by type
        },
        {
          model: TransMast,
          as: "transMast",
          attributes: [
            "RateableValue",
            "PropertyTax",
            "TaxTotal",
            "FinanceYear",
          ],
          required: true,
          where: {
            FinanceYear: latestFinanceYear,
            TaxTotal: { [Op.gt]: 0 },
          },
        },
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });
    const ownerDetails = result.map((m) => m.dataValues);
    console.log("owner details", ownerDetails);
    // Step 3: Format Response
    const formattedData = result.map((item) => ({
      OwnerID: item?.OwnerID ?? "",
      NewZoneNo: item?.NewZoneNo ?? "",
      NewWardNo: item?.NewWardNo ?? "",
      NewPropertyNo: item?.NewPropertyNo ?? "",
      NewPartitionNo: item?.NewPartitionNo ?? "",
      MarathiOwnerName: item?.combinedownerrenternames
        ? item.combinedownerrenternames
            .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
            .join(", ")
        : "",
      MarathiRenterName: item?.combinedownerrenternames
        ? item.combinedownerrenternames
            .flatMap((c) => c.dataValues?.MarathiRenterName || [])
            .join(", ")
        : "",
      OldRv: item?.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item?.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item?.oldpropertymast?.OldTotalTax ?? "",
      PropertyDescription: item?.propertyTypeMaster?.PropertyDescription || "",
      RateableValue: item?.transMast?.RateableValue ?? "",
      PropertyTax: item?.transMast?.PropertyTax ?? "",
      TaxTotal: item?.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res
        .status(404)
        .json({ message: "No data found while  fetching non-taxable data" });
    }
  } catch (error) {
    console.error("Error fetching non-taxable data", error.message);
    return res.status(500).json({
      message: "Server error while fetching non-taxable data",
    });
  }
};

//Property is taxtable but total tax is zero
export const getTaxableData = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log("Selected Option:", selectedOption, "Ward No:", wardNo);

  // Validate input
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    // Step 1: Get latest FinanceYear
    const latestFinanceYear = await TransMast.max("FinanceYear");

    // Step 2: Fetch PropertyMast with all joins
    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        // [Op.or]: [
        //   { NewZoneNo: "Z" },
        //   Sequelize.literal(`propertyTypeMaster.Type IN ('N','T','V')`),
        // ],
        CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
        NewZoneNo: { [Op.ne]: "Z" },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: false,
        },
        {
          model: OldPropertyMast,
          attributes: ["OldRV", "OldPropertyTax", "OldTotalTax"],
          required: false,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: true,
          where: { Type: { [Op.notIn]: ["N", "T", "V"] } }, // filter by type
        },
        {
          model: TransMast,
          as: "transMast",
          attributes: [
            "RateableValue",
            "PropertyTax",
            "TaxTotal",
            "FinanceYear",
          ],
          required: true,
          where: {
            FinanceYear: latestFinanceYear,
            TaxTotal: { [Op.eq]: 0 },
          },
        },
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    // Step 3: Format Response
    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      MarathiOwnerName: item?.combinedownerrenternames
        ? item.combinedownerrenternames
            .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
            .join(", ")
        : "",
      MarathiRenterName: item?.combinedownerrenternames
        ? item.combinedownerrenternames
            .flatMap((c) => c.dataValues?.MarathiRenterName || [])
            .join(", ")
        : "",
      OldRv: item?.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item?.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item?.oldpropertymast?.OldTotalTax ?? "",
      PropertyDescription: item.propertyTypeMaster?.PropertyDescription || "",
      RateableValue: item.transMast?.RateableValue ?? "",
      PropertyTax: item.transMast?.PropertyTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res
        .status(404)
        .json({ message: "No data found while  fetching taxable data" });
    }
  } catch (error) {
    console.error("Error fetching taxable data:", error.message);
    return res.status(500).json({
      message: "Server error while fetching non-taxable data",
    });
  }
};
//Construction Type like 'AR','BR','CR'...etc but Calculated Rent is zero.
export const getConstructionRent = async (req, res) => {
  try {
    const { wardNo, constructionRent } = req.body;
    console.log("get Construction Rent 0", req.body);

    // Validate ward numbers
    if (!wardNo || !Array.isArray(wardNo) || wardNo.length === 0) {
      return res
        .status(400)
        .json({ message: "Ward number(s) must be provided." });
    }

    const intWardNo = wardNo.map((item) => parseInt(item.trim(), 10));

    const calcRent =
      constructionRent?.calculatedRent === true ||
      constructionRent?.calculatedRent === "true";
    const nonCalcRent =
      constructionRent?.nonCalculatedRent === true ||
      constructionRent?.nonCalculatedRent === "true";

    if (!calcRent && !nonCalcRent) {
      return res.status(400).json({ message: "Please select rent type." });
    }

    // Build having condition
    let havingCondition = "";
    if (calcRent && nonCalcRent) {
      havingCondition =
        "SUM(COALESCE(Rent,0)) = 0 AND SUM(COALESCE(NonCalculateRent,0)) = 0";
    } else if (calcRent) {
      havingCondition = "SUM(COALESCE(Rent,0)) = 0";
    } else if (nonCalcRent) {
      havingCondition = "SUM(COALESCE(NonCalculateRent,0)) = 0";
    }

    // Fetch OwnerIDs with totalRent and totalNonCalcRent
    const rentConditions = await PropertyDetailsNew.findAll({
      attributes: [
        "OwnerID",
        [Sequelize.fn("SUM", Sequelize.col("Rent")), "totalRent"],
        [
          Sequelize.fn("SUM", Sequelize.col("NonCalculateRent")),
          "totalNonCalcRent",
        ],
      ],
      where: {
        TypeOFUse: { [Op.ne]: "V", [Op.notLike]: "W%" },
      },
      include: [
        {
          model: TypeofUseMaster,
          as: "typeofUseMaster",
          attributes: [],
          where: { Type: "N" },
          required: true,
        },
      ],
      group: ["OwnerID"],
      having: Sequelize.literal(havingCondition),
    });

    if (!rentConditions || rentConditions.length === 0) {
      return res.status(404).json({ message: "No records found." });
    }

    const ownerIDs = rentConditions.map((o) => o.OwnerID);

    // Create a map of OwnerID → totalRent/totalNonCalcRent
    const rentMap = {};
    rentConditions.forEach((r) => {
      rentMap[r.OwnerID] = {
        totalRent: r.dataValues.totalRent ?? 0,
        totalNonCalcRent: r.dataValues.totalNonCalcRent ?? 0,
      };
    });

    // Fetch PropertyMast records
    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        OwnerID: { [Op.in]: ownerIDs },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["OwnerID", "MarathiOwnerName", "MarathiRenterName"],
          required: false,
        },
        {
          model: OldPropertyMast,
          attributes: ["OldRV", "OldPropertyTax", "OldTotalTax"],
          required: false,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: false,
        },
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    // Format response with totalRent and totalNonCalcRent
    const formattedData = result.map((item) => {
      const combinedNames =
        item.combinedownerrenternames?.map((c) => c.dataValues) || [];

      const MarathiOwnerName = combinedNames
        .map((c) => c.MarathiOwnerName?.trim())
        .filter(Boolean)
        .join(", ");

      const MarathiRenterName = combinedNames
        .map((c) => c.MarathiRenterName?.trim())
        .filter(Boolean)
        .join(", ");

      const rentInfo = rentMap[item.OwnerID] || {};

      return {
        OwnerID: item.OwnerID ?? "",
        NewZoneNo: item.NewZoneNo ?? "",
        NewWardNo: item.NewWardNo ?? "",
        NewPropertyNo: item.NewPropertyNo ?? "",
        NewPartitionNo: item.NewPartitionNo ?? "",
        MarathiOwnerName,
        MarathiRenterName,
        OldRv: item?.oldpropertymast?.OldRV ?? "",
        OldPropertyTax: item?.oldpropertymast?.OldPropertyTax ?? "",
        OldTotalTax: item?.oldpropertymast?.OldTotalTax ?? "",
        PropertyDescription: item.propertyTypeMaster?.PropertyDescription || "",
        totalRent: rentInfo.totalRent ?? 0,
        totalNonCalcRent: rentInfo.totalNonCalcRent ?? 0,
      };
    });

    return res
      .status(formattedData.length > 0 ? 200 : 404)
      .json(
        formattedData.length > 0
          ? formattedData
          : { message: "No data found while fetching construction rent" }
      );
  } catch (error) {
    console.error("Error fetching construction rent:", error);
    return res.status(500).json({
      message: "An error occurred while fetching construction rent.",
    });
  }
};

//Properties having zero carpet area
export const getZeroCarpetAreaProps = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log("getZeroCarpetAreaProps", req.body);

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
      },

      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
        },
        {
          model: OldPropertyMast,
          attributes: ["OldWardNo", "OldPropertyNo", "OldPartitionNo"],
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
        },
        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          where: {
            CarpetAreaSqFeet: { [Op.eq]: 0 },
          },
          attributes: ["CarpetAreaSqFeet"],
          required: true,
        },
      ],

      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    // Format Response
    const formattedData = result.map((item) => {
      const combinedNames =
        item.combinedownerrenternames?.map((c) => c.dataValues) || [];

      const MarathiOwnerName = combinedNames
        .map((c) => c.MarathiOwnerName?.trim())
        .filter(Boolean)
        .join(", ");

      const MarathiRenterName = combinedNames
        .map((c) => c.MarathiRenterName?.trim())
        .filter(Boolean)
        .join(", ");

      return {
        OwnerID: item.OwnerID ?? "",
        NewZoneNo: item.NewZoneNo ?? "",
        NewWardNo: item.NewWardNo ?? "",
        NewPropertyNo: item.NewPropertyNo ?? "",
        NewPartitionNo: item.NewPartitionNo ?? "",

        OldWardNo: item?.oldpropertymast?.OldWardNo ?? "",
        OldPropertyNo: item?.oldpropertymast?.OldPropertyNo ?? "",
        OldPartitionNo: item?.oldpropertymast?.OldPartitionNo ?? "",

        MarathiOwnerName,
        MarathiRenterName,

        BuildingOrShopNameMarathi: item.BuildingOrShopNameMarathi || "",
        PropertyDescription: item.propertyTypeMaster?.PropertyDescription || "",
        OwnerPatta: item.OwnerPatta || "",

        // If CarpetAreaSqFeet == 0 → Yes, otherwise No
        CarpetAreaSqFeet:
          item.propertyDetailsNew?.CarpetAreaSqFeet ,
      };
    });

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({
        message: "No data found while fetching zero CarpetArea properties",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server error while fetching zero CarpetArea properties",
    });
  }
};
//Duplicate Property/Floor List
export const getDupPropertyFloor = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log("Selected Option:", selectedOption, "Ward No:", wardNo);

  // Validate input
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    let result;
    let formattedData = [];

    switch (selectedOption) {
      // =============== OPTION 2 (No Toilets) ===============
      case "option1":
        result = await PropertyMast.findAll({
          attributes: [
            "NewWardNo",
            "NewPropertyNo",
            "NewPartitionNo",
            [
              Sequelize.fn("COUNT", Sequelize.col("NewPropertyNo")),
              "DuplicateCount",
            ], // Count of duplicates
          ],
          where: {
            NewWardNo: { [Op.in]: intWardNo }, // intWardNo is an array, e.g., [2]
          },
          group: ["NewWardNo", "NewPropertyNo", "NewPartitionNo"],
          having: Sequelize.literal("COUNT(*) > 1"),
          order: [
            [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
            [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
            [
              Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"),
              "ASC",
            ],
          ],
        });
        formattedData = result.map((item) => ({
          "नवीन प्रभाग क्र": item.NewWardNo,
          "नवीन मालमत्ता क्रं": item.NewPropertyNo,
          "नवीन भाग क्र": item.NewPartitionNo,
          DuplicateCount: item.getDataValue("DuplicateCount"),
        }));
        break;

      // =============== OPTION 1 (Toilet Available + Open Plot) ===============
      case "option2":
        // Step 1: Get duplicate OwnerIDs from PropertyDetailsNew
        const duplicateOwnerIDs = await PropertyDetailsNew.findAll({
          attributes: [
            "OwnerID",
            [Sequelize.fn("COUNT", Sequelize.col("OwnerID")), "count"],
          ],
          where: {
            TypeOFUse: { [Op.ne]: "V" },
          },
          group: [
            "OwnerID",
            "FloorID",
            "ConstructionYear",
            "ConstructionType",
            "TypeOFUse",
            "CarpetAreaSqFeet",
            "CarpetAreaSqMeter",
            "RenterYesNO",
            "Rent",
            "NonCalculateRent",
          ],
          having: Sequelize.where(
            Sequelize.fn("COUNT", Sequelize.col("OwnerID")),
            ">",
            1
          ),
          raw: true,
        });

        console.log("duplicateOwnerIDs", duplicateOwnerIDs);

        // If no duplicates, return early
        if (duplicateOwnerIDs.length === 0) {
          return res.json({
            data: [],
            message: "No duplicates found",
          });
        }

        // Create map of OwnerID → count
        const duplicateCountMap = {};
        duplicateOwnerIDs.forEach((item) => {
          duplicateCountMap[item.OwnerID] = item.count;
        });

        // Extract OwnerID list for step2
        const ownerIDs = duplicateOwnerIDs.map((item) => item.OwnerID);

        // Step 2: Fetch only PropertyMast rows that match:
        result = await PropertyMast.findAll({
          where: {
            OwnerID: { [Op.in]: ownerIDs },
            NewWardNo: { [Op.in]: intWardNo },
          },
          attributes: [
            "OwnerID",
            "NewWardNo",
            "NewPropertyNo",
            "NewPartitionNo",
          ],
          include: [
            {
              model: CombinedOwnerName,
              attributes: ["MarathiOwnerName", "MarathiRenterName"],
            },
          ],
          order: [
            [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
            [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
            [
              Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"),
              "ASC",
            ],
          ],
        });

        // Final formatting
        formattedData = result.map((p) => ({
          OwnerID: p?.OwnerID,
          NewWardNo: p?.NewWardNo,
          NewPropertyNo: p?.NewPropertyNo,
          NewPartitionNo: p?.NewPartitionNo,

          MarathiOwnerName: p?.combinedownerrenternames
            ? p.combinedownerrenternames
                .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
                .join(", ")
            : "",
          MarathiRenterName: p?.combinedownerrenternames
            ? p.combinedownerrenternames
                .flatMap((c) => c.dataValues?.MarathiRenterName || [])
                .join(", ")
            : "",

          DuplicateCount: duplicateCountMap[p?.OwnerID] || 1,
        }));

        break;

      default:
        return res.status(400).json({ message: "Invalid option selected" });
    }

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for the selected option" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server error while fetching toilet data",
    });
  }
};
//Old RV has value but Net tax is Zero
export const getOldRVNoNetTax = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log("Selected Option:", selectedOption, "Ward No:", wardNo);

  // Validate input
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    // Step 1: Get latest FinanceYear
    const latestFinanceYear = await TransMast.max("FinanceYear");

    // Step 2: Fetch PropertyMast with all joins
    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: true,
        },
        {
          model: OldPropertyMast,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          where: {
            OldRv: { [Op.ne]: 0 },
          },
          required: true,
        },
        {
          model: TransMast,
          as: "transMast",
          attributes: [
            "RateableValue",
            "PropertyTax",
            "TaxTotal",
            "FinanceYear",
          ],
          required: true, // must exist
          where: {
            FinanceYear: latestFinanceYear,
            RateableValue: { [Op.eq]: 0 },
          },
        },
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    // Step 3: Format Response
    const formattedData = result.map((item) => ({
      OwnerID: item?.OwnerID ?? "",
      NewZoneNo: item?.NewZoneNo ?? "",
      NewWardNo: item?.NewWardNo ?? "",
      NewPropertyNo: item?.NewPropertyNo ?? "",
      NewPartitionNo: item?.NewPartitionNo ?? "",
      OldWardNo: item?.oldpropertymast?.OldWardNo ?? "",
      OldPropertyNo: item?.oldpropertymast?.OldPropertyNo ?? "",
      OldPartitionNo: item?.oldpropertymast?.OldPartitionNo ?? "",
      MarathiOwnerName: item?.combinedownerrenternames
        ? item.combinedownerrenternames
            .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
            .join(", ")
        : "",
      MarathiRenterName: item?.combinedownerrenternames
        ? item.combinedownerrenternames
            .flatMap((c) => c.dataValues?.MarathiRenterName || [])
            .join(", ")
        : "",
      BuildingOrShopNameMarathi: item?.BuildingOrShopNameMarathi ?? "",
      OldRv: item?.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item?.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item?.oldpropertymast?.OldTotalTax ?? "",
      RateableValue: item?.transMast?.RateableValue ?? "",
      PropertyTax: item?.transMast?.PropertyTax ?? "",
      TaxTotal: item?.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({
        message: "No data found for fetching OldRV having NetTax zero",
      });
    }
  } catch (error) {
    console.error("Error fetching OldRV but NetTax  is Zero:", error.message);
    return res.status(500).json({
      message: "Server error while fetching OldRV but NetTax  is Zero",
    });
  }
};
//Properties with renter and having rent
export const getPropertiesRent = async (req, res) => {
  let transaction;
  try {
    const { wardNo, selectedOption = {} } = req.body;

    // --- validations ---
    if (!wardNo || !Array.isArray(wardNo) || wardNo.length === 0) {
      return res
        .status(400)
        .json({ message: "Ward number(s) must be provided." });
    }

    const wardList = wardNo
      .map((n) => parseInt(n, 10))
      .filter((n) => !isNaN(n));
    if (!wardList.length) {
      return res
        .status(400)
        .json({ message: "No valid ward numbers provided." });
    }

    const calcRent =
      selectedOption.calculatedRent === true ||
      selectedOption.calculatedRent === "true";
    const nonCalcRent =
      selectedOption.nonCalculatedRent === true ||
      selectedOption.nonCalculatedRent === "true";

    if (!calcRent && !nonCalcRent) {
      return res.status(400).json({ message: "Please select rent type." });
    }

    // --- rent filter ---
    let rentWhere = {};
    if (calcRent && nonCalcRent) {
      rentWhere = {
        [Op.or]: [
          { Rent: { [Op.gt]: 0 } },
          { NonCalculateRent: { [Op.gt]: 0 } },
        ],
      };
    } else if (calcRent) {
      rentWhere = { Rent: { [Op.gt]: 0 } };
    } else if (nonCalcRent) {
      rentWhere = { NonCalculateRent: { [Op.gt]: 0 } };
    }

    transaction = await sequelize.transaction();

    // --- fetch properties ---
    const properties = await PropertyMast.findAll({
      where: { NewWardNo: { [Op.in]: wardList } },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: true,
        },
        {
          model: OldPropertyMast,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          required: true,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: true,
        },
        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          attributes: ["Rent", "NonCalculateRent", "RenterYesNO"],
          where: {
            ...rentWhere,
            RenterYesNO: { [Op.eq]: 1 }, // must be true
          },
          required: true,
        },
      ],
      transaction,
    });
    const combinedDetails = properties.map((c) => c.dataValues);
    // Suppose result is your Sequelize array

    // Flatten all combinedownerrenternames and extract MarathiOwnerName
    const allOwnerNames = combinedDetails.flatMap((item) =>
      item.combinedownerrenternames.map((c) => c.dataValues.MarathiOwnerName)
    );

    console.log("All Owner Names:", allOwnerNames);

    if (!properties.length) {
      await transaction.commit();
      return res
        .status(404)
        .json({ message: "No properties found with Renter with Rent." });
    }

    const propertyOwnerIds = properties.map((p) => p.OwnerID);
    const batchSize = 500;

    for (let i = 0; i < propertyOwnerIds.length; i += batchSize) {
      const batch = propertyOwnerIds.slice(i, i + batchSize);
      await sequelize.query(
        `CALL funGetAllNETTaxes(NULL, NULL, NULL, NULL, NULL, :ownerIDs);`,
        { replacements: { ownerIDs: batch.join(",") }, transaction }
      );
    }

    // --- fetch SP results ---
    const spResults = await sequelize.query(
      `SELECT * FROM tmp_funTblNETTaxes WHERE OwnerID IN (:ownerIds) AND RenterYesNO = 1`,
      {
        replacements: { ownerIds: propertyOwnerIds },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      }
    );

    if (!spResults.length) {
      await transaction.commit();
      return res
        .status(404)
        .json({ message: "No properties found with Renter with Rent." });
    }

    // --- aggregate per OwnerID ---
    const aggregated = spResults.reduce((acc, row) => {
      if (!acc[row.OwnerID])
        acc[row.OwnerID] = {
          TotalCarpetArea: 0,
          TotalRentPM: 0,
          TotalRV: 0,
          TotalPropertyTax: 0,
          TotalTax: 0,
        };

      acc[row.OwnerID].TotalCarpetArea += row.CarpetAreaSqFeet || 0;
      acc[row.OwnerID].TotalRentPM += row.RentFromRenterPerMonth || 0;
      acc[row.OwnerID].TotalRV += row.RateableValue || 0;
      acc[row.OwnerID].TotalPropertyTax += row.PropertyTax || 0;
      acc[row.OwnerID].TotalTax +=
        (row.PropertyTax || 0) +
        (row.REducationTax || 0) +
        (row.CEducationTax || 0) +
        (row.REmploymentTax || 0) +
        (row.CEmploymentTax || 0) +
        (row.TreeCess || 0) +
        (row.SpEducationTax || 0) +
        (row.Sanitation || 0) +
        (row.DrainCess || 0) +
        (row.SpWaterCess || 0) +
        (row.RoadCess || 0) +
        (row.FireCess || 0) +
        (row.LightCess || 0) +
        (row.WaterBenefitTax || 0) +
        (row.MajorBuildingTax || 0) +
        (row.SewageDispCess || 0) +
        (row.WaterBill || 0) +
        (row.Tax1 || 0);

      return acc;
    }, {});

    // --- merge results ---
    const finalResult = properties
      .filter((p) => aggregated[p.OwnerID])
      .map((p) => {
        const plain = p.get({ plain: true });
        const agg = aggregated[plain.OwnerID];
        console.log(Object.keys(plain));

        return {
          ...plain,
          TotalCarpetArea: agg.TotalCarpetArea,
          TotalRentPM: agg.TotalRentPM,
          TotalRV: agg.TotalRV,
          TotalPropertyTax: agg.TotalPropertyTax,
          TotalTax: agg.TotalTax,
        };
      });

    // --- format output ---
    const formatted = finalResult.map((p) => ({
      OwnerID: p.OwnerID,
      NewZoneNo: p.NewZoneNo,
      NewWardNo: p.NewWardNo,
      NewPropertyNo: p.NewPropertyNo,
      NewPartitionNo: p.NewPartitionNo,
      OldWardNo: p?.oldpropertymast?.OldWardNo || "",
      OldPropertyNo: p?.oldpropertymast?.OldPropertyNo || "",
      OldPartitionNo: p?.oldpropertymast?.OldPartitionNo || "",
      MarathiOwnerName:
        p.combinedownerrenternames?.map((c) => c.MarathiOwnerName).join(", ") ||
        "",
      MarathiRenterName:
        p.combinedownerrenternames
          ?.map((c) => c.MarathiRenterName)
          .join(", ") || "",
      OldRV: p?.oldpropertymast?.OldRV ?? 0,
      OldPropertyTax: p?.oldpropertymast?.OldPropertyTax ?? 0,
      OldTotalTax: p?.oldpropertymast?.OldTotalTax ?? 0,
      BuildingOrShopName: p.BuildingOrShopName || "",
      PropertyDescription: p.propertyTypeMaster?.PropertyDescription ?? "",
      OwnerPatta: p.OwnerPatta || "",
      TotalCarpetArea: p.TotalCarpetArea ?? 0,
      TotalRentPM: p.TotalRentPM ?? 0,
      TotalRV: p.TotalRV ?? 0,
      TotalPropertyTax: p.TotalPropertyTax ?? 0,
      TotalTax: p.TotalTax ?? 0,
      CalculatedRent: p.propertyDetailsNew?.Rent ?? 0,
      NonCalculateRent: p.propertyDetailsNew?.NonCalculateRent ?? 0,
    }));

    await transaction.commit();
    return res.status(200).json(formatted);
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback();
    console.error("Error fetching properties rent:", error.stack || error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

//Old Tax Greater Old RV List.
export const getOldTaxGreaterThanOldRV = async (req, res) => {
  const { selectedOption, wardNo } = req.body;

  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const latestFinanceYear = await TransMast.max("FinanceYear");

    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: false,
        },
        {
          model: OldPropertyMast,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          where: Sequelize.where(
            Sequelize.literal("IFNULL(OldTotalTax,0)"),
            ">",
            Sequelize.literal("IFNULL(OldRV,0)")
          ),
          required: false,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: false,
        },
        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")),
              "CarpetAreaSqFeet",
            ],
            [Sequelize.fn("SUM", Sequelize.col("Rent")), "Rent"],
          ],
          required: false,
        },
        {
          model: TransMast,
          as: "transMast",
          attributes: [
            "RateableValue",
            "PropertyTax",
            "TaxTotal",
            "FinanceYear",
          ],
          where: { FinanceYear: latestFinanceYear },
        },
      ],
      group: [
        "propertymast.OwnerID",
        "propertymast.NewZoneNo",
        "propertymast.NewWardNo",
        "propertymast.NewPropertyNo",
        "propertymast.NewPartitionNo",
        "propertymast.BuildingOrShopNameMarathi",
        "propertymast.OwnerPatta",

        "combinedownerrenternames.ID", //  <-- ADD THIS
        "combinedownerrenternames.MarathiOwnerName",
        "combinedownerrenternames.MarathiRenterName",

        "oldpropertymast.OwnerID",
        "oldpropertymast.OldWardNo",
        "oldpropertymast.OldPropertyNo",
        "oldpropertymast.OldPartitionNo",
        "oldpropertymast.OldRV",
        "oldpropertymast.OldPropertyTax",
        "oldpropertymast.OldTotalTax",

        "propertyTypeMaster.PropertyTypeID",
        "propertyTypeMaster.PropertyDescription",

        "propertyDetailsNew.PDNId",
        "transmast.TId",
        "transMast.RateableValue",
        "transMast.PropertyTax",
        "transMast.TaxTotal",
        "transMast.FinanceYear",
      ],

      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      OldWardNo: item?.oldpropertymast?.OldWardNo ?? "",
      OldPropertyNo: item?.oldpropertymast?.OldPropertyNo ?? "",
      OldPartitionNo: item?.oldpropertymast?.OldPartitionNo ?? "",
      MarathiOwnerName: item?.combinedownerrenternames
        ? item.combinedownerrenternames
            .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
            .join(", ")
        : "",
      MarathiRenterName: item?.combinedownerrenternames
        ? item.combinedownerrenternames
            .flatMap((c) => c.dataValues?.MarathiRenterName || [])
            .join(", ")
        : "",
      BuildingOrShopNameMarathi: item.BuildingOrShopNameMarathi ?? "",
      PropertyDescription: item.propertyTypeMaster?.PropertyDescription ?? "",
      OwnerPatta: item.OwnerPatta ?? "",
      OldRv: item?.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item?.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item?.oldpropertymast?.OldTotalTax ?? "",
      CarpetAreaSqFeet: item.propertyDetailsNew?.CarpetAreaSqFeet ?? "",
      Rent: item.propertyDetailsNew?.Rent ?? "",
      RateableValue: item.transMast?.RateableValue ?? "",
      PropertyTax: item.transMast?.PropertyTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//Old Property Without Old Tax and Old RV
export const getWithoutTaxRVOldProperties = async (req, res) => {
  const { selectedOption, wardNo } = req.body;

  // Validate input
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    // Step 1: Get latest finance year
    const latestFinanceYear = await AssessmentMaster.max("MaxYear", {
      where: { ActiveStatus: 1 },
    });

    // Step 2: Fetch PropertyMast with joins
    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: true,
        },
        {
          model: OldPropertyMast,
          required: true,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          where: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn(
                  "IFNULL",
                  Sequelize.col("oldpropertymast.OldTotalTax"),
                  0
                ),
                0
              ),
              Sequelize.where(
                Sequelize.fn(
                  "IFNULL",
                  Sequelize.col("oldpropertymast.OldRV"),
                  0
                ),
                0
              ),
              {
                OldPropertyNo: { [Op.notLike]: "%New%" },
              },
            ],
          },
        },
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    // // Step 3: Get OwnerIDs to include based on construction year
    const includedOwners = await PropertyDetailsNew.findAll({
      attributes: ["OwnerID"],
      where: {
        ConstructionYear: { [Op.gte]: latestFinanceYear },
      },
      raw: true,
    });

    const includedOwnerIDs = includedOwners.map((item) => item.OwnerID);

    // Step 4: Filter results to keep only these OwnerIDs
    const finalResult = result.filter((item) =>
      includedOwnerIDs.includes(item.OwnerID)
    );

    // Step 5: Format final data
    const formattedData = finalResult.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      MarathiOwnerName: item?.combinedownerrenternames
        ? item.combinedownerrenternames
            .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
            .join(", ")
        : "",
      MarathiRenterName: item?.combinedownerrenternames
        ? item.combinedownerrenternames
            .flatMap((c) => c.dataValues?.MarathiRenterName || [])
            .join(", ")
        : "",
      OldRV: item?.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item?.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item?.oldpropertymast?.OldTotalTax ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//Properties having Old property no. but its Old tax and old RV is zero
export const getZeroTaxAndRVOldProperties = async (req, res) => {
  const { selectedOption, wardNo } = req.body;

  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const latestFinanceYear = await TransMast.max("FinanceYear");

    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],

      where: {
        NewWardNo: { [Op.in]: intWardNo },
        CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
      },

      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: true,
        },

        {
          model: OldPropertyMast,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          required: true,
          where: {
            OldPropertyNo: {
              [Op.and]: [{ [Op.ne]: "" }, { [Op.ne]: "new" }],
            },
            [Op.and]: [
              {
                [Op.or]: [{ OldRV: 0 }, { OldRV: null }, { OldRV: "" }],
              },
              {
                [Op.or]: [
                  { OldTotalTax: 0 },
                  { OldTotalTax: null },
                  { OldTotalTax: "" },
                ],
              },
            ],
          },
        },

        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: true,
        },

        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")),
              "CarpetAreaSqFeet",
            ],
            [Sequelize.fn("SUM", Sequelize.col("Rent")), "Rent"],
          ],
          required: true,
        },

        {
          model: TransMast,
          as: "transMast",
          attributes: [
            "RateableValue",
            "PropertyTax",
            "TaxTotal",
            "FinanceYear",
          ],
          where: { FinanceYear: latestFinanceYear },
          required: false,
        },
      ],

      group: [
        "propertymast.OwnerID",
        "propertymast.NewZoneNo",
        "propertymast.NewWardNo",
        "propertymast.NewPropertyNo",
        "propertymast.NewPartitionNo",
        "propertymast.BuildingOrShopNameMarathi",
        "propertymast.OwnerPatta",
        "combinedownerrenternames.ID",
        "combinedownerrenternames.MarathiOwnerName",
        "combinedownerrenternames.MarathiRenterName",

        "oldpropertymast.OwnerID",
        "oldpropertymast.OldWardNo",
        "oldpropertymast.OldPropertyNo",
        "oldpropertymast.OldPartitionNo",
        "oldpropertymast.OldRV",
        "oldpropertymast.OldPropertyTax",
        "oldpropertymast.OldTotalTax",

        "propertyTypeMaster.PropertyDescription",
        "propertyDetailsNew.PDNId",
        "transMast.TId",
      ],

      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",

      OldWardNo: item?.oldpropertymast?.OldWardNo ?? "",
      OldPropertyNo: item?.oldpropertymast?.OldPropertyNo ?? "",
      OldPartitionNo: item?.oldpropertymast?.OldPartitionNo ?? "",

      MarathiOwnerName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiOwnerName || "")
          .join(", ") ?? "",

      MarathiRenterName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiRenterName || "")
          .join(", ") ?? "",
      BuildingOrShopNameMarathi: item.BuildingOrShopNameMarathi ?? "",
      PropertyDescription: item.propertyTypeMaster?.PropertyDescription ?? "",
      OwnerPatta: item.OwnerPatta ?? "",
      OldRV: item?.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item?.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item?.oldpropertymast?.OldTotalTax ?? "",

      CarpetAreaSqFeet: item.propertyDetailsNew?.CarpetAreaSqFeet ?? "",
      Rent: item.propertyDetailsNew?.Rent ?? "",

      RateableValue: item.transMast?.RateableValue ?? "",
      PropertyTax: item.transMast?.PropertyTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({
        message:
          "No data found  for Old property no having  oldtax and oldRV is zero",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//Property Description Mismatch.
export const getpropertyDescMismatch = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log(selectedOption, wardNo);
  console.log(req.body);
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));
  try {
    let result = [];

    for (let ward of intWardNo) {
      const [propertyMismatch] = await sequelize.query(
        `CALL prcPropTypeMistmatch(:wardNo);`,
        { replacements: { wardNo: ward } }
      );
      console.log("propertyMismatch", propertyMismatch);
      // Merge the result from this ward into the final array
      if (propertyMismatch) {
        result = result.concat(propertyMismatch);
      }
    }
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for Property Description Mismatch" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error for property description mismatch." });
  }
};

//Property have old Tax but Net tax is Zero
export const getoldTaxNetZero = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log(selectedOption, wardNo);
  console.log(req.body);
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const latestFinanceYear = await TransMast.max("FinanceYear");

    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: false,
        },
        {
          model: OldPropertyMast,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          where: {
            OldTotalTax: { [Op.and]: [{ [Op.ne]: "" }, { [Op.ne]: 0 }] },
          },
          required: true,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: false,
        },
        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")),
              "CarpetAreaSqFeet",
            ],
            [Sequelize.fn("SUM", Sequelize.col("Rent")), "Rent"],
          ],
          required: false,
        },
        {
          model: TransMast,
          as: "transMast",
          attributes: [
            "RateableValue",
            "PropertyTax",
            "TaxTotal",
            "FinanceYear",
          ],
          where: {
            FinanceYear: latestFinanceYear,
            TaxTotal: { [Op.eq]: 0 },
          },
          required: true,
        },
      ],
      group: [
        "propertymast.OwnerID",
        "propertymast.NewZoneNo",
        "propertymast.NewWardNo",
        "propertymast.NewPropertyNo",
        "propertymast.NewPartitionNo",
        "propertymast.BuildingOrShopNameMarathi",
        "propertymast.OwnerPatta",

        "combinedownerrenternames.ID",
        "combinedownerrenternames.MarathiOwnerName",
        "combinedownerrenternames.MarathiRenterName",

        "oldpropertymast.OwnerID",
        "oldpropertymast.OldWardNo",
        "oldpropertymast.OldPropertyNo",
        "oldpropertymast.OldPartitionNo",
        "oldpropertymast.OldRV",
        "oldpropertymast.OldPropertyTax",
        "oldpropertymast.OldTotalTax",

        "propertyTypeMaster.PropertyTypeID",
        "propertyTypeMaster.PropertyDescription",

        "propertyDetailsNew.PDNId",
        "transMast.TId",
        "transMast.RateableValue",
        "transMast.PropertyTax",
        "transMast.TaxTotal",
        "transMast.FinanceYear",
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      MarathiOwnerName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiOwnerName || "")
          .join(", ") ?? "",
      MarathiRenterName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiRenterName || "")
          .join(", ") ?? "",
      BuildingOrShopNameMarathi: item.BuildingOrShopNameMarathi ?? "",
      PropertyDescription: item.propertyTypeMaster?.PropertyDescription ?? "",
      OwnerPatta: item.OwnerPatta ?? "",
      OldRV: item.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item.oldpropertymast?.OldTotalTax ?? "",
      CarpetAreaSqFeet: item.propertyDetailsNew?.CarpetAreaSqFeet ?? "",
      Rent: item.propertyDetailsNew?.Rent ?? "",
      RateableValue: item.transMast?.RateableValue ?? "",
      PropertyTax: item.transMast?.PropertyTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//Emp tax is applied on Residential properties.
export const getEmpTaxResidential = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log(selectedOption, wardNo);
  console.log(req.body);
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const latestFinanceYear = await TransMast.max("FinanceYear");

    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        PropertyTypeID: { [Op.eq]: 12 },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: false,
        },
        {
          model: OldPropertyMast,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          required: false,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: false,
        },
        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")),
              "CarpetAreaSqFeet",
            ],
            [Sequelize.fn("SUM", Sequelize.col("Rent")), "Rent"],
          ],
          required: false,
        },
        {
          model: TransMast,
          as: "transMast",
          attributes: [
            "RateableValue",
            "PropertyTax",
            "TaxTotal",
            "FinanceYear",
            "EmploymentTax",
          ],
          where: {
            FinanceYear: latestFinanceYear,
            EmploymentTax: { [Op.ne]: "" },
          },
          required: true,
        },
      ],
      group: [
        "propertymast.OwnerID",
        "propertymast.NewZoneNo",
        "propertymast.NewWardNo",
        "propertymast.NewPropertyNo",
        "propertymast.NewPartitionNo",
        "propertymast.BuildingOrShopNameMarathi",
        "propertymast.OwnerPatta",

        "combinedownerrenternames.ID",
        "combinedownerrenternames.MarathiOwnerName",
        "combinedownerrenternames.MarathiRenterName",

        "oldpropertymast.OwnerID",
        "oldpropertymast.OldWardNo",
        "oldpropertymast.OldPropertyNo",
        "oldpropertymast.OldPartitionNo",
        "oldpropertymast.OldRV",
        "oldpropertymast.OldPropertyTax",
        "oldpropertymast.OldTotalTax",

        "propertyTypeMaster.PropertyTypeID",
        "propertyTypeMaster.PropertyDescription",

        "propertyDetailsNew.PDNId",
        "transMast.TId",
        "transMast.EmploymentTax",
        "transMast.RateableValue",
        "transMast.PropertyTax",
        "transMast.TaxTotal",
        "transMast.FinanceYear",
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      MarathiOwnerName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiOwnerName || "")
          .join(", ") ?? "",
      MarathiRenterName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiRenterName || "")
          .join(", ") ?? "",
      BuildingOrShopNameMarathi: item.BuildingOrShopNameMarathi ?? "",
      PropertyDescription: item.propertyTypeMaster?.PropertyDescription ?? "",
      OwnerPatta: item.OwnerPatta ?? "",
      OldRV: item.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item.oldpropertymast?.OldTotalTax ?? "",
      CarpetAreaSqFeet: item.propertyDetailsNew?.CarpetAreaSqFeet ?? "",
      Rent: item.propertyDetailsNew?.Rent ?? "",
      RateableValue: item.transMast?.RateableValue ?? "",
      PropertyTax: item.transMast?.PropertyTax ?? "",
      EmploymentTax: item.transMast?.EmploymentTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//Emp tax is not applied on Commercial properties
export const getEmpTaxExemptCommercial = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log(selectedOption, wardNo);
  console.log(req.body);
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const latestFinanceYear = await TransMast.max("FinanceYear");

    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: false,
        },
        {
          model: OldPropertyMast,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          required: false,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          where: {
            Type: { [Op.eq]: "C" },
          },
          required: false,
        },
        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")),
              "CarpetAreaSqFeet",
            ],
            [Sequelize.fn("SUM", Sequelize.col("Rent")), "Rent"],
          ],
          required: false,
        },
        {
          model: TransMast,
          as: "transMast",
          attributes: [
            "RateableValue",
            "PropertyTax",
            "TaxTotal",
            "FinanceYear",
            "EmploymentTax",
          ],
          where: {
            FinanceYear: latestFinanceYear,
            EmploymentTax: { [Op.eq]: 0 },
            RateableValue: Sequelize.literal("IFNULL(RateableValue,0)>0"),
          },
          required: true,
        },
      ],
      group: [
        "propertymast.OwnerID",
        "propertymast.NewZoneNo",
        "propertymast.NewWardNo",
        "propertymast.NewPropertyNo",
        "propertymast.NewPartitionNo",
        "propertymast.BuildingOrShopNameMarathi",
        "propertymast.OwnerPatta",

        "combinedownerrenternames.ID",
        "combinedownerrenternames.MarathiOwnerName",
        "combinedownerrenternames.MarathiRenterName",

        "oldpropertymast.OwnerID",
        "oldpropertymast.OldWardNo",
        "oldpropertymast.OldPropertyNo",
        "oldpropertymast.OldPartitionNo",
        "oldpropertymast.OldRV",
        "oldpropertymast.OldPropertyTax",
        "oldpropertymast.OldTotalTax",

        "propertyTypeMaster.PropertyTypeID",
        "propertyTypeMaster.PropertyDescription",

        "propertyDetailsNew.PDNId",
        "transMast.TId",
        "transMast.EmploymentTax",
        "transMast.RateableValue",
        "transMast.PropertyTax",
        "transMast.TaxTotal",
        "transMast.FinanceYear",
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      OldWardNo: item.oldpropertymast?.OldWardNo ?? "",
      OldPropertyNo: item.oldpropertymast?.OldPropertyNo ?? "",
      OldPartitionNo: item.oldpropertymast?.OldPartitionNo ?? "",
      MarathiOwnerName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiOwnerName || "")
          .join(", ") ?? "",
      MarathiRenterName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiRenterName || "")
          .join(", ") ?? "",
      BuildingOrShopNameMarathi: item.BuildingOrShopNameMarathi ?? "",
      PropertyDescription: item.propertyTypeMaster?.PropertyDescription ?? "",
      OwnerPatta: item.OwnerPatta ?? "",
      OldRV: item.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item.oldpropertymast?.OldTotalTax ?? "",
      CarpetAreaSqFeet: item.propertyDetailsNew?.CarpetAreaSqFeet ?? "",
      Rent: item.propertyDetailsNew?.Rent ?? "",
      RateableValue: item.transMast?.RateableValue ?? "",
      PropertyTax: item.transMast?.PropertyTax ?? "",
      EmploymentTax: item.transMast?.EmploymentTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//Edu tax not applied on Residential properties
export const getEduTaxExemptResidential = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log(selectedOption, wardNo);
  console.log(req.body);
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const latestFinanceYear = await TransMast.max("FinanceYear");

    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        NewZoneNo: { [Op.ne]: "Z" },
      },
      include: [
        {
          model: TransMast,
          as: "transMast",
          attributes: ["TaxTotal", "FinanceYear", "EducationTax"],
          where: {
            FinanceYear: latestFinanceYear,
            EducationTax: { [Op.eq]: 0 },
          },
          required: true,
        },
        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          required: true,
          include: [
            {
              model: ApplyTaxMasterPrime,
              as: "applyTaxMasterPrime",
              where: {
                EducationTax: { [Op.eq]: 1 },
                Type: { [Op.ne]: "C" },
              },
              required: true,
            },
          ],
        },
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      FinanceYear: item.transMast?.FinanceYear ?? "",
      EducationTax: item.transMast?.EducationTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
//Edu tax is not applied on Commercial properties
export const getEduTaxExemptCommercial = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log(selectedOption, wardNo);
  console.log(req.body);
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const latestFinanceYear = await TransMast.max("FinanceYear");

    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        NewZoneNo: { [Op.ne]: "Z" },
      },
      include: [
        {
          model: TransMast,
          as: "transMast",
          attributes: ["TaxTotal", "FinanceYear", "EducationTax"],
          where: {
            FinanceYear: latestFinanceYear,
            EducationTax: { [Op.eq]: 0 },
          },
          required: true,
        },
        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          required: true,
          include: [
            {
              model: ApplyTaxMasterPrime,
              as: "applyTaxMasterPrime",
              where: {
                EducationTax: { [Op.eq]: 1 },
                Type: { [Op.eq]: "C" },
              },
              required: true,
            },
          ],
        },
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      FinanceYear: item.transMast?.FinanceYear ?? "",
      EducationTax: item.transMast?.EducationTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//'Zero Tax Property List':
export const zeroTaxPropertyList = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log(selectedOption, wardNo);
  console.log(req.body);
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const latestFinanceYear = await TransMast.max("FinanceYear");

    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        CombPropRemark: { [Op.notIn]: ["Yes", "yes"] },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: true,
        },
        {
          model: OldPropertyMast,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          required: true,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: true,
        },

        {
          model: TransMast,
          as: "transMast",
          attributes: [
            "RateableValue",
            "PropertyTax",
            "TaxTotal",
            "FinanceYear",
          ],
          where: {
            FinanceYear: latestFinanceYear,
            TaxTotal: { [Op.eq]: 0 },
          },
          required: true,
        },
      ],
      group: [
        "propertymast.OwnerID",
        "propertymast.NewZoneNo",
        "propertymast.NewWardNo",
        "propertymast.NewPropertyNo",
        "propertymast.NewPartitionNo",
        "propertymast.BuildingOrShopNameMarathi",
        "propertymast.OwnerPatta",

        "combinedownerrenternames.ID",
        "combinedownerrenternames.MarathiOwnerName",
        "combinedownerrenternames.MarathiRenterName",

        "oldpropertymast.OwnerID",
        "oldpropertymast.OldWardNo",
        "oldpropertymast.OldPropertyNo",
        "oldpropertymast.OldPartitionNo",
        "oldpropertymast.OldRV",
        "oldpropertymast.OldPropertyTax",
        "oldpropertymast.OldTotalTax",

        "propertyTypeMaster.PropertyTypeID",
        "propertyTypeMaster.PropertyDescription",

        "transMast.TId",
        "transMast.RateableValue",
        "transMast.PropertyTax",
        "transMast.TaxTotal",
        "transMast.FinanceYear",
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      MarathiOwnerName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiOwnerName || "")
          .join(", ") ?? "",
      MarathiRenterName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiRenterName || "")
          .join(", ") ?? "",
      BuildingOrShopNameMarathi: item.BuildingOrShopNameMarathi ?? "",
      PropertyDescription: item.propertyTypeMaster?.PropertyDescription ?? "",
      OwnerPatta: item.OwnerPatta ?? "",
      OldRV: item.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item.oldpropertymast?.OldTotalTax ?? "",
      RateableValue: item.transMast?.RateableValue ?? "",
      PropertyTax: item.transMast?.PropertyTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for Zero Tax Property List" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
//'Holder List':
export const getHolderList = async (req, res) => {
  const { holderInfo, wardNo } = req.body;
  console.log("Holder request body:", req.body);
  if (!holderInfo || !wardNo || !Array.isArray(wardNo) || wardNo.length === 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item?.trim() || 0));

  // Determine plot/building filter
  const plot = holderInfo.Plot === true || holderInfo.Plot === "true";
  const building =
    holderInfo.Building === true || holderInfo.Building === "true";

  let openPlotFilter;
  if (plot && !building) openPlotFilter = 1;
  else if (!plot && building) openPlotFilter = 0;
  // if both true or both false, leave undefined to fetch all

  console.log("openPlotFilter", openPlotFilter);
  const latestFinanceYear = await TransMast.max("FinanceYear");

  const whereConditions = {
    NewWardNo: { [Op.in]: intWardNo },
    ...(openPlotFilter !== undefined && { OpenPlot: openPlotFilter }),
    [Op.or]: [
      { OwnerName: { [Op.like]: "%Holder%" } },
      { OwnerNameMarathi: { [Op.like]: "%धारक%" } },
    ],
  };

  const groupColumns = [
    "propertymast.OwnerID",
    "propertymast.NewZoneNo",
    "propertymast.NewWardNo",
    "propertymast.NewPropertyNo",
    "propertymast.NewPartitionNo",
    "propertymast.BuildingOrShopNameMarathi",
    "propertymast.OwnerPatta",

    "combinedownerrenternames.ID",
    "combinedownerrenternames.MarathiOwnerName",
    "combinedownerrenternames.MarathiRenterName",

    "oldpropertymast.OwnerID",
    "oldpropertymast.OldWardNo",
    "oldpropertymast.OldPropertyNo",
    "oldpropertymast.OldPartitionNo",
    "oldpropertymast.OldRV",
    "oldpropertymast.OldPropertyTax",
    "oldpropertymast.OldTotalTax",

    "propertyTypeMaster.PropertyTypeID",
    "propertyTypeMaster.PropertyDescription",

    "propertyDetailsNew.PDNId",
    "transMast.TId",
    "transMast.EmploymentTax",
    "transMast.RateableValue",
    "transMast.PropertyTax",
    "transMast.TaxTotal",
    "transMast.FinanceYear",
  ];

  try {
    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
        "OpenPlot",
      ],
      where: whereConditions,
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          where: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn("CHAR_LENGTH", Sequelize.col("MarathiOwnerName")),
                { [Op.lt]: 11 }
              ),
              Sequelize.where(
                Sequelize.fn("CHAR_LENGTH", Sequelize.col("MarathiRenterName")),
                { [Op.lt]: 11 }
              ),
            ],
          },
          required: false,
        },
        {
          model: OldPropertyMast,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          required: false,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: false,
        },
        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")),
              "CarpetAreaSqFeet",
            ],
            [Sequelize.fn("SUM", Sequelize.col("Rent")), "Rent"],
          ],
          required: false,
        },
        {
          model: TransMast,
          as: "transMast",
          attributes: ["RateableValue", "PropertyTax", "TaxTotal"],
          where: { FinanceYear: latestFinanceYear },
          required: true,
        },
      ],
      group: groupColumns,
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      OldWardNo: item.oldpropertymast?.OldWardNo ?? "",
      OldPropertyNo: item.oldpropertymast?.OldPropertyNo ?? "",
      OldPartitionNo: item.oldpropertymast?.OldPartitionNo ?? "",
      MarathiOwnerName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiOwnerName || "")
          .join(", ") ?? "",
      MarathiRenterName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiRenterName || "")
          .join(", ") ?? "",
      BuildingOrShopNameMarathi: item.BuildingOrShopNameMarathi ?? "",
      PropertyDescription: item.propertyTypeMaster?.PropertyDescription ?? "",
      OwnerPatta: item.OwnerPatta ?? "",
      CarpetAreaSqFeet: item.propertyDetailsNew?.CarpetAreaSqFeet ?? "",
      Rent: item.propertyDetailsNew?.Rent ?? "",
      OldRV: item.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item.oldpropertymast?.OldTotalTax ?? "",
      RateableValue: item.transMast?.RateableValue ?? "",
      PropertyTax: item.transMast?.PropertyTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for Zero Tax Property List" });
    }
  } catch (err) {
    console.error("Error fetching holder list:", err.message);
    return res
      .status(500)
      .json({ message: "Server error while fetching holder list" });
  }
};
//'Mutation List':
export const getMutationList = async (req, res) => {
  const { selectedOption, wardNo, page = 1, pageSize = 50 } = req.body;

  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const intWardNo = wardNo.map((item) => parseInt(item.trim(), 10));

    // 1. Get all properties in the given wards
    const propertyOwnerIds = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
      ],
      where: { NewWardNo: { [Op.in]: intWardNo } },
      raw: true,
    });

    if (!propertyOwnerIds.length) {
      return res.status(200).json({ data: [], total: 0 });
    }

    // 2. Extract OwnerIDs
    const ownerIds = propertyOwnerIds.map((p) => p.OwnerID);

    // 3. Get distinct OwnerIDs from MutationDetails that actually have mutation records
    const mutationOwners = await MutationDetails.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("OwnerId")), "OwnerId"],
      ],
      where: { OwnerId: { [Op.in]: ownerIds } },
      raw: true,
    });

    const distinctOwnerIds = mutationOwners.map((m) => m.OwnerId);
    if (!distinctOwnerIds.length) {
      return res.status(200).json({ data: [], total: 0 });
    }

    // 4. Filter propertyOwnerIds to only those that exist in MutationDetails
    const filteredOwners = propertyOwnerIds.filter((p) =>
      distinctOwnerIds.includes(p.OwnerID)
    );

    // 5. Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedOwners = filteredOwners.slice(startIndex, endIndex);

    const formattedData = [];
    const batchSize = 10;

    // 6. Process OwnerIDs in batches
    for (let i = 0; i < pagedOwners.length; i += batchSize) {
      const batch = pagedOwners.slice(i, i + batchSize);

      for (const prop of batch) {
        try {
          const mutationDetails = await sequelize.query(
            `CALL prcSelectMutationDetailsForQCList(:ownerID)`,
            {
              replacements: { ownerID: prop.OwnerID },
              type: sequelize.QueryTypes.SELECT,
            }
          );
          console.log("mutationDetails", mutationDetails);
          //   -- 1. Seller Prime Details (isSaler = 1, isPrime = 1, isActive = 1)
          const sellerPrime = mutationDetails?.[0]?.[0] ?? {};
          console.log("sellerPrime", sellerPrime);
          //-- 2. Seller Details (isSaler = 1, isActive = 1)
          const sellerArray = mutationDetails?.[1]
            ? Object.values(mutationDetails[1])
            : [];
          console.log("sellerArray", sellerArray);
          //-- 3. Buyer Details (isSaler = 0, isActive = 1)
          const buyerArray = mutationDetails?.[2]
            ? Object.values(mutationDetails[2])
            : [];
          console.log("buyerArray", buyerArray);

          formattedData.push({
            "झोन क्र": prop.NewZoneNo ?? "-",
            "नवीन प्रभाग क्र": prop.NewWardNo ?? "-",
            "नवीन मालमत्ता क्रं": prop.NewPropertyNo ?? "-",
            "नवीन भाग क्रं": prop.NewPartitionNo ?? "-",
            "फेरफार दिनांक": sellerPrime.SellingDate ?? "-",
            "लिहून देणाऱ्याचे नाव(विकणाऱ्यांचे)":
              sellerArray[0]?.OwnerNameMarathi ?? "-",
            "लिहून घेणाऱ्यांचे नाव(विकत घेणाऱ्यांचे)":
              buyerArray[0]?.OwnerNameMarathi ?? "-",
            रिमार्क: sellerArray[0]?.ReasonForSale ?? "-",
            "आदेश क्रं": sellerPrime.OrderNo ?? "-",
            "आदेश क्रं दिनांक": sellerPrime.OrderTransferDate ?? "-",
          });
        } catch (error) {
          console.error(
            `Error fetching OwnerID ${prop.OwnerID}:`,
            error.message
          );
        }
      }
    }

    return res.status(200).json(
      formattedData
      // total: filteredOwners.length,
      // page,
      // pageSize,
    );
  } catch (error) {
    console.error("Error in getMutationList:", error);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

//'Property chart(Main Prop,Oblique Prop,OP':
export const getPropertiesChart = async (req, res) => {
  const { selectedOption, wardNo } = req.body;

  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const intWardNo = wardNo.map((item) => parseInt(item.trim(), 10));

    // ---- SINGLE QUERY FOR ALL COUNTS ----
    const result = await PropertyMast.findAll({
      attributes: [
        "NewWardNo",

        // total properties
        [Sequelize.fn("COUNT", Sequelize.col("NewPropertyNo")), "propertyCnt"],

        // without partition
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              `CASE WHEN (NewPartitionNo IS NULL OR NewPartitionNo = '') THEN 1 ELSE 0 END`
            )
          ),
          "propertyCntWithoutPart",
        ],

        // with partition
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              `CASE WHEN (NewPartitionNo IS NOT NULL AND NewPartitionNo != '') THEN 1 ELSE 0 END`
            )
          ),
          "propertyCntWithPart",
        ],

        // OpenPlot = 1
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(`CASE WHEN OpenPlot = 1 THEN 1 ELSE 0 END`)
          ),
          "openPlotProperties",
        ],

        // OpenPlot != 1
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(`CASE WHEN OpenPlot != 1 THEN 1 ELSE 0 END`)
          ),
          "NoOpenPlotProperties",
        ],
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
      },
      group: ["NewWardNo"],
      raw: true,
    });

    if (result.length > 0) {
      const formattedData = result.map((item) => {
        return {
          wardNo: item.NewWardNo,
          totalProperties: Number(item.propertyCnt),
          propertiesWithoutPartition: Number(item.propertyCntWithoutPart),
          propertiesWithPartition: Number(item.propertyCntWithPart),
          openPlotProperties: Number(item.openPlotProperties),
          noOpenPlotProperties: Number(item.NoOpenPlotProperties),
        };
      });
      res.status(200).json(formattedData);
    } else
      return res
        .status(404)
        .json({ message: "No data found for Property chart" });
  } catch (err) {
    console.error("Error fetching Property chart:", err.message);
    return res.status(500).json({
      message: "Server error while fetching Property chart",
    });
  }
};

//'Zoning List':
export const getZoningList = async (req, res) => {
  const { selectedOption, wardNo } = req.body;

  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const intWardNo = wardNo.map((item) => parseInt(item.trim(), 10));
    const zoningData = await PropertyMast.findAll({
      attributes: [
        ["NewWardNo", "नवीन प्रभाग क्र"],

        [Sequelize.fn("COUNT", Sequelize.col("NewWardNo")), "एकूण मालमत्ता"],

        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("CASE WHEN NewZoneNo = 'Z' THEN 1 ELSE 0 END")
          ),
          "Z",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("CASE WHEN NewZoneNo = '1' THEN 1 ELSE 0 END")
          ),
          "1",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("CASE WHEN NewZoneNo = '2' THEN 1 ELSE 0 END")
          ),
          "2",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("CASE WHEN NewZoneNo = '3' THEN 1 ELSE 0 END")
          ),
          "3",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("CASE WHEN NewZoneNo = '4' THEN 1 ELSE 0 END")
          ),
          "4",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("CASE WHEN NewZoneNo = '5' THEN 1 ELSE 0 END")
          ),
          "5",
        ],
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
      },
      group: ["NewWardNo"],
      order: [[Sequelize.literal("CAST(NewWardNo AS UNSIGNED)"), "ASC"]],
      raw: true,
    });
    if (zoningData && zoningData.length > 0) return res.json(zoningData);
    else return res.status(404).json({ message: "No data found for zone" });
  } catch (error) {
    console.error("Error fetching zoning list:", err.message);
    return res
      .status(500)
      .json({ message: "Server error while fetching zoning list" });
  }
};
//'Properties with Current Appeal Status':
export const getCurrentAppealStatus = async (req, res) => {
  try {
    const { wardNo } = req.body;

    if (!wardNo || wardNo.length === 0) {
      return res.status(400).json({ message: "Please select ward numbers" });
    }

    // Format ward numbers for SQL IN clause
    const wardsStr = wardNo.map((w) => `'${w}'`).join(",");

    const sql = `
     SELECT
    PM.NewWardNo AS "नवीन प्रभाग क्र",
    PM.NewPropertyNo AS "नवीन मालमत्ता क्र",
    PM.NewPartitionNo AS "नवीन भाग क्र",

     OPM.OldWardNo AS oldWard,
    OPM.OldPropertyNo AS oldProp,
    OPM.OldPartitionNo AS oldPart,

    OwnerRenterNM.OwnerName AS "OwnerName",
    OwnerRenterNM.MarathiOwnerName AS "मालमत्ता धारकाचे नाव",
    OwnerRenterNM.RenterName AS "Renter Name",
    OwnerRenterNM.MarathiRenterName AS "भोगवटदाराचे नाव",

    CASE
        WHEN APM.Appeal = 1 AND APM.Hearing = 1 AND APM.Retaintion = 1 AND APM.CourtResult = 1 THEN 'Remmision'
        WHEN APM.Appeal = 1 AND APM.Hearing = 1 AND APM.Retaintion = 1 AND APM.CourtResult = 0 THEN 'Appeal Committee'
        WHEN APM.Appeal = 1 AND APM.Hearing = 1 AND APM.Retaintion = 0 AND APM.CourtResult = 0 THEN 'Hearing'
        WHEN APM.Appeal = 1 AND APM.Hearing = 0 AND APM.Retaintion = 0 AND APM.CourtResult = 0 THEN 'Retain'
        ELSE 'Net'
    END AS CurrentStatus

FROM propertymast PM
INNER JOIN combinedownerrenternames OwnerRenterNM
    ON PM.OwnerID = OwnerRenterNM.OwnerID
INNER JOIN oldpropertymast OPM
    ON PM.OwnerID = OPM.OwnerID
INNER JOIN appliedpolicymast APM
    ON PM.OwnerID = APM.OwnerID
WHERE PM.NewWardNo IN (${wardsStr})
ORDER BY PM.NewWardNo, PM.NewPropertyNo, PM.NewPartitionNo
    `;

    // Execute the query
    const transactions = await sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//'Properties in Auto Appeal Committee':
export const getAutoAppealCommittee = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log("getAutoAppealCommittee", req.body);

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: true,
        },
        {
          model: OldPropertyMast,
          attributes: ["OldWardNo", "OldPropertyNo", "OldPartitionNo"],
          required: true,
        },
        {
          model: ApplyTaxesMaster,
          as: "applyTaxesMaster",
          attributes: [
            [
              Sequelize.literal(
                "CASE WHEN IFNULL(InAppComm,0)=1 THEN 'In Appeal Committee' END"
              ),
              "Status",
            ],
          ],
          where: Sequelize.literal("IFNULL(InAppComm,0)=1"),
          required: true,
        },
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    // Format Response
    const formattedData = result.map((item) => {
      const combinedNames =
        item.combinedownerrenternames?.map((c) => c.dataValues) || [];

      const MarathiOwnerName = combinedNames
        .map((c) => c.MarathiOwnerName?.trim())
        .filter(Boolean)
        .join(", ");

      const MarathiRenterName = combinedNames
        .map((c) => c.MarathiRenterName?.trim())
        .filter(Boolean)
        .join(", ");

      return {
        OwnerID: item.OwnerID ?? "",
        NewZoneNo: item.NewZoneNo ?? "",
        NewWardNo: item.NewWardNo ?? "",
        NewPropertyNo: item.NewPropertyNo ?? "",
        NewPartitionNo: item.NewPartitionNo ?? "",

        OldWardNo: item?.oldpropertymast?.OldWardNo ?? "",
        OldPropertyNo: item?.oldpropertymast?.OldPropertyNo ?? "",
        OldPartitionNo: item?.oldpropertymast?.OldPartitionNo ?? "",

        MarathiOwnerName,
        MarathiRenterName,
      };
    });

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({
        message: "No data found while fetching Auto Appeal Committee",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server error while fetching Auto Appeal Committee",
    });
  }
};

// 'Properties in Auto Hearing List':
export const getAutoHearingList = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log("getAutoHearingList", req.body);

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: true,
        },
        {
          model: OldPropertyMast,
          attributes: ["OldWardNo", "OldPropertyNo", "OldPartitionNo"],
          required: true,
        },
        {
          model: ApplyTaxesMaster,
          as: "applyTaxesMaster",
          attributes: [
            [
              Sequelize.literal(
                "CASE WHEN IFNULL(InHearing,0)=1 THEN 'In Hearing' END"
              ),
              "Status",
            ],
          ],
          where: Sequelize.literal("IFNULL(InHearing,0)=1"),
          required: true,
        },
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    // Format Response
    const formattedData = result.map((item) => {
      const combinedNames =
        item.combinedownerrenternames?.map((c) => c.dataValues) || [];

      const MarathiOwnerName = combinedNames
        .map((c) => c.MarathiOwnerName?.trim())
        .filter(Boolean)
        .join(", ");

      const MarathiRenterName = combinedNames
        .map((c) => c.MarathiRenterName?.trim())
        .filter(Boolean)
        .join(", ");

      return {
        OwnerID: item.OwnerID ?? "",
        NewZoneNo: item.NewZoneNo ?? "",
        NewWardNo: item.NewWardNo ?? "",
        NewPropertyNo: item.NewPropertyNo ?? "",
        NewPartitionNo: item.NewPartitionNo ?? "",

        OldWardNo: item?.oldpropertymast?.OldWardNo ?? "",
        OldPropertyNo: item?.oldpropertymast?.OldPropertyNo ?? "",
        OldPartitionNo: item?.oldpropertymast?.OldPartitionNo ?? "",

        MarathiOwnerName,
        MarathiRenterName,
        Status: item?.applyTaxesMaster?.dataValues?.Status ?? "",
      };
    });

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res.status(404).json({
        message: "No data found while fetching  Auto Hearing List",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Server error while fetching Auto Hearing List",
    });
  }
};

//'Open Plot Properties':
export const getOpenPlotProperties = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log(selectedOption, wardNo);
  console.log(req.body);
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const latestFinanceYear = await TransMast.max("FinanceYear");

    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "OpenPlotRenterName",
        "PlotArea",
        "OpenPlot",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
        OpenPlot: { [Op.eq]: 1 },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: false,
        },
        {
          model: OldPropertyMast,
          attributes: ["OldWardNo", "OldPropertyNo", "OldPartitionNo"],
          required: false,
        },
        {
          model: TransMast,
          as: "transMast",
          attributes: ["RateableValue", "TaxTotal"],
          where: {
            FinanceYear: latestFinanceYear,
          },
          required: true,
        },
      ],

      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      //   NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      OldWardNo: item.oldpropertymast?.OldWardNo ?? "",
      OldPropertyNo: item.oldpropertymast?.OldPropertyNo ?? "",
      OldPartitionNo: item.oldpropertymast?.OldPartitionNo ?? "",
      MarathiOwnerName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiOwnerName || "")
          .join(", ") ?? "",
      MarathiRenterName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiRenterName || "")
          .join(", ") ?? "",
      OpenPlotRenterName: item.OpenPlotRenterName ?? "",
      PlotArea: item.PlotArea ?? "",
      RateableValue: item.transMast?.RateableValue ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
      OpenPlot: item?.OpenPlot ? "Yes" : "No",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for Open Plot Properties" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};
//'Oblique Properties List':
export const getObliqueProperties = async (req, res) => {
  const { selectedOption, wardNo } = req.body;

  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim(), 10));

  try {
    // Get latest finance year
    const [latestFinanceYearResult] = await sequelize.query(
      `SELECT MAX(FinanceYear) as latestFinanceYear FROM TransMast`
    );
    const latestFinanceYear = latestFinanceYearResult[0].latestFinanceYear;

    // Build MySQL query
    const wardList = intWardNo.join(","); // Convert array to CSV for IN clause
    const query = `
      SELECT 
        pm.OwnerID,
        pm.NewZoneNo,
        pm.NewWardNo,
        pm.NewPropertyNo,
        pm.NewPartitionNo,
        opm.OldWardNo,
        opm.OldPropertyNo,
        opm.OldPartitionNo,
        pm.BuildingOrShopNameMarathi,
        ptm.PropertyDescription,
         pm.OwnerPatta,
         opm.OldRV,
        opm.OldPropertyTax,
        opm.OldTotalTax,
        SUM(pdn.CarpetAreaSqFeet) AS CarpetAreaSqFeet,
        SUM(pdn.Rent) AS Rent,
        tm.RateableValue,
        tm.PropertyTax,
        tm.TaxTotal,
        GROUP_CONCAT(DISTINCT con.MarathiOwnerName SEPARATOR ', ') AS MarathiOwnerName,
        GROUP_CONCAT(DISTINCT con.MarathiRenterName SEPARATOR ', ') AS MarathiRenterName
      FROM propertymast pm
      LEFT JOIN combinedownerrenternames con ON con.OwnerID = pm.OwnerID
      LEFT JOIN oldpropertymast opm 
        ON opm.OwnerID = pm.OwnerID 
        AND opm.OldWardNo = pm.NewWardNo 
        AND opm.OldPropertyNo = pm.NewPropertyNo
      INNER JOIN propertytypemaster ptm 
        ON ptm.PropertyTypeID = pm.PropertyTypeID
      INNER JOIN propertydetailsnew pdn 
        ON pdn.OwnerID = pm.OwnerID
      LEFT JOIN TransMast tm 
        ON tm.OwnerID = pm.OwnerID 
        AND tm.FinanceYear = :latestFinanceYear
      WHERE pm.NewWardNo IN (${wardList})
        AND pm.NewPartitionNo IS NOT NULL
        AND pm.NewPartitionNo != ''
      GROUP BY 
        pm.OwnerID,
        pm.NewZoneNo,
        pm.NewWardNo,
        pm.NewPropertyNo,
        pm.NewPartitionNo,
        pm.BuildingOrShopNameMarathi,
        pm.OwnerPatta,
        opm.OldWardNo,
        opm.OldPropertyNo,
        opm.OldPartitionNo,
        opm.OldRV,
        opm.OldPropertyTax,
        opm.OldTotalTax,
        ptm.PropertyDescription,
        tm.RateableValue,
        tm.PropertyTax,
        tm.TaxTotal
      ORDER BY 
        CAST(pm.NewWardNo AS UNSIGNED) ASC,
        CAST(pm.NewPropertyNo AS UNSIGNED) ASC,
        CAST(pm.NewPartitionNo AS UNSIGNED) ASC;
    `;

    const results = await sequelize.query(query, {
      replacements: { latestFinanceYear },
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for Oblique Properties" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


//'Under Construction Properties':
export const constructionProperties = async (req, res) => {
  const { selectedOption, wardNo } = req.body;
  console.log(selectedOption, wardNo);
  console.log(req.body);
  if (
    !selectedOption ||
    !wardNo ||
    !Array.isArray(wardNo) ||
    wardNo.length === 0
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const intWardNo = wardNo.map((item) => parseInt(item.trim()));

  try {
    const latestFinanceYear = await TransMast.max("FinanceYear");

    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewZoneNo",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "BuildingOrShopNameMarathi",
        "OwnerPatta",
      ],
      where: {
        NewWardNo: { [Op.in]: intWardNo },
      },
      include: [
        {
          model: CombinedOwnerName,
          attributes: ["MarathiOwnerName", "MarathiRenterName"],
          required: false,
        },
        {
          model: OldPropertyMast,
          attributes: [
            "OldWardNo",
            "OldPropertyNo",
            "OldPartitionNo",
            "OldRV",
            "OldPropertyTax",
            "OldTotalTax",
          ],
          required: false,
        },
        {
          model: PropertyTypeMaster,
          as: "propertyTypeMaster",
          attributes: ["PropertyDescription"],
          required: true,
        },
        {
          model: PropertyDetailsNew,
          as: "propertyDetailsNew",
          attributes: [
            [
              Sequelize.fn("SUM", Sequelize.col("CarpetAreaSqFeet")),
              "CarpetAreaSqFeet",
            ],
            [Sequelize.fn("SUM", Sequelize.col("Rent")), "Rent"],
          ],
          where: {
            TypeOFUse: { [Op.in]: ["UC", "UCC"] },
          },
          required: true,
        },
        {
          model: TransMast,
          as: "transMast",
          attributes: ["RateableValue", "PropertyTax", "TaxTotal"],
          where: {
            FinanceYear: latestFinanceYear,
          },
          required: true,
        },
      ],
      group: [
        "propertymast.OwnerID",
        "propertymast.NewZoneNo",
        "propertymast.NewWardNo",
        "propertymast.NewPropertyNo",
        "propertymast.NewPartitionNo",
        "propertymast.BuildingOrShopNameMarathi",
        "propertymast.OwnerPatta",

        "combinedownerrenternames.ID",
        "combinedownerrenternames.MarathiOwnerName",
        "combinedownerrenternames.MarathiRenterName",

        "oldpropertymast.OwnerID",
        "oldpropertymast.OldWardNo",
        "oldpropertymast.OldPropertyNo",
        "oldpropertymast.OldPartitionNo",
        "oldpropertymast.OldRV",
        "oldpropertymast.OldPropertyTax",
        "oldpropertymast.OldTotalTax",

        "propertyTypeMaster.PropertyTypeID",
        "propertyTypeMaster.PropertyDescription",

        "propertyDetailsNew.PDNId",
        "transMast.TId",
        "transMast.RateableValue",
        "transMast.PropertyTax",
        "transMast.TaxTotal",
      ],
      order: [
        [Sequelize.cast(Sequelize.col("NewWardNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPropertyNo"), "UNSIGNED"), "ASC"],
        [Sequelize.cast(Sequelize.col("NewPartitionNo"), "UNSIGNED"), "ASC"],
      ],
    });

    const formattedData = result.map((item) => ({
      OwnerID: item.OwnerID ?? "",
      NewZoneNo: item.NewZoneNo ?? "",
      NewWardNo: item.NewWardNo ?? "",
      NewPropertyNo: item.NewPropertyNo ?? "",
      NewPartitionNo: item.NewPartitionNo ?? "",
      OldWardNo: item.oldpropertymast?.OldWardNo ?? "",
      OldPropertyNo: item.oldpropertymast?.OldPropertyNo ?? "",
      OldPartitionNo: item.oldpropertymast?.OldPartitionNo ?? "",
      MarathiOwnerName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiOwnerName || "")
          .join(", ") ?? "",
      MarathiRenterName:
        item.combinedownerrenternames
          ?.map((c) => c.MarathiRenterName || "")
          .join(", ") ?? "",
      BuildingOrShopNameMarathi: item.BuildingOrShopNameMarathi ?? "",
      PropertyDescription: item.propertyTypeMaster?.PropertyDescription ?? "",
      OwnerPatta: item.OwnerPatta ?? "",
      OldRV: item.oldpropertymast?.OldRV ?? "",
      OldPropertyTax: item.oldpropertymast?.OldPropertyTax ?? "",
      OldTotalTax: item.oldpropertymast?.OldTotalTax ?? "",
      CarpetAreaSqFeet: item.propertyDetailsNew?.CarpetAreaSqFeet ?? "",
      Rent: item.propertyDetailsNew?.Rent ?? "",
      RateableValue: item.transMast?.RateableValue ?? "",
      PropertyTax: item.transMast?.PropertyTax ?? "",
      TaxTotal: item.transMast?.TaxTotal ?? "",
    }));

    if (formattedData.length > 0) {
      return res.status(200).json(formattedData);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for under construction Properties " });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//'TotalTax in Between Given Range':
export const getTotalTaxInRange = async (req, res) => {
  try {
    const { selectedWards, selectedDesc, taxRange } = req.body;
    console.log(selectedWards, selectedDesc, taxRange);

    let result = [];
    const wardNo = selectedWards.join(',')

    const queryResult = await sequelize.query(`SELECT 
    PM.NewZoneNo AS 'झोन क्र',
    PM.NewWardNo AS 'नवीन प्रभाग क्र',
    PM.NewPropertyNo AS 'नवीन मालमत्ता क्र',
    PM.NewPartitionNo AS 'नवीन भाग क्र',
    OwnerRenterNM.MarathiOwnerName AS 'मालमत्ता धारकाचे नाव',
    OwnerRenterNM.MarathiRenterName AS 'भोगवटदाराचे नाव',
    PTM.PropertyDescription AS 'मालमत्तेचे वर्णन',
        OPM.OldRV AS 'जुने करयोग्य मुल्य',
  OPM.OldPropertyTax AS 'जुना मालमत्ता कर',
 OPM.OldTotalTax AS 'जुना एकूण कर',
    SUM(PDN.CarpetAreaSqFeet) AS 'एकूण क्षेत्रफळ',
    SUM(PDN.Rent) AS 'भाडे',
    FT.RateableValue AS 'प्रस्तावित करयोग्य मुल्य',
    FT.PropertyTax AS 'प्रस्तावित मालमत्ता कर',
    FT.TaxTotal AS 'प्रस्तावित एकूण कर'

FROM PropertyMast PM
INNER JOIN TransMast FT 
    ON PM.OwnerID = FT.OwnerID 
    AND FT.FinanceYear = (SELECT MAX(FinanceYear) FROM TransMast)
LEFT JOIN PropertyTypeMaster PTM 
    ON PM.PropertyTypeID = PTM.PropertyTypeID
LEFT JOIN CombinedOwnerRenterNames OwnerRenterNM 
    ON PM.OwnerID = OwnerRenterNM.OwnerID
LEFT JOIN PropertyDetailsNew PDN 
    ON PM.OwnerID = PDN.OwnerID
  LEFT JOIN oldpropertymast OPM 
    ON PM.OwnerID = OPM.OwnerID

WHERE  
    FT.TaxTotal >= ${taxRange.FromTax}
    AND FT.TaxTotal <= ${taxRange.ToTax}
    AND PM.PropertyTypeID IN (${selectedDesc.join(",")})
    AND PM.NewWardNo in (${wardNo})
 GROUP BY 
     PM.NewZoneNo, PM.NewWardNo, PM.NewPropertyNo, PM.NewPartitionNo,
   OPM.OldWardNo, OPM.OldPropertyNo, OPM.OldPartitionNo,
    OwnerRenterNM.MarathiOwnerName, OwnerRenterNM.MarathiRenterName,
  PTM.PropertyDescription,
 OPM.OldRV, OPM.OldPropertyTax, 
    OPM.OldTotalTax, FT.RateableValue, FT.PropertyTax, FT.TaxTotal
 ORDER BY 
    PM.NewZoneNo, PM.NewWardNo, PM.NewPropertyNo, PM.NewPartitionNo;
`);
    result.push(queryResult[0]);


    console.log("result", result.flat());
    res.status(200).json(result.flat());
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
//'New Total Tax is less than old total tax in Given Range(As per old,0 to 1.5,1.5to 3...etc)':
export const getNewTaxLessOldTax = async (req, res) => {
  const { selectedWards, compareValue, xValue } = req.body;
  console.log(selectedWards, compareValue, xValue);
  try {
    let result = [];
    const wardNo = selectedWards.join(",");

    if (compareValue == "Less than old Tax 'X' Times") {
      if (xValue !== "" || xValue !== null) {
        const queryResult = await sequelize.query(`SELECT 
    p.OwnerID,

    -- Old details from OldPropertymast
    o.OldZoneNo          AS 'जुना झोन क्र',
    o.OldWardNo          AS 'जुना प्रभाग क्र',
    o.OldPropertyNo      AS 'जुना मालमत्ता क्र',
    o.OldPartitionNo     AS 'जुना भाग क्र',
   -- o.OldOwnerName       AS 'जुना मालमत्ता धारकाचे नाव',
   -- o.OldAddress         AS 'जुना पत्ता',
   -- IFNULL(o.OldCarpetArea,0) AS 'जुने क्षेत्रफळ चौ.मी.',

    -- New details from PropertyMast
    p.NewZoneNo          AS 'नवीन झोन क्र',
    p.NewWardNo          AS 'नवीन प्रभाग क्र',
    p.NewPropertyNo      AS 'नवीन मालमत्ता क्र',
    p.NewPartitionNo     AS 'नवीन भाग क्र',
    p.OwnerName       AS 'नवीन मालमत्ता धारकाचे नाव',
    p.Address         AS 'नवीन पत्ता',
  --  IFNULL(p.CarpetAreaSqFt,0) AS 'नवे क्षेत्रफळ चौ.मी.',

    -- Owner / Renter Names
    OwnerRenterNM.MarathiOwnerName   AS 'मालमत्ता धारकाचे नाव',
    OwnerRenterNM.MarathiRenterName  AS 'भोगवटदाराचे नाव',

    -- Property Description
    pt.PropertyDescription AS 'मालमत्तेचे वर्णन',

    -- Transaction details
    IFNULL(tm.RateableValue,0) AS 'प्रस्तावित करयोग्य मुल्य',
    IFNULL(tm.PropertyTax,0)   AS 'प्रस्तावित मालमत्ता कर',
    IFNULL(tm.TaxTotal,0)      AS 'प्रस्तावित एकूण कर'

FROM PropertyMast p
LEFT JOIN OldPropertymast o 
       ON p.OwnerID = o.OwnerID
LEFT JOIN TransMast tm 
       ON p.OwnerID = tm.OwnerID
      AND tm.FinanceYear = (SELECT MAX(FinanceYear) FROM TransMast)
INNER JOIN CombinedOwnerRenterNames OwnerRenterNM
       ON p.OwnerID = OwnerRenterNM.OwnerID
INNER JOIN PropertyTypeMaster pt 
       ON pt.PropertyTypeID = p.PropertyTypeID
LEFT JOIN (
       SELECT OwnerID, 
              SUM(IFNULL(CarpetAreaSqMeter,0)) AS NewCarpetArea,
              SUM(IFNULL(Rent,0)) AS Rent,
              SUM(IFNULL(NonCalculateRent,0)) AS NonCalculateRent
       FROM PropertyDetailsNew
       WHERE TypeOFUse <> 'V'
       GROUP BY OwnerID
) pdn ON pdn.OwnerID = p.OwnerID
LEFT JOIN (
       SELECT OwnerID,
              SUM(IFNULL(OldCarpetAreaSqMeter,0)) AS OldCarpetArea
       FROM PropertyDetailsOld
       WHERE OldTypeOFUse <> 'V'
       GROUP BY OwnerID
) opd ON opd.OwnerID = p.OwnerID

WHERE 
    (o.OldRV / tm.RateableValue) < ${xValue}
    AND o.OldRV > 0
    AND tm.RateableValue > 0
    AND p.NewWardNo IN (${wardNo})

ORDER BY 
    CAST(p.NewWardNo AS UNSIGNED),
    CAST(p.NewPropertyNo AS UNSIGNED),
    CAST(p.NewPartitionNo AS UNSIGNED);
`);
        result.push(queryResult[0]);
      }
    } else if (compareValue == "Less Than Old Tax") {
      const queryResult = await sequelize.query(`
SELECT 
    o.OldZoneNo          AS 'जुना झोन क्र',
    o.OldWardNo          AS 'जुना प्रभाग क्र',
    o.OldPropertyNo      AS 'जुना मालमत्ता क्र',
    o.OldPartitionNo     AS 'जुना भाग क्र',

    p.NewZoneNo          AS 'नवीन झोन क्र',
    p.NewWardNo          AS 'नवीन प्रभाग क्र',
    p.NewPropertyNo      AS 'नवीन मालमत्ता क्र',
    p.NewPartitionNo     AS 'नवीन भाग क्र',
    p.OwnerName          AS 'नवीन मालमत्ता धारकाचे नाव',
    p.Address            AS 'नवीन पत्ता',

    OwnerRenterNM.MarathiOwnerName   AS 'मालमत्ता धारकाचे नाव',
    OwnerRenterNM.MarathiRenterName  AS 'भोगवटदाराचे नाव',

    pt.PropertyDescription AS 'मालमत्तेचे वर्णन',

    IFNULL(tm.RateableValue,0) AS 'प्रस्तावित करयोग्य मुल्य',
    IFNULL(tm.PropertyTax,0)   AS 'प्रस्तावित मालमत्ता कर',
    IFNULL(tm.TaxTotal,0)      AS 'प्रस्तावित एकूण कर'

FROM PropertyMast p
LEFT JOIN TransMast tm 
       ON p.OwnerID = tm.OwnerID
INNER JOIN CombinedOwnerRenterNames OwnerRenterNM 
       ON p.OwnerID = OwnerRenterNM.OwnerID

LEFT JOIN (
    SELECT 
        OwnerID,
        SUM(IFNULL(CarpetAreaSqMeter,0)) AS NewCarpet,
        SUM(IFNULL(Rent,0)) AS Rent,
        SUM(IFNULL(NonCalculateRent,0)) AS NonCalculateRent
    FROM PropertyDetailsNew
    WHERE TypeOfUse <> 'R'
    GROUP BY OwnerID
) AS pdn 
       ON pdn.OwnerID = p.OwnerID

LEFT JOIN (
    SELECT 
        OwnerID,
        SUM(IFNULL(OldCarpetAreaSqMeter,0)) AS OldCarpet
    FROM PropertyDetailsOld
    WHERE OldTypeOfUse <> 'V'
    GROUP BY OwnerID
) AS Opdn 
       ON Opdn.OwnerID = p.OwnerID

INNER JOIN PropertyTypeMaster pt 
       ON pt.PropertyTypeID = p.PropertyTypeID

LEFT JOIN OldPropertyMast o 
       ON p.OwnerID = o.OwnerID

WHERE o.OldRV > tm.RateableValue
  AND o.OldRV > 0
  AND tm.RateableValue > 0
  AND p.NewWardNo IN (${wardNo})

GROUP BY 
    o.OldZoneNo, o.OldWardNo, o.OldPropertyNo, o.OldPartitionNo,
    p.NewZoneNo, p.NewWardNo, p.NewPropertyNo, p.NewPartitionNo,
    p.OwnerName, p.Address,
    OwnerRenterNM.MarathiOwnerName, OwnerRenterNM.MarathiRenterName,
    pt.PropertyDescription,
    o.OldRV, o.OldPropertyTax, o.OldTotalTax,
    tm.RateableValue, tm.PropertyTax, tm.TaxTotal

ORDER BY 
    AlphaNum(p.NewWardNo),
    AlphaNum(p.NewPropertyNo),
    AlphaNum(p.NewPartitionNo)

LIMIT 0, 50000;

        `);
      result.push(queryResult[0]);
    } else if (compareValue == "Above 10") {
      const queryResult = await sequelize.query(`SELECT 
    p.NewZoneNo AS 'झोन क्र',
    p.NewWardNo AS 'नवीन प्रभाग क्र',
    p.NewPropertyNo AS 'नवीन मालमत्ता क्र',
    p.NewPartitionNo AS 'नवीन भाग क्र',

    o.OldWardNo AS 'जुना प्रभाग क्र',
    o.OldPropertyNo AS 'जुना मालमत्ता क्र',
    o.OldPartitionNo AS 'जुना भाग क्र',

    OwnerRenterNM.MarathiOwnerName AS 'मालमत्ता धारकाचे नाव',
    OwnerRenterNM.MarathiRenterName AS 'भोगवटदाराचे नाव',

    pt.PropertyDescription AS 'मालमत्तेचे वर्णन',

    IFNULL(Opdn.OldCarpet,0) AS 'जुने क्षेत्रफळ चौ.मी.',
    IFNULL(pdn.NewCarpet,0) AS 'नवे क्षेत्रफळ चौ.मी.',
    IFNULL(pdn.Rent,0) AS 'आकारणी भाडे',
    IFNULL(pdn.NonCalculateRent,0) AS 'विना आकारणी भाडे',

    IFNULL(o.OldRV,0) AS 'जुने करयोग्य मुल्य',
    IFNULL(o.OldPropertyTax,0) AS 'जुना मालमत्ता कर',
    IFNULL(o.OldTotalTax,0) AS 'जुना एकूण कर',

    IFNULL(tm.RateableValue,0) AS 'प्रस्तावित करयोग्य मुल्य',
    IFNULL(tm.PropertyTax,0) AS 'प्रस्तावित मालमत्ता कर',
    IFNULL(tm.TaxTotal,0) AS 'प्रस्तावित एकूण कर'

FROM PropertyMast p
LEFT JOIN TransMast tm 
       ON p.OwnerID = tm.OwnerID

-- OLD DETAILS COME FROM OLDPROPERTYMAST
LEFT JOIN OldPropertyMast o
       ON p.OwnerID = o.OwnerID

INNER JOIN CombinedOwnerRenterNames OwnerRenterNM
       ON p.OwnerID = OwnerRenterNM.OwnerID

LEFT JOIN (
    SELECT OwnerID,
           SUM(IFNULL(CarpetAreaSqMeter,0)) AS NewCarpet,
           SUM(IFNULL(Rent,0)) AS Rent,
           SUM(IFNULL(NonCalculateRent,0)) AS NonCalculateRent
    FROM PropertyDetailsNew
    WHERE TypeOfUse <> 'V'
    GROUP BY OwnerID
) pdn ON pdn.OwnerID = p.OwnerID

LEFT JOIN (
    SELECT OwnerID,
           SUM(IFNULL(OldCarpetAreaSqMeter,0)) AS OldCarpet
    FROM PropertyDetailsOld
    WHERE OldTypeOfUse <> 'V'
    GROUP BY OwnerID
) Opdn ON Opdn.OwnerID = p.OwnerID

INNER JOIN PropertyTypeMaster pt
       ON pt.PropertyTypeID = p.PropertyTypeID

WHERE (o.OldRV / tm.RateableValue) BETWEEN 10 AND 100
  AND o.OldRV > 0
  AND tm.RateableValue > 0
  AND p.NewWardNo IN (${wardNo})

ORDER BY
    AlphaNum(p.NewWardNo),
    AlphaNum(p.NewPropertyNo),
    AlphaNum(p.NewPartitionNo);
`);
      result.push(queryResult[0]);
    } else if (compareValue == "All Comparison") {
      const queryResult = await sequelize.query(`SELECT 
    'जुन्या पेक्षा कमी' AS \`मागणी\`,
    COUNT(A.OwnerID) AS \`एकुण मालमत्ता\`,
    SUM(IFNULL(O.OldRV,0)) AS \`जुने करयोग्य मुल्य\`,
    SUM(IFNULL(O.OldPropertyTax,0)) AS \`जुना मालमत्ता कर\`,
    SUM(IFNULL(O.OldTotalTax,0)) AS \`जुना एकुण कर\`,
    SUM(IFNULL(B.RateableValue,0)) AS \`प्रस्तावित करयोग्य मुल्य\`,
    SUM(IFNULL(B.PropertyTax,0)) AS \`नवीन मालमत्ता कर\`,
    SUM(IFNULL(B.TAXTOTAL,0)) AS \`नवीन एकुण कर\`
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE O.OldRV > B.RateableValue
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo})

UNION ALL

SELECT 
    '1 ते 1.5 पटीत कमी' AS \`मागणी\`,
    COUNT(A.OwnerID),
    SUM(IFNULL(O.OldRV,0)),
    SUM(IFNULL(O.OldPropertyTax,0)),
    SUM(IFNULL(O.OldTotalTax,0)),
    SUM(IFNULL(B.RateableValue,0)),
    SUM(IFNULL(B.PropertyTax,0)),
    SUM(IFNULL(B.TAXTOTAL,0))
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE (O.OldRV / B.RateableValue) BETWEEN 1 AND 1.5
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo})

UNION ALL

SELECT 
    '1.5 ते 3 पटीत कमी' AS \`मागणी\`,
    COUNT(A.OwnerID),
    SUM(IFNULL(O.OldRV,0)),
    SUM(IFNULL(O.OldPropertyTax,0)),
    SUM(IFNULL(O.OldTotalTax,0)),
    SUM(IFNULL(B.RateableValue,0)),
    SUM(IFNULL(B.PropertyTax,0)),
    SUM(IFNULL(B.TAXTOTAL,0))
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE (O.OldRV / B.RateableValue) BETWEEN 1.5 AND 3
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo})

UNION ALL

SELECT 
    '3 ते 5 पटीत कमी' AS \`मागणी\`,
    COUNT(A.OwnerID),
    SUM(IFNULL(O.OldRV,0)),
    SUM(IFNULL(O.OldPropertyTax,0)),
    SUM(IFNULL(O.OldTotalTax,0)),
    SUM(IFNULL(B.RateableValue,0)),
    SUM(IFNULL(B.PropertyTax,0)),
    SUM(IFNULL(B.TAXTOTAL,0))
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE (O.OldRV / B.RateableValue) BETWEEN 3 AND 5
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo})

UNION ALL

SELECT 
    '5 ते 10 पटीत कमी' AS \`मागणी\`,
    COUNT(A.OwnerID),
    SUM(IFNULL(O.OldRV,0)),
    SUM(IFNULL(O.OldPropertyTax,0)),
    SUM(IFNULL(O.OldTotalTax,0)),
    SUM(IFNULL(B.RateableValue,0)),
    SUM(IFNULL(B.PropertyTax,0)),
    SUM(IFNULL(B.TAXTOTAL,0))
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE (O.OldRV / B.RateableValue) BETWEEN 5 AND 10
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo})

UNION ALL

SELECT 
    '10 पेक्षा कमी' AS \`मागणी\`,
    COUNT(A.OwnerID),
    SUM(IFNULL(O.OldRV,0)),
    SUM(IFNULL(O.OldPropertyTax,0)),
    SUM(IFNULL(O.OldTotalTax,0)),
    SUM(IFNULL(B.RateableValue,0)),
    SUM(IFNULL(B.PropertyTax,0)),
    SUM(IFNULL(B.TAXTOTAL,0))
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE (O.OldRV / B.RateableValue) BETWEEN 10 AND 100
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo});

`);
      result.push(queryResult[0]);
    } else {
      const numbers = compareValue.match(/[\d.]+/g).map(Number);
      console.log("Numbers:", numbers[0], numbers[1]);
      const queryResult = await sequelize.query(`
SELECT 
    p.NewZoneNo AS 'झोन क्र',
    p.NewWardNo AS 'नवीन प्रभाग क्र',
    p.NewPropertyNo AS 'नवीन मालमत्ता क्र',
    p.NewPartitionNo AS 'नवीन भाग क्र',

    o.OldWardNo AS 'जुना प्रभाग क्र',
    o.OldPropertyNo AS 'जुना मालमत्ता क्र',
    o.OldPartitionNo AS 'जुना भाग क्र',

    OwnerRenterNM.MarathiOwnerName AS 'मालमत्ता धारकाचे नाव',
    OwnerRenterNM.MarathiRenterName AS 'भोगवटदाराचे नाव',

    pt.PropertyDescription AS 'मालमत्तेचे वर्णन',

    IFNULL(Opdn.OldCarpet,0) AS 'जुने क्षेत्रफळ चौ.मी.',
    IFNULL(pdn.NewCarpet,0) AS 'नवे क्षेत्रफळ चौ.मी.',
    IFNULL(pdn.Rent,0) AS 'आकारणी भाडे',
    IFNULL(pdn.NonCalculateRent,0) AS 'विना आकारणी भाडे',

    o.OldRV AS 'जुने करयोग्य मुल्य',
    o.OldPropertyTax AS 'जुना मालमत्ता कर',
    o.OldTotalTax AS 'जुना एकूण कर',

    tm.RateableValue AS 'प्रस्तावित करयोग्य मुल्य',
    tm.PropertyTax AS 'प्रस्तावित मालमत्ता कर',
    tm.TaxTotal AS 'प्रस्तावित एकूण कर'

FROM PropertyMast p
LEFT JOIN TransMast tm
    ON p.OwnerID = tm.OwnerID
    AND tm.FinanceYear = (SELECT MAX(FinanceYear) FROM TransMast)
INNER JOIN CombinedOwnerRenterNames OwnerRenterNM
    ON p.OwnerID = OwnerRenterNM.OwnerID
LEFT JOIN (
    SELECT OwnerID,
           SUM(IFNULL(CarpetAreaSqMeter,0)) AS NewCarpet,
           SUM(IFNULL(Rent,0)) AS Rent,
           SUM(IFNULL(NonCalculateRent,0)) AS NonCalculateRent
    FROM PropertyDetailsNew
    WHERE TypeOfUse <> 'V'
    GROUP BY OwnerID
) pdn ON pdn.OwnerID = p.OwnerID
LEFT JOIN (
    SELECT OwnerID,
           SUM(IFNULL(OldCarpetAreaSqMeter,0)) AS OldCarpet
    FROM PropertyDetailsOld
    WHERE OldTypeOfUse <> 'V'
    GROUP BY OwnerID
) Opdn ON Opdn.OwnerID = p.OwnerID
INNER JOIN PropertyTypeMaster pt
    ON pt.PropertyTypeID = p.PropertyTypeID
LEFT JOIN OldPropertyMast o
    ON p.OwnerID = o.OwnerID

WHERE (o.OldRV / tm.RateableValue) BETWEEN ${numbers[0]} AND ${numbers[1]}
  AND o.OldRV > 0
  AND tm.RateableValue > 0
  AND p.NewWardNo IN (${wardNo})

ORDER BY 
    p.NewWardNo + 0,
    p.NewPropertyNo + 0,


    p.NewPartitionNo + 0
`);
      result.push(queryResult[0]);
      console.log("result here", queryResult);
    }
    console.log("result", result.flat());

    res.status(200).json(result.flat());
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// 'Property Description Wise List.':
export const getpropertyDescMatch = async (req, res) => {
  const { selectedWards, selectedTypes } = req.body; // arrays
  console.log(
    "Selected Wards:",
    selectedWards,
    "Selected Types:",
    selectedTypes
  );

  try {
    if (!selectedWards?.length || !selectedTypes?.length) {
      return res
        .status(400)
        .json({ error: "Ward(s) and Property Type(s) are required" });
    }

    // Convert arrays to comma-separated strings
    const wardList = selectedWards.map(Number).join(","); // e.g., "1,2,3"
    const typeList = selectedTypes.map(Number).join(","); // e.g., "6,7"

    const queryResult = await sequelize.query(
      `SELECT 
        PM.NewZoneNo AS 'झोन क्र',
        PM.NewWardNo AS WardNo,
        PM.NewPropertyNo AS 'नवीन मालमत्ता क्रं',
        PM.NewPartitionNo AS 'नवीन भाग क्रं',
        OPM.OldWardNo AS 'जुना प्रभाग क्र',
        OPM.OldPropertyNo AS 'जुना मालमत्ता क्र',
        OPM.OldPartitionNo AS 'जुना भाग क्र',
        OwnerRenterNM.MarathiOwnerName AS 'मालमत्ता धारकाचे नाव',
        OwnerRenterNM.MarathiRenterName AS 'भोगवटदाराचे नाव',
       -- PM.MarathiOwnerDukanImarateNav AS 'इमारत  व  दुकान  नाव',
        PTM.PropertyDescription AS 'मालमत्तेचे वर्णन',
       -- PM.MarathiOwnerPatta AS 'पत्ता',
        SUM(PDN.CarpetAreaSqFeet) AS 'एकूण क्षेत्रफळ',
        SUM(PDN.Rent) AS 'भाडे',
        OPM.OldRV AS 'जुने करयोग्य मुल्य',
        OPM.OldPropertyTax AS 'जुना मालमत्ता कर',
        OPM.OldTotalTax AS 'जुना  एकूण  कर',
        FT.RateableValue AS 'प्रस्तावित करयोग्य मुल्य',
        FT.PropertyTax AS 'प्रस्तावित मालमत्ता कर',
        FT.TaxTotal AS 'प्रस्तावित एकूण कर'
      FROM PropertyMast PM
      INNER JOIN TransMast FT ON PM.OwnerID = FT.OwnerID
          AND FT.FinanceYear = (SELECT MAX(FinanceYear) FROM TransMast)
      LEFT JOIN PropertyTypeMaster PTM ON PM.PropertyTypeID = PTM.PropertyTypeID
      LEFT JOIN CombinedOwnerRenterNames OwnerRenterNM ON PM.OwnerID = OwnerRenterNM.OwnerID
      LEFT JOIN PropertyDetailsNew PDN ON PM.OwnerID = PDN.OwnerID
      LEFT JOIN OldPropertyMast OPM ON PM.OwnerID = OPM.OwnerID
      WHERE PM.PropertyTypeID IN (${typeList})
        AND PM.NewWardNo IN (${wardList})
      GROUP BY 
        PM.NewZoneNo, PM.NewWardNo, PM.NewPropertyNo, PM.NewPartitionNo,
        OPM.OldWardNo, OPM.OldPropertyNo, OPM.OldPartitionNo,
        OwnerRenterNM.MarathiOwnerName, OwnerRenterNM.MarathiRenterName,
        -- PM.MarathiOwnerDukanImarateNav,
         PTM.PropertyDescription,
        -- PM.MarathiOwnerPatta,
         OPM.OldRV, OPM.OldPropertyTax, OPM.OldTotalTax,
        FT.RateableValue, FT.PropertyTax, FT.TaxTotal
      ORDER BY 
        CAST(PM.NewZoneNo AS UNSIGNED),
        CAST(PM.NewWardNo AS UNSIGNED),
        CAST(PM.NewPropertyNo AS UNSIGNED),
        CAST(PM.NewPartitionNo AS UNSIGNED);`,
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log("Result count:", queryResult.length);
    res.status(200).json(queryResult);
  } catch (err) {
    console.error("Error in getpropertyDescMatch:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// 'New Total Tax is greater than old total tax in Given Range(as per old,0to 1.5,1.5to 3...etc)':
export const getNewTaxGreaterOldTax = async (req, res) => {
  const { selectedWards, compareValue, xValue } = req.body;
  console.log(selectedWards, compareValue, xValue);
  try {
    let result = [];
    const wardNo = selectedWards.join(",");

    if (compareValue == "Greater than old Tax 'X' Times") {
      if (xValue !== "" || xValue !== null) {
        const queryResult = await sequelize.query(`SELECT 
    p.OwnerID,

    -- Old details from OldPropertymast
    o.OldZoneNo          AS 'जुना झोन क्र',
    o.OldWardNo          AS 'जुना प्रभाग क्र',
    o.OldPropertyNo      AS 'जुना मालमत्ता क्र',
    o.OldPartitionNo     AS 'जुना भाग क्र',
   -- o.OldOwnerName       AS 'जुना मालमत्ता धारकाचे नाव',
   -- o.OldAddress         AS 'जुना पत्ता',
   -- IFNULL(o.OldCarpetArea,0) AS 'जुने क्षेत्रफळ चौ.मी.',

    -- New details from PropertyMast
    p.NewZoneNo          AS 'नवीन झोन क्र',
    p.NewWardNo          AS 'नवीन प्रभाग क्र',
    p.NewPropertyNo      AS 'नवीन मालमत्ता क्र',
    p.NewPartitionNo     AS 'नवीन भाग क्र',
    p.OwnerName       AS 'नवीन मालमत्ता धारकाचे नाव',
    p.Address         AS 'नवीन पत्ता',
  --  IFNULL(p.CarpetAreaSqFt,0) AS 'नवे क्षेत्रफळ चौ.मी.',

    -- Owner / Renter Names
    OwnerRenterNM.MarathiOwnerName   AS 'मालमत्ता धारकाचे नाव',
    OwnerRenterNM.MarathiRenterName  AS 'भोगवटदाराचे नाव',

    -- Property Description
    pt.PropertyDescription AS 'मालमत्तेचे वर्णन',

    -- Transaction details
    IFNULL(tm.RateableValue,0) AS 'प्रस्तावित करयोग्य मुल्य',
    IFNULL(tm.PropertyTax,0)   AS 'प्रस्तावित मालमत्ता कर',
    IFNULL(tm.TaxTotal,0)      AS 'प्रस्तावित एकूण कर'

FROM PropertyMast p
LEFT JOIN OldPropertymast o 
       ON p.OwnerID = o.OwnerID
LEFT JOIN TransMast tm 
       ON p.OwnerID = tm.OwnerID
      AND tm.FinanceYear = (SELECT MAX(FinanceYear) FROM TransMast)
INNER JOIN CombinedOwnerRenterNames OwnerRenterNM
       ON p.OwnerID = OwnerRenterNM.OwnerID
INNER JOIN PropertyTypeMaster pt 
       ON pt.PropertyTypeID = p.PropertyTypeID
LEFT JOIN (
       SELECT OwnerID, 
              SUM(IFNULL(CarpetAreaSqMeter,0)) AS NewCarpetArea,
              SUM(IFNULL(Rent,0)) AS Rent,
              SUM(IFNULL(NonCalculateRent,0)) AS NonCalculateRent
       FROM PropertyDetailsNew
       WHERE TypeOFUse <> 'V'
       GROUP BY OwnerID
) pdn ON pdn.OwnerID = p.OwnerID
LEFT JOIN (
       SELECT OwnerID,
              SUM(IFNULL(OldCarpetAreaSqMeter,0)) AS OldCarpetArea
       FROM PropertyDetailsOld
       WHERE OldTypeOFUse <> 'V'
       GROUP BY OwnerID
) opd ON opd.OwnerID = p.OwnerID

WHERE 
    ( tm.RateableValue / o.OldRV ) > ${xValue}
    AND o.OldRV > 0
  --  AND tm.RateableValue > 0
    AND p.NewWardNo IN (${wardNo})

ORDER BY 
    CAST(p.NewWardNo AS UNSIGNED),
    CAST(p.NewPropertyNo AS UNSIGNED),
    CAST(p.NewPartitionNo AS UNSIGNED);
`);
        result.push(queryResult[0]);
      }
    } else if (compareValue == "Greater Than Old Tax") {
      const queryResult = await sequelize.query(`
SELECT 
    o.OldZoneNo          AS 'जुना झोन क्र',
    o.OldWardNo          AS 'जुना प्रभाग क्र',
    o.OldPropertyNo      AS 'जुना मालमत्ता क्र',
    o.OldPartitionNo     AS 'जुना भाग क्र',

    p.NewZoneNo          AS 'नवीन झोन क्र',
    p.NewWardNo          AS 'नवीन प्रभाग क्र',
    p.NewPropertyNo      AS 'नवीन मालमत्ता क्र',
    p.NewPartitionNo     AS 'नवीन भाग क्र',
    p.OwnerName          AS 'नवीन मालमत्ता धारकाचे नाव',
    p.Address            AS 'नवीन पत्ता',

    OwnerRenterNM.MarathiOwnerName   AS 'मालमत्ता धारकाचे नाव',
    OwnerRenterNM.MarathiRenterName  AS 'भोगवटदाराचे नाव',

    pt.PropertyDescription AS 'मालमत्तेचे वर्णन',

    IFNULL(tm.RateableValue,0) AS 'प्रस्तावित करयोग्य मुल्य',
    IFNULL(tm.PropertyTax,0)   AS 'प्रस्तावित मालमत्ता कर',
    IFNULL(tm.TaxTotal,0)      AS 'प्रस्तावित एकूण कर'

FROM PropertyMast p
LEFT JOIN TransMast tm 
       ON p.OwnerID = tm.OwnerID
INNER JOIN CombinedOwnerRenterNames OwnerRenterNM 
       ON p.OwnerID = OwnerRenterNM.OwnerID

LEFT JOIN (
    SELECT 
        OwnerID,
        SUM(IFNULL(CarpetAreaSqMeter,0)) AS NewCarpet,
        SUM(IFNULL(Rent,0)) AS Rent,
        SUM(IFNULL(NonCalculateRent,0)) AS NonCalculateRent
    FROM PropertyDetailsNew
    WHERE TypeOfUse <> 'R'
    GROUP BY OwnerID
) AS pdn 
       ON pdn.OwnerID = p.OwnerID

LEFT JOIN (
    SELECT 
        OwnerID,
        SUM(IFNULL(OldCarpetAreaSqMeter,0)) AS OldCarpet
    FROM PropertyDetailsOld
    WHERE OldTypeOfUse <> 'V'
    GROUP BY OwnerID
) AS Opdn 
       ON Opdn.OwnerID = p.OwnerID

INNER JOIN PropertyTypeMaster pt 
       ON pt.PropertyTypeID = p.PropertyTypeID

LEFT JOIN OldPropertyMast o 
       ON p.OwnerID = o.OwnerID

WHERE o.OldRV < tm.RateableValue
  AND o.OldRV > 0
  AND tm.RateableValue > 0
  AND p.NewWardNo IN (${wardNo})

GROUP BY 
    o.OldZoneNo, o.OldWardNo, o.OldPropertyNo, o.OldPartitionNo,
    p.NewZoneNo, p.NewWardNo, p.NewPropertyNo, p.NewPartitionNo,
    p.OwnerName, p.Address,
    OwnerRenterNM.MarathiOwnerName, OwnerRenterNM.MarathiRenterName,
    pt.PropertyDescription,
    o.OldRV, o.OldPropertyTax, o.OldTotalTax,
    tm.RateableValue, tm.PropertyTax, tm.TaxTotal

ORDER BY 
    AlphaNum(p.NewWardNo),
    AlphaNum(p.NewPropertyNo),
    AlphaNum(p.NewPartitionNo)

LIMIT 0, 50000;

        `);
      result.push(queryResult[0]);
    } else if (compareValue == "Above 10") {
      const queryResult = await sequelize.query(`SELECT 
    p.NewZoneNo AS 'झोन क्र',
    p.NewWardNo AS 'नवीन प्रभाग क्र',
    p.NewPropertyNo AS 'नवीन मालमत्ता क्र',
    p.NewPartitionNo AS 'नवीन भाग क्र',

    o.OldWardNo AS 'जुना प्रभाग क्र',
    o.OldPropertyNo AS 'जुना मालमत्ता क्र',
    o.OldPartitionNo AS 'जुना भाग क्र',

    OwnerRenterNM.MarathiOwnerName AS 'मालमत्ता धारकाचे नाव',
    OwnerRenterNM.MarathiRenterName AS 'भोगवटदाराचे नाव',

    pt.PropertyDescription AS 'मालमत्तेचे वर्णन',

    IFNULL(Opdn.OldCarpet,0) AS 'जुने क्षेत्रफळ चौ.मी.',
    IFNULL(pdn.NewCarpet,0) AS 'नवे क्षेत्रफळ चौ.मी.',
    IFNULL(pdn.Rent,0) AS 'आकारणी भाडे',
    IFNULL(pdn.NonCalculateRent,0) AS 'विना आकारणी भाडे',

    IFNULL(o.OldRV,0) AS 'जुने करयोग्य मुल्य',
    IFNULL(o.OldPropertyTax,0) AS 'जुना मालमत्ता कर',
    IFNULL(o.OldTotalTax,0) AS 'जुना एकूण कर',

    IFNULL(tm.RateableValue,0) AS 'प्रस्तावित करयोग्य मुल्य',
    IFNULL(tm.PropertyTax,0) AS 'प्रस्तावित मालमत्ता कर',
    IFNULL(tm.TaxTotal,0) AS 'प्रस्तावित एकूण कर'

FROM PropertyMast p
LEFT JOIN TransMast tm 
       ON p.OwnerID = tm.OwnerID

-- OLD DETAILS COME FROM OLDPROPERTYMAST
LEFT JOIN OldPropertyMast o
       ON p.OwnerID = o.OwnerID

INNER JOIN CombinedOwnerRenterNames OwnerRenterNM
       ON p.OwnerID = OwnerRenterNM.OwnerID

LEFT JOIN (
    SELECT OwnerID,
           SUM(IFNULL(CarpetAreaSqMeter,0)) AS NewCarpet,
           SUM(IFNULL(Rent,0)) AS Rent,
           SUM(IFNULL(NonCalculateRent,0)) AS NonCalculateRent
    FROM PropertyDetailsNew
    WHERE TypeOfUse <> 'V'
    GROUP BY OwnerID
) pdn ON pdn.OwnerID = p.OwnerID

LEFT JOIN (
    SELECT OwnerID,
           SUM(IFNULL(OldCarpetAreaSqMeter,0)) AS OldCarpet
    FROM PropertyDetailsOld
    WHERE OldTypeOfUse <> 'V'
    GROUP BY OwnerID
) Opdn ON Opdn.OwnerID = p.OwnerID

INNER JOIN PropertyTypeMaster pt
       ON pt.PropertyTypeID = p.PropertyTypeID

WHERE  (tm.RateableValue / o.OldRV ) BETWEEN 10 AND 100
  AND o.OldRV > 0
  AND tm.RateableValue > 0
  AND p.NewWardNo IN (${wardNo})

ORDER BY
    AlphaNum(p.NewWardNo),
    AlphaNum(p.NewPropertyNo),
    AlphaNum(p.NewPartitionNo);
`);
      result.push(queryResult[0]);
    } else if (compareValue == "All Comparison") {
      const queryResult = await sequelize.query(`SELECT 
    'जुन्या पेक्षा कमी' AS \`मागणी\`,
    COUNT(A.OwnerID) AS \`एकुण मालमत्ता\`,
    SUM(IFNULL(O.OldRV,0)) AS \`जुने करयोग्य मुल्य\`,
    SUM(IFNULL(O.OldPropertyTax,0)) AS \`जुना मालमत्ता कर\`,
    SUM(IFNULL(O.OldTotalTax,0)) AS \`जुना एकुण कर\`,
    SUM(IFNULL(B.RateableValue,0)) AS \`प्रस्तावित करयोग्य मुल्य\`,
    SUM(IFNULL(B.PropertyTax,0)) AS \`नवीन मालमत्ता कर\`,
    SUM(IFNULL(B.TAXTOTAL,0)) AS \`नवीन एकुण कर\`
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE O.OldRV < B.RateableValue
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo})

UNION ALL

SELECT 
    '1 ते 1.5 पटीत कमी' AS \`मागणी\`,
    COUNT(A.OwnerID),
    SUM(IFNULL(O.OldRV,0)),
    SUM(IFNULL(O.OldPropertyTax,0)),
    SUM(IFNULL(O.OldTotalTax,0)),
    SUM(IFNULL(B.RateableValue,0)),
    SUM(IFNULL(B.PropertyTax,0)),
    SUM(IFNULL(B.TAXTOTAL,0))
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE (B.RateableValue / O.OldRV) BETWEEN 1 AND 1.5
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo})

UNION ALL

SELECT 
    '1.5 ते 3 पटीत कमी' AS \`मागणी\`,
    COUNT(A.OwnerID),
    SUM(IFNULL(O.OldRV,0)),
    SUM(IFNULL(O.OldPropertyTax,0)),
    SUM(IFNULL(O.OldTotalTax,0)),
    SUM(IFNULL(B.RateableValue,0)),
    SUM(IFNULL(B.PropertyTax,0)),
    SUM(IFNULL(B.TAXTOTAL,0))
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE (B.RateableValue / O.OldRV) BETWEEN 1.5 AND 3
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo})

UNION ALL

SELECT 
    '3 ते 5 पटीत कमी' AS \`मागणी\`,
    COUNT(A.OwnerID),
    SUM(IFNULL(O.OldRV,0)),
    SUM(IFNULL(O.OldPropertyTax,0)),
    SUM(IFNULL(O.OldTotalTax,0)),
    SUM(IFNULL(B.RateableValue,0)),
    SUM(IFNULL(B.PropertyTax,0)),
    SUM(IFNULL(B.TAXTOTAL,0))
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE (B.RateableValue / O.OldRV) BETWEEN 3 AND 5
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo})

UNION ALL

SELECT 
    '5 ते 10 पटीत कमी' AS \`मागणी\`,
    COUNT(A.OwnerID),
    SUM(IFNULL(O.OldRV,0)),
    SUM(IFNULL(O.OldPropertyTax,0)),
    SUM(IFNULL(O.OldTotalTax,0)),
    SUM(IFNULL(B.RateableValue,0)),
    SUM(IFNULL(B.PropertyTax,0)),
    SUM(IFNULL(B.TAXTOTAL,0))
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE (B.RateableValue / O.OldRV) BETWEEN 5 AND 10
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo})

UNION ALL

SELECT 
    '10 पेक्षा कमी' AS \`मागणी\`,
    COUNT(A.OwnerID),
    SUM(IFNULL(O.OldRV,0)),
    SUM(IFNULL(O.OldPropertyTax,0)),
    SUM(IFNULL(O.OldTotalTax,0)),
    SUM(IFNULL(B.RateableValue,0)),
    SUM(IFNULL(B.PropertyTax,0)),
    SUM(IFNULL(B.TAXTOTAL,0))
FROM PropertyMast A
JOIN TransMast B ON A.OwnerID = B.OwnerID
JOIN OldPropertyMast O ON A.OwnerID = O.OwnerID
WHERE (B.RateableValue / O.OldRV) BETWEEN 10 AND 100
  AND O.OldRV > 0
  AND B.RateableValue > 0
  AND A.NewWardNo IN (${wardNo});

`);
      result.push(queryResult[0]);
    } else {
      const numbers = compareValue.match(/[\d.]+/g).map(Number);
      console.log("Numbers:", numbers[0], numbers[1]);
      const queryResult = await sequelize.query(`
SELECT 
    p.NewZoneNo AS 'झोन क्र',
    p.NewWardNo AS 'नवीन प्रभाग क्र',
    p.NewPropertyNo AS 'नवीन मालमत्ता क्र',
    p.NewPartitionNo AS 'नवीन भाग क्र',

    o.OldWardNo AS 'जुना प्रभाग क्र',
    o.OldPropertyNo AS 'जुना मालमत्ता क्र',
    o.OldPartitionNo AS 'जुना भाग क्र',

    OwnerRenterNM.MarathiOwnerName AS 'मालमत्ता धारकाचे नाव',
    OwnerRenterNM.MarathiRenterName AS 'भोगवटदाराचे नाव',

    pt.PropertyDescription AS 'मालमत्तेचे वर्णन',

    IFNULL(Opdn.OldCarpet,0) AS 'जुने क्षेत्रफळ चौ.मी.',
    IFNULL(pdn.NewCarpet,0) AS 'नवे क्षेत्रफळ चौ.मी.',
    IFNULL(pdn.Rent,0) AS 'आकारणी भाडे',
    IFNULL(pdn.NonCalculateRent,0) AS 'विना आकारणी भाडे',

    o.OldRV AS 'जुने करयोग्य मुल्य',
    o.OldPropertyTax AS 'जुना मालमत्ता कर',
    o.OldTotalTax AS 'जुना एकूण कर',

    tm.RateableValue AS 'प्रस्तावित करयोग्य मुल्य',
    tm.PropertyTax AS 'प्रस्तावित मालमत्ता कर',
    tm.TaxTotal AS 'प्रस्तावित एकूण कर'

FROM PropertyMast p
LEFT JOIN TransMast tm
    ON p.OwnerID = tm.OwnerID
    AND tm.FinanceYear = (SELECT MAX(FinanceYear) FROM TransMast)
INNER JOIN CombinedOwnerRenterNames OwnerRenterNM
    ON p.OwnerID = OwnerRenterNM.OwnerID
LEFT JOIN (
    SELECT OwnerID,
           SUM(IFNULL(CarpetAreaSqMeter,0)) AS NewCarpet,
           SUM(IFNULL(Rent,0)) AS Rent,
           SUM(IFNULL(NonCalculateRent,0)) AS NonCalculateRent
    FROM PropertyDetailsNew
    WHERE TypeOfUse <> 'V'
    GROUP BY OwnerID
) pdn ON pdn.OwnerID = p.OwnerID
LEFT JOIN (
    SELECT OwnerID,
           SUM(IFNULL(OldCarpetAreaSqMeter,0)) AS OldCarpet
    FROM PropertyDetailsOld
    WHERE OldTypeOfUse <> 'V'
    GROUP BY OwnerID
) Opdn ON Opdn.OwnerID = p.OwnerID
INNER JOIN PropertyTypeMaster pt
    ON pt.PropertyTypeID = p.PropertyTypeID
LEFT JOIN OldPropertyMast o
    ON p.OwnerID = o.OwnerID

WHERE (tm.RateableValue / o.OldRV) BETWEEN ${numbers[0]} AND ${numbers[1]}
  AND o.OldRV > 0
  AND tm.RateableValue > 0
  AND p.NewWardNo IN (${wardNo})

ORDER BY 
    p.NewWardNo + 0,
    p.NewPropertyNo + 0,


    p.NewPartitionNo + 0
`);
      result.push(queryResult[0]);
      console.log("result here", queryResult);
    }
    return res.status(200).json(result.flat());
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
//'Data Entry Gap':
export const getDataEntryGap = async (req, res) => {
  const { wardNo } = req.body;
  const wardNumbers = wardNo.join(",");
  console.log("Ward Numbers:", wardNumbers);
  try {
    const result = await sequelize.query(`SELECT
    NewWardNo AS 'नवीन प्रभाग क्र',
    NewPropertyNo AS 'नवीन मालमत्ता क्र',
    NewPartitionNo AS 'नवीन भाग क्र',
    IFNULL(OwnerNameMarathi, '') AS 'मालमत्ता धारकाचे नाव'
FROM PropertyMAST
WHERE 
    OwnerID IN 
    (
        SELECT OwnerID
        FROM PropertyMAST
        WHERE 
            OpenPlot = 0
            AND (CombPropRemark <> 'Yes' OR CombPropRemark IS NULL)
            AND OwnerID IN 
            (
                SELECT pm.OwnerID
                FROM PropertyMAST pm
                LEFT JOIN PropertyDetailsNew pdn ON pm.OwnerID = pdn.OwnerID
                GROUP BY pm.OwnerID
                HAVING SUM(IFNULL(pdn.CarpetAreASqFeet, 0)) <= 1
            )
    )
    AND NewWardNo IN (${wardNumbers})
ORDER BY 
    NewWardNo,
    NewPropertyNo,
    NewPartitionNo;
`);
    return res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Flat system details:

export const getFlatDetails = async (req, res) => {
  const { flatChecks, activePanel } = req.body;
  console.log("Flat Checks:", flatChecks, "Active Panel:", activePanel);
  try {
    if (flatChecks.allBhk) {
      flatChecks.bhk = ["1", "2", "3", "4", "5", "6"].join(",");
    }
    if (activePanel == "oldCarpetAreaMismatch") {
      const result = await sequelize.query(`
   SELECT
    pm.NewWardNo AS Ward,
    pm.NewPropertyNo AS PropertyNo,
    pm.NewPartitionNo AS PartitionNo
FROM PropertyMast pm
WHERE
    pm.NewWardNo = ${flatChecks.wardNo}                    
    AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
    AND pm.FlatSystemRemark = 'Yes'
    AND pm.BHK in (${flatChecks.bhk})                         
    AND pm.OwnerID IN (
        SELECT A.OwnerID
        FROM (
            SELECT
                pdn.OwnerID,
                ROUND(SUM(pdn.OldCarpetAreaSqMeter), 0) AS area
            FROM PropertyDetailsOld pdn
            INNER JOIN PropertyMast pm2
                ON pm2.OwnerID = pdn.OwnerID
               AND pm2.NewWardNo = ${flatChecks.wardNo}     -- <-- same ward here
               AND pm2.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
            GROUP BY pdn.OwnerID
        ) AS A
        WHERE A.OwnerID IN (
            SELECT
                pdn2.OwnerID
            FROM PropertyDetailsOld pdn2
            INNER JOIN PropertyMast pm3
                ON pm3.OwnerID = pdn2.OwnerID
               AND pm3.NewWardNo = ${flatChecks.wardNo}   
               AND pm3.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
            GROUP BY pdn2.OwnerID
        )
    )
ORDER BY
    CAST(pm.NewWardNo AS UNSIGNED),
    CAST(pm.NewPropertyNo AS UNSIGNED),
    CAST(pm.NewPartitionNo AS UNSIGNED);

`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "oldRVMismatch") {
      const result = await sequelize.query(`SELECT 
    pm.NewWardNo       ,
    pm.NewPropertyNo   ,
    pm.NewPartitionNo  ,
    op.OldRV
FROM PropertyMast pm
join oldpropertymast op on op.ownerid = pm.ownerid 
WHERE op.OldRV IN (
     select op2.OLDRV
    from propertymast pm2  
    join oldpropertymast op2 
    on op2.ownerid = pm2.ownerid
    where pm2.FlatSystemRemark = 'Yes'
    and pm2.bhk in (${flatChecks.bhk}) 
    and  pm2.NewWardNo = ${flatChecks.wardNo}
    and  pm2.NewPropertyNo between ${flatChecks.fromProp} and ${flatChecks.toProp}
)
  and pm.FlatSystemRemark = 'Yes'
    and pm.bhk in (${flatChecks.bhk}) 
    and  pm.NewWardNo = ${flatChecks.wardNo}
    and  pm.NewPropertyNo between ${flatChecks.fromProp} AND ${flatChecks.toProp}


`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "oldPropertyTaxMismatch") {
      const result = await sequelize.query(`
        SELECT 
    pm.NewWardNo AS Ward,
    pm.NewPropertyNo AS PropertyNo,
    pm.NewPartitionNo AS PartitionNo,
    opm.OldPropertyTax
FROM PropertyMast pm
INNER JOIN OldPropertyMast opm ON pm.OwnerID = opm.OwnerID
WHERE opm.OldPropertyTax IN (
    SELECT opm2.OldPropertyTax
    FROM PropertyMast pm2
    INNER JOIN OldPropertyMast opm2 ON pm2.OwnerID = opm2.OwnerID
    WHERE 
        pm2.FlatSystemRemark = 'Yes'
         AND pm2.NewWardNo = '${flatChecks.wardNo}'
                AND pm2.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
                AND pm2.BHK in (${flatChecks.bhk})                           -- replace with cmbBHKFlatSystemNew
    GROUP BY opm2.OldPropertyTax
    HAVING COUNT(*) = 1
)
  AND pm.FlatSystemRemark = 'Yes'
   AND pm.NewWardNo = '${flatChecks.wardNo}'
                AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
                AND pm.BHK in (${flatChecks.bhk})
ORDER BY 
    CAST(pm.NewWardNo AS UNSIGNED),
    CAST(pm.NewPropertyNo AS UNSIGNED),
    CAST(pm.NewPartitionNo AS UNSIGNED);
`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "oldTotalTaxMismatch") {
      const result = await sequelize.query(`
          SELECT 
    pm.NewWardNo AS Ward,
    pm.NewPropertyNo AS PropertyNo,
    pm.NewPartitionNo AS PartitionNo,
    opm.OldTotalTax
FROM PropertyMast pm
INNER JOIN OldPropertyMast opm ON pm.OwnerID = opm.OwnerID
WHERE opm.OldTotalTax IN (
    SELECT opm2.OldTotalTax
    FROM PropertyMast pm2
    INNER JOIN OldPropertyMast opm2 ON pm2.OwnerID = opm2.OwnerID
     WHERE 
        pm2.FlatSystemRemark = 'Yes'
         AND pm2.NewWardNo = '${flatChecks.wardNo}'
                AND pm2.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
                AND pm2.BHK in (${flatChecks.bhk})                           -- replace with cmbBHKFlatSystemNew
    GROUP BY opm2.OldTotalTax
    HAVING COUNT(*) = 1
)
  AND pm.FlatSystemRemark = 'Yes'
   AND pm.NewWardNo = '${flatChecks.wardNo}'
                AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
                AND pm.BHK in (${flatChecks.bhk})
ORDER BY 
    CAST(pm.NewWardNo AS UNSIGNED),
    CAST(pm.NewPropertyNo AS UNSIGNED),
    CAST(pm.NewPartitionNo AS UNSIGNED);`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "newCarpetAreaMismatch") {
      const result = await sequelize.query(`SELECT 
    pm.NewWardNo AS Ward,
    pm.NewPropertyNo AS PropertyNo,
    pm.NewPartitionNo AS PartitionNo
FROM PropertyMast pm
WHERE pm.OwnerID IN (
    SELECT OwnerID
    FROM (
        SELECT 
            pdn.OwnerID,
            ROUND(SUM(pdn.CarpetAreaSqMeter), 0) AS area
        FROM PropertyDetailsNew pdn
        INNER JOIN PropertyMast pm2 ON pm2.OwnerID = pdn.OwnerID
        WHERE 
            pm2.FlatSystemRemark = 'Yes'
              AND pm2.NewWardNo = '${flatChecks.wardNo}'
                AND pm2.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
                AND pm2.BHK in (${flatChecks.bhk})   
        GROUP BY pdn.OwnerID
    ) AS sub
    WHERE area IN (
        SELECT area
        FROM (
            SELECT 
                pdn.OwnerID,
                ROUND(SUM(pdn.CarpetAreaSqMeter), 0) AS area
            FROM PropertyDetailsNew pdn
            INNER JOIN PropertyMast pm3 ON pm3.OwnerID = pdn.OwnerID
            WHERE 
                pm3.FlatSystemRemark = 'Yes'
                      AND pm3.NewWardNo = '${flatChecks.wardNo}'
                      AND pm3.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
                      AND pm3.BHK in (${flatChecks.bhk})
            GROUP BY pdn.OwnerID
        ) AS sub2
        GROUP BY area
        HAVING COUNT(*) <= 1
    )
)
ORDER BY 
    CAST(pm.NewWardNo AS UNSIGNED),
    CAST(pm.NewPropertyNo AS UNSIGNED),
    CAST(pm.NewPartitionNo AS UNSIGNED);
`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "toiletCountMismatch") {
      const result = await sequelize.query(`SELECT 
    pm.NewWardNo AS Ward,
    pm.NewPropertyNo AS PropertyNo,
    pm.NewPartitionNo AS PartitionNo,
    pm.NewToiletNo
FROM PropertyMast pm
WHERE pm.NewToiletNo IN (
    SELECT NewToiletNo
    FROM PropertyMast
    WHERE FlatSystemRemark = 'Yes'
      AND NewWardNo = '${flatChecks.wardNo}'                          
      AND NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}         
      AND BHK in (${flatChecks.bhk})                                
    GROUP BY NewToiletNo
    HAVING COUNT(*) = 1
)
AND pm.FlatSystemRemark = 'Yes'
AND pm.NewWardNo = '${flatChecks.wardNo}'
AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
AND pm.BHK in (${flatChecks.bhk})
ORDER BY 
    CAST(pm.NewWardNo AS UNSIGNED),
    CAST(pm.NewPropertyNo AS UNSIGNED),
    CAST(pm.NewPartitionNo AS UNSIGNED);
`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "plotAreaMismatch") {
      const result = await sequelize.query(`
      SELECT 
    pm.NewWardNo AS Ward,
    pm.NewPropertyNo AS PropertyNo,
    pm.NewPartitionNo AS PartitionNo,
    pm.PlotArea
FROM PropertyMast pm
WHERE pm.PlotArea IN (
    SELECT PlotArea
    FROM PropertyMast
    WHERE FlatSystemRemark = 'Yes'
      AND NewWardNo = '${flatChecks.wardNo}'                              -- replace with txtWardFlatSystemNew.Text.Trim()
      AND NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}            -- replace with txtFromPropFlatSystemNew / txtToFlatSystemNew
    GROUP BY PlotArea
    HAVING COUNT(*) = 1
)
AND pm.FlatSystemRemark = 'Yes'
AND pm.NewWardNo = '${flatChecks.wardNo}'
AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
AND pm.BHK in (${flatChecks.bhk})
ORDER BY 
    CAST(pm.NewWardNo AS UNSIGNED),
    CAST(pm.NewPropertyNo AS UNSIGNED),
    CAST(pm.NewPartitionNo AS UNSIGNED);`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "propertyDescMismatchFlat") {
      const result = await sequelize.query(`SELECT 
    pm.NewWardNo AS Ward,
    pm.NewPropertyNo AS PropertyNo,
    pm.NewPartitionNo AS PartitionNo,
    pt.PropertyDescription AS "Property Description"
FROM PropertyMast pm
INNER JOIN PropertyTypeMaster pt 
    ON pt.PropertyTypeID = pm.PropertyTypeID
WHERE pm.PropertyTypeID IN (
    SELECT PropertyTypeID
    FROM PropertyMast
    WHERE FlatSystemRemark = 'Yes'
      AND NewWardNo = '${flatChecks.wardNo}'                            -- replace with txtWardFlatSystemNew.Text.Trim()
      AND NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}          -- replace with txtFromPropFlatSystemNew / txtToFlatSystemNew
      AND BHK in (${flatChecks.bhk})                                   -- replace with cmbBHKFlatSystemNew.Text
    GROUP BY PropertyTypeID
    HAVING COUNT(*) = 1
)
AND pm.FlatSystemRemark = 'Yes'
AND pm.NewWardNo = '${flatChecks.wardNo}'
AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
AND pm.BHK in (${flatChecks.bhk})
ORDER BY 
    CAST(pm.NewWardNo AS UNSIGNED),
    CAST(pm.NewPropertyNo AS UNSIGNED),
    CAST(pm.NewPartitionNo AS UNSIGNED);
`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "constructionTypeMismatch") {
      const result = await sequelize.query(` SELECT 
          pm.NewWardNo AS Ward,
          pm.NewPropertyNo AS PropertyNo,
          pm.NewPartitionNo AS PartitionNo
      FROM PropertyMast pm
      INNER JOIN PropertyDetailsNew pdn ON pm.OwnerID = pdn.OwnerID
      WHERE pm.FlatSystemRemark = 'Yes'
        AND pm.NewWardNo = ${flatChecks.wardNo}
        AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
        AND pm.BHK in (${flatChecks.bhk})
        AND pdn.ConstructionType IN (
            SELECT ConstructionType
            FROM PropertyDetailsNew pdn2
            INNER JOIN PropertyMast pm2 ON pm2.OwnerID = pdn2.OwnerID
            WHERE pm2.FlatSystemRemark = 'Yes'
              AND pm2.NewWardNo = ${flatChecks.wardNo}
              AND pm2.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
              AND pm2.BHK in (${flatChecks.bhk})
            GROUP BY pdn2.ConstructionType
            HAVING COUNT(*) <= 1
        )
      GROUP BY pm.NewWardNo, pm.NewPropertyNo, pm.NewPartitionNo
      ORDER BY 
          CAST(pm.NewWardNo AS UNSIGNED),
          CAST(pm.NewPropertyNo AS UNSIGNED),
          CAST(pm.NewPartitionNo AS UNSIGNED);`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "constructionYearMismatch") {
      const result = await sequelize.query(` SELECT 
          pm.NewWardNo AS Ward,
          pm.NewPropertyNo AS PropertyNo,
          pm.NewPartitionNo AS PartitionNo
      FROM PropertyMast pm
      INNER JOIN PropertyDetailsNew pdn ON pm.OwnerID = pdn.OwnerID
      WHERE pm.FlatSystemRemark = 'Yes'
        AND pm.NewWardNo = ${flatChecks.wardNo}
        AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
        AND pm.BHK in (${flatChecks.bhk})
        AND pdn.ConstructionYear IN (
            SELECT ConstructionYear
            FROM PropertyDetailsNew pdn2
            INNER JOIN PropertyMast pm2 ON pm2.OwnerID = pdn2.OwnerID
            WHERE pm2.FlatSystemRemark = 'Yes'
              AND pm2.NewWardNo = ${flatChecks.wardNo}
              AND pm2.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
              AND pm2.BHK in (${flatChecks.bhk})
            GROUP BY pdn2.ConstructionYear
            HAVING COUNT(*) <= 1
        )
      GROUP BY pm.NewWardNo, pm.NewPropertyNo, pm.NewPartitionNo
      ORDER BY 
          CAST(pm.NewWardNo AS UNSIGNED),
          CAST(pm.NewPropertyNo AS UNSIGNED),
          CAST(pm.NewPartitionNo AS UNSIGNED);`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "taxMismatch") {
      const result = await sequelize.query(`  SELECT 
          pm.NewWardNo AS Ward,
          pm.NewPropertyNo AS PropertyNo,
          pm.NewPartitionNo AS PartitionNo,
          tm.RateableValue AS RV
      FROM PropertyMast pm
      INNER JOIN TransMast tm ON tm.OwnerID = pm.OwnerID
      WHERE pm.FlatSystemRemark = 'Yes'
        AND pm.NewWardNo = ${flatChecks.wardNo}
        AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
        AND pm.BHK in (${flatChecks.bhk})
        AND tm.RateableValue IN (
            SELECT tm2.RateableValue
            FROM PropertyMast pm2
            INNER JOIN TransMast tm2 ON tm2.OwnerID = pm2.OwnerID
            WHERE pm2.FlatSystemRemark = 'Yes'
              AND pm2.NewWardNo = ${flatChecks.wardNo}
              AND pm2.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
              AND pm2.BHK in (${flatChecks.bhk})
            GROUP BY tm2.RateableValue
            HAVING COUNT(*) = 1
        )
      ORDER BY 
          CAST(pm.NewWardNo AS UNSIGNED),
          CAST(pm.NewPropertyNo AS UNSIGNED),
          CAST(pm.NewPartitionNo AS UNSIGNED);`);
      return res.status(200).json(result[0]);
    } else if (activePanel == "secondPhotoMissing") {
      const result = await sequelize.query(`
        SELECT 
          pm.NewWardNo, 
          pm.NewPropertyNo,
          pm.NewPartitionNo
      FROM PropertyMast pm
      INNER JOIN PropertyImagesMast img ON img.OwnerID = pm.OwnerID
      WHERE pm.FlatSystemRemark = 'Yes'
        AND pm.NewWardNo = ${flatChecks.wardNo}
        AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
        AND pm.BHK in (${flatChecks.bhk})
        AND img.PropertyPhotoB IS NULL
      ORDER BY 
          CAST(pm.NewWardNo AS UNSIGNED),
          CAST(pm.NewPropertyNo AS UNSIGNED),
          CAST(pm.NewPartitionNo AS UNSIGNED);
    `);
      return res.status(200).json(result[0]);
    } else if (activePanel == "apartmentNameMismatch") {
      const result = await sequelize.query(` SELECT 
          pm.NewWardNo, 
          pm.NewPropertyNo,
          pm.NewPartitionNo,
          pm.BuildingOrShopNameMarathi AS 'इमारती/दुकान चे नाव'
      FROM PropertyMast pm
      WHERE pm.BuildingOrShopNameMarathi IN (
          SELECT pm2.BuildingOrShopNameMarathi
          FROM PropertyMast pm2
          WHERE pm2.FlatSystemRemark = 'Yes'
            AND pm2.NewWardNo =${flatChecks.wardNo}
             AND pm2.bhk in(${flatChecks.bhk})
            AND pm2.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
          GROUP BY pm2.BuildingOrShopNameMarathi
          HAVING COUNT(*) = 1
      )
        AND pm.FlatSystemRemark = 'Yes'
        AND pm.NewWardNo = ${flatChecks.wardNo}
         AND pm.bhk in(${flatChecks.bhk})
        AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
      ORDER BY 
          CAST(pm.NewWardNo AS UNSIGNED),
          CAST(pm.NewPropertyNo AS UNSIGNED),
          CAST(pm.NewPartitionNo AS UNSIGNED);
    `);
      return res.status(200).json(result[0]);
    } else if (activePanel == "apartmentNoMismatch") {
      const result = await sequelize.query(` SELECT 
            pm.NewWardNo, 
            pm.NewPropertyNo,
            pm.NewPartitionNo,
            pm.BuildingOrFlatNoMarathi AS 'इमारती/दुकान नं'
        FROM PropertyMast pm
        WHERE pm.BuildingOrFlatNoMarathi IN (
            SELECT pm2.BuildingOrFlatNoMarathi
            FROM PropertyMast pm2
            WHERE pm2.FlatSystemRemark = 'Yes'
              AND pm2.bhk in(${flatChecks.bhk})
              AND pm2.NewWardNo =${flatChecks.wardNo}
              AND pm2.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
            GROUP BY pm2.BuildingOrFlatNoMarathi
            HAVING COUNT(*) = 1
        )
          AND pm.FlatSystemRemark = 'Yes'
          AND pm.NewWardNo = ${flatChecks.wardNo}
          AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
           ANd pm.bhk in(${flatChecks.bhk})
        ORDER BY 
            CAST(pm.NewWardNo AS UNSIGNED),
            CAST(pm.NewPropertyNo AS UNSIGNED),
            CAST(pm.NewPartitionNo AS UNSIGNED);
    `);
      return res.status(200).json(result[0]);
    } else if (activePanel == "zoneMismatch") {
      const result = await sequelize.query(` SELECT 
    pm.NewWardNo AS 'Ward', 
    pm.NewPropertyNo AS PropertyNo,
    pm.NewPartitionNo AS PartitionNo,
    pm.NewZoneNo AS ZoneNo
FROM PropertyMast pm
WHERE pm.NewZoneNo IN (
    SELECT pm2.NewZoneNo
    FROM PropertyMast pm2
    WHERE pm2.FlatSystemRemark = 'Yes'
      AND pm2.NewWardNo = '${flatChecks.wardNo}'  -- replace with txtWardFlatSystemNew
     AND pm2.bhk in(${flatChecks.bhk})  
      AND pm2.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}  -- replace with txtFromPropFlatSystemNew / txtToFlatSystemNew
    GROUP BY pm2.NewZoneNo
    HAVING COUNT(*) = 1
)
  AND pm.FlatSystemRemark = 'Yes'
  AND pm.NewWardNo = '${flatChecks.wardNo}' 
   AND pm.bhk in(${flatChecks.bhk})
  AND pm.NewPropertyNo BETWEEN ${flatChecks.fromProp} AND ${flatChecks.toProp}
ORDER BY 
    CAST(pm.NewWardNo AS UNSIGNED),
    CAST(pm.NewPropertyNo AS UNSIGNED),
    CAST(pm.NewPartitionNo AS UNSIGNED);`);
      res.status(200).json(result[0]);
      return;
    } else {
      return res.status(400).json({ message: "Invalid active panel" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
export const getRoomCarpetComparison = async (req, res) => {
  const { selectedWards, roomNoRepeatChecks } = req.body;
  try {
    let sql = `
   SELECT 
    PM.OwnerID,
    PM.NewWardNo,
    PM.NewPropertyNo,
    PM.NewPartitionNo,
    PM.OwnerNameMarathi AS OwnerName,
    MAX(PDN.RenterNameMarathi) AS RenterName,
   -- MAX(PropertyDescription) AS PropertyDescription,
    MAX(OP.OldRV) AS OldRV,
    MAX(OP.OldPropertyTax) AS OldPropertyTax,
    MAX(OP.OldTotalTax) AS OldTotalTax,
    MAX(TM.RateableValue) AS NewRV,
    MAX(TM.PropertyTax) AS NewPropertyTax,
    MAX(TM.TaxTotal) AS NewTaxTotal,
    SUM(PDN.NoOfRooms) AS Rooms,
    SUM(PDN.CarpetAreaSqFeet) AS CarpetArea
FROM PropertyMast PM
INNER JOIN PropertyDetailsNew PDN ON PDN.OwnerID = PM.OwnerID
INNER JOIN OldPropertyMast OP ON OP.OwnerID = PM.OwnerID
INNER JOIN PropertyTypeMaster PTM ON PTM.PropertyTypeID = PM.PropertyTypeID
INNER JOIN TransMast TM ON TM.OwnerID = PM.OwnerID
WHERE PDN.TypeOfUse NOT IN ('WR','V','WC','WI','VC','VI','VR','WEG','WEP','WGC','WGR','WTR','WCH','WCL','VPR')
  AND PM.OwnerID IN (
        SELECT DISTINCT OwnerID 
        FROM FloorSubmissionDetails 
        WHERE InnerOuter='Inner'
  )


`;

    if (selectedWards.length > 0) {
      sql += ` AND PM.NewWardNo IN (${selectedWards
        .map(() => "?")
        .join(",")}) `;
    }
    sql += `
      GROUP BY 
          PM.OwnerID, PM.NewWardNo, PM.NewPropertyNo, PM.NewPartitionNo,
          PM.OwnerNameMarathi
      HAVING PM.OwnerID IN (
          SELECT DISTINCT OwnerID FROM FloorSubmissionDetails WHERE InnerOuter='Inner'
      )
      ORDER BY 
          CAST(PM.NewWardNo AS UNSIGNED),
          CAST(PM.NewPropertyNo AS UNSIGNED),
          CAST(PM.NewPartitionNo AS UNSIGNED)
    `;

    const [rows] = await sequelize.query(sql, {
      replacements: selectedWards,
    });

    // === Now process data like C# ===
    let result = [];
    const a = parseInt(roomNoRepeatChecks.rooms);
    const b = parseInt(roomNoRepeatChecks.carpetArea);
    const ans = Math.floor(b / a);

    rows.forEach((row) => {
      const res = parseInt(row.CarpetArea);
      const rroom = parseInt(row.Rooms);
      const total = ans * rroom;

      if (total <= res) {
        result.push({
          "वॉर्ड नं": row.NewWardNo,
          "नवीन मालमत्ता क्रं": row.NewPropertyNo,
          "नवीन भाग क्रं": row.NewPartitionNo,
          "मालमत्ता धारकाचे नाव": row.OwnerName,
          "भोगवटदाराचे नाव": row.RenterName,
          "मालमत्तेचे वर्णन": row.PropertyDescription,
          "जुने करयोग्य मुल्य": row.OldRV,
          "जुना मालमत्ता कर": row.OldPropertyTax,
          "जुना एकूण कर": row.OldTotalTax,
          "प्रस्तावित करयोग्य मुल्य": row.NewRV,
          "प्रस्तावित मालमत्ता कर": row.NewPropertyTax,
          "प्रस्तावित एकूण कर": row.NewTaxTotal,
          खोली: row.Rooms,
          "प्रस्तावित क्षेत्रफळ": row.CarpetArea,
        });
      }
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getRoomCarpetComparison:", error);
    throw error;
  }
};
export const getToiletAreaComparison = async (req, res) => {
  const { toiletAreaComparison, selectedWards } = req.body;
  console.log(
    "Toilet Area Comparison:",
    toiletAreaComparison,
    "Selected Wards:",
    selectedWards
  );
  try {
    let sql = `
        SELECT 
            PM.OwnerID,
            PM.NewWardNo,
            PM.NewPropertyNo,
            PM.NewPartitionNo,
              PM.OwnerNameMarathi AS OwnerName,
            MAX(PDN.RenterNameMarathi) AS RenterName,
           -- MAX(PM.PropertyDescription) AS PropertyDescription,
            MAX(OP.OldRV) AS OldRV,
            MAX(OP.OldPropertyTax) AS OldPropertyTax,
            MAX(OP.OldTotalTax) AS OldTotalTax,
            MAX(TM.RateableValue) AS NewRV,
            MAX(TM.PropertyTax) AS NewPropertyTax,
            MAX(TM.TaxTotal) AS NewTaxTotal,
            SUM(PDN.NoOfRooms) AS Rooms,
            (SUM(PM.NewToiletNo) + SUM(PM.CommToiletNo)) AS Toilets,
            SUM(PDN.CarpetAreaSqFeet) AS CarpetArea
        FROM PropertyMast PM
        INNER JOIN PropertyDetailsNew PDN ON PDN.OwnerID = PM.OwnerID
        INNER JOIN OldPropertyMast OP ON OP.OwnerID = PM.OwnerID
        INNER JOIN PropertyTypeMaster PTM ON PTM.PropertyTypeID = PM.PropertyTypeID
        INNER JOIN TransMast TM ON TM.OwnerID = PM.OwnerID
        WHERE PDN.TypeOfUse NOT IN ('WR','V','WC','WI','VC','VI','VR','WEG','WEP','WGC','WGR','WTR','WCH','WCL','VPR')
        
    `;

    if (selectedWards.length > 0) {
      sql += ` AND PM.NewWardNo IN (${selectedWards
        .map(() => "?")
        .join(",")}) `;
    }
    sql += ` GROUP BY 
    PM.OwnerID, PM.NewWardNo, PM.NewPropertyNo, PM.NewPartitionNo,
    PM.OwnerNameMarathi
ORDER BY 
    CAST(PM.NewWardNo AS UNSIGNED),
    CAST(PM.NewPropertyNo AS UNSIGNED),
    CAST(PM.NewPartitionNo AS UNSIGNED)`;

    const [rows] = await sequelize.query(sql, {
      replacements: selectedWards,
    });

    // === Now process data like C# ===
    let result = [];
    const a = parseInt(toiletAreaComparison.Toilets);
    const b = parseInt(toiletAreaComparison.CarpetArea);
    const ans = Math.floor(b / a);

    rows.forEach((r) => {
      const res = parseInt(r.CarpetArea);
      const rroom = parseInt(r.Toilets);
      const total = ans * rroom;

      if (total <= res) {
        result.push({
          "वॉर्ड नं": r.NewWardNo,
          "नवीन मालमत्ता क्रं": r.NewPropertyNo,
          "नवीन भाग क्रं": r.NewPartitionNo,
          "मालमत्ता धारकाचे नाव": r.OwnerName,
          "भोगवटदाराचे नाव": r.RenterName,
          "मालमत्तेचे वर्णन": r.PropertyDescription,
          "जुने करयोग्य मुल्य": r.OldRV,
          "जुना मालमत्ता कर": r.OldPropertyTax,
          "जुना एकूण कर": r.OldTotalTax,
          "प्रस्तावित करयोग्य मुल्य": r.NewRV,
          "प्रस्तावित मालमत्ता कर": r.NewPropertyTax,
          "प्रस्तावित एकूण कर": r.NewTaxTotal,
          खोली: r.Rooms,
          शौचालय: r.Toilets,
          "प्रस्तावित क्षेत्रफळ": r.CarpetArea,
        });
      }
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getToiletAreaComparison:", error);
    throw error;
  }
};
export const getSqFtComparison = async (req, res) => {
  const { selectedWards, percent } = req.body;
  console.log("Percent:", percent, "Selected Wards:", selectedWards);
  try {
    let NewWardNoNew;
    if (!Array.isArray(selectedWards)) {
      try {
        NewWardNoNew = JSON.parse(selectedWards);
      } catch (err) {
        NewWardNoNew = [];
      }
    }

    // Now safe to map
    NewWardNoNew = selectedWards
      .map((w) => w.toString().trim())
      .filter((w) => w !== "");

    if (!NewWardNoNew) {
      throw new Error("Please select ward no.");
    }

    // --------------------------------
    // DB CALL (same as QC.GetComparisionForOldSqftandNewSqft)
    // --------------------------------
    const result = await sequelize.query(
      `CALL GetComparisionForOldSqftandNewSqft(:wardNos);`,
      { replacements: { wardNos: NewWardNoNew.join(",") } }
    );

    let dt = result[0]; // equivalent to dtFill
    let resultTable = []; // equivalent to dtFill[]
    if (dt != undefined && dt != null) {
      if (dt.length > 0) {
        let a = parseInt(percent); // txtPercent.Text

        for (let i = 0; i < dt.length; i++) {
          let row = dt[i];

          let b = parseInt(row.newSqlFt);
          let res = parseInt(row.OldSqFt);

          let ans = (res * a) / 100;
          let total = ans + res;

          if (total <= b) {
            resultTable.push({
              "वॉर्ड नं": row.NewWardNo,
              "नवीन मालमत्ता क्रं": row.NewPropertyNo,
              "नवीन भाग क्रं": row.NewPartitionNo,
              "मालमत्ता धारकाचे नाव": row.OwnerName,
              "भोगवटदाराचे नाव": row.RenterName,
              "मालमत्तेचे वर्णन": row.PropertyDescription,
              "जुने करयोग्य मुल्य": row.OldRV,
              "जुना मालमत्ता कर": row.OldPropertyTax,
              "जुना एकूण कर": row.OldTotalTax,
              "प्रस्तावित करयोग्य मुल्य": row.NewRV,
              "प्रस्तावित मालमत्ता कर": row.NewPropertyTax,
              "प्रस्तावित एकूण कर": row.NewTotalTax,
              "जुना क्षेत्रफळ": row.OldSqFt,
              "प्रस्तावित क्षेत्रफळ": row.newSqlFt,
            });
          }
        }
      }
    }
    return res.status(200).json(resultTable);
  } catch (err) {
    console.error("Error:", err.message);
    throw err;
  }
};

const formatWardNumbers = (wards) => wards.map((w) => `'${w}'`).join(",");

export const getSubmissionAreaMismatch = async (req, res) => {
  try {
    const { wardNo } = req.body;
    if (!wardNo || wardNo.length === 0) {
      return res.status(400).json({ message: "Please select ward numbers" });
    }
    const wardsStr = formatWardNumbers(wardNo);

    const sql =
      ` Drop TEMPORARY table if exists temp;
        Drop TEMPORARY table if exists temp1;
        CREATE TEMPORARY TABLE temp AS
            SELECT OwnerID, SUM(TotalArea) AS TotalAreaFSD
            FROM FloorSubmissionDetails
            WHERE Remark = 'openplot' AND TypeOfUseID = 'V'
            GROUP BY OwnerID;

        CREATE TEMPORARY TABLE temp1 AS
            SELECT OwnerID, SUM(CarpetAreaSqFeet) AS TotalAreaPDN
            FROM PropertyDetailsNew
            WHERE TypeOfUse = 'V'
            GROUP BY OwnerID;

        CREATE TEMPORARY TABLE temp2 AS
            SELECT a.OwnerID, TotalAreaFSD, TotalAreaPDN,
                   (TotalAreaPDN - TotalAreaFSD) AS Difference1,
                   (TotalAreaFSD - TotalAreaPDN) AS Difference2
            FROM temp a
            INNER JOIN temp1 b ON a.OwnerID = b.OwnerID
            WHERE a.TotalAreaFSD <> b.TotalAreaPDN
              AND ((TotalAreaPDN - TotalAreaFSD) > 5 OR (TotalAreaFSD - TotalAreaPDN) > 5);

        SELECT pm.OwnerID AS 'ओनर आयडी',
               pm.NewWardNo AS 'नवीन प्रभाग क्र',
               pm.NewPropertyNo AS 'नवीन मालमत्ता क्र',
               pm.NewPartitionNo AS 'नवीन भाग क्र',
               t.TotalAreaFSD AS 'क्षेत्रफळ (सबमिशन)',
               t.TotalAreaPDN AS 'क्षेत्रफळ (प्रॉपर्टी डिटेल्स न्यू)',
               t.Difference1 AS 'फरक1',
               t.Difference2 AS 'फरक2'
        FROM PropertyMast pm
        INNER JOIN temp2 t ON pm.OwnerID = t.OwnerID
        WHERE pm.NewWardNo IN (${wardsStr})
        ORDER BY pm.NewWardNo + 0, pm.NewPropertyNo + 0, pm.NewPartitionNo + 0;
        `;

    const [dt] = await sequelize.query(sql, { multipleStatements: true });
    return res.json(dt[dt.length - 1]); // last result set contains the SELECT
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getSubmissionRoomNoMismatch = async (req, res) => {
  try {
    const { wardNo } = req.body;
    if (!wardNo || wardNo.length === 0) return res.status(400).json({ message: "Please select ward numbers" });
    const wardsStr = formatWardNumbers(wardNo);

    const sql = `
        Drop TEMPORARY table if exists temp;
        Drop TEMPORARY table if exists temp1;
        CREATE TEMPORARY TABLE temp AS
            SELECT OwnerID, SUM(NoOfRooms) AS NoOfRoomsPDN
            FROM PropertyDetailsNew
            GROUP BY OwnerID;

        CREATE TEMPORARY TABLE temp1 AS
            SELECT OwnerID, SUM(NoOfRooms) AS NoOfRoomsFSD
            FROM FloorSubmissionDetails
            GROUP BY OwnerID;

        SELECT pm.NewWardNo AS 'नवीन प्रभाग क्र',
               pm.NewPropertyNo AS 'नवीन मालमत्ता क्र',
               pm.NewPartitionNo AS 'नवीन भाग क्र'
        FROM PropertyMast pm
        WHERE pm.OwnerID IN (
            SELECT a.OwnerID
            FROM temp a
            LEFT JOIN temp1 b ON a.OwnerID = b.OwnerID
            WHERE a.NoOfRoomsPDN <> b.NoOfRoomsFSD
        )
        AND pm.NewWardNo IN (${wardsStr})
        ORDER BY pm.NewWardNo + 0, pm.NewPropertyNo + 0, pm.NewPartitionNo + 0;
        `;

    const [dt] = await sequelize.query(sql, { multipleStatements: true });
    return res.json(dt[dt.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getSubmissionMissing = async (req, res) => {
  console.log("getSubmissionMissing called", req.body);
  try {
    const { wardNo } = req.body;
    if (!wardNo || wardNo.length === 0) return res.status(400).json({ message: "Please select ward numbers" });
    const wardsStr = formatWardNumbers(wardNo);
    const sql = `
        SELECT pm.NewWardNo AS 'नवीन प्रभाग क्र',
               pm.NewPropertyNo AS 'नवीन मालमत्ता क्र',
               pm.NewPartitionNo AS 'नवीन भाग क्र'
        FROM PropertyMast pm
        WHERE pm.OwnerID IN (
            SELECT ownerid
            FROM PropertyDetailsNew
            WHERE ownerid NOT IN (
                SELECT ownerid FROM FloorSubmissionDetails WHERE Remark = 'OpenPlot'
            )
        )
        AND pm.NewWardNo IN (${wardsStr})
        ORDER BY pm.NewWardNo + 0, pm.NewPropertyNo + 0, pm.NewPartitionNo + 0;
        `;

    const [dt] = await sequelize.query(sql);
    return res.json(dt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---- RoomNo Repeat ----
export const getRoomNoRepeat = async (req, res) => {
  try {
    const { wardNo } = req.body;
    if (!wardNo || wardNo.length === 0) return res.status(400).json({ message: "Please select ward numbers" });
    const wardsStr = formatWardNumbers(wardNo);

    const sql = `Drop TEMPORARY TABLE if  exists temp;
        CREATE TEMPORARY TABLE temp AS
            SELECT OwnerID, RoomNo
            FROM FloorSubmissionDetails
            WHERE Remark = 'OpenPlot' AND NoOfRooms <> 0 AND RoomNo NOT IN ('', '0')
            GROUP BY OwnerID, RoomNo;
         

        SELECT pm.NewWardNo AS 'नवीन प्रभाग क्र',
               pm.NewPropertyNo AS 'नवीन मालमत्ता क्र',
               pm.NewPartitionNo AS 'नवीन भाग क्र',
               t.RoomNo AS 'रूम नं'
        FROM temp t
        INNER JOIN PropertyMast pm ON pm.OwnerID = t.OwnerID
        WHERE pm.NewWardNo IN (${wardsStr})
        ORDER BY pm.NewWardNo + 0, pm.NewPropertyNo + 0, pm.NewPartitionNo + 0;
        `;

    const [dt] = await sequelize.query(sql, { multipleStatements: true });
    return res.json(dt[dt.length - 1]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---- Length is zero but area > 0 ----
export const getLengthZeroAreaGtZero = async (req, res) => {
  try {
    const { wardNo } = req.body;
    if (!wardNo || wardNo.length === 0) return res.status(400).json({ message: "Please select ward numbers" });
    const wardsStr = formatWardNumbers(wardNo);

    const sql = `
        SELECT pm.NewWardNo AS 'नवीन प्रभाग क्र',
               pm.NewPropertyNo AS 'नवीन मालमत्ता क्र',
               pm.NewPartitionNo AS 'नवीन भाग क्र'
        FROM PropertyMast pm
        WHERE pm.OwnerID IN (
            SELECT ownerid
            FROM FloorSubmissionDetails
            WHERE length = 0 AND area > 0 AND Remark = 'OpenPlot'
        )
        AND pm.NewWardNo IN (${wardsStr})
        ORDER BY pm.NewWardNo + 0, pm.NewPropertyNo + 0, pm.NewPartitionNo + 0;
        `;

    const [dt] = await sequelize.query(sql);
    return res.json(dt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---- Length=0 & Width=0 & area>0 ----
export const getLengthWidthZeroAreaGtZero = async (req, res) => {
  try {
    const { wardNo } = req.body;
    if (!wardNo || wardNo.length === 0) return res.status(400).json({ message: "Please select ward numbers" });
    const wardsStr = formatWardNumbers(wardNo);

    const sql = `
        SELECT pm.NewWardNo, pm.NewPropertyNo, pm.NewPartitionNo
        FROM FloorSubmissionDetails fd
        INNER JOIN PropertyMast pm ON pm.OwnerID = fd.OwnerID
        WHERE fd.Length = 0 AND fd.Width = 0 AND fd.Area > 0 AND fd.Remark = 'OpenPlot'
        AND pm.NewWardNo IN (${wardsStr})
        ORDER BY pm.NewWardNo + 0, pm.NewPropertyNo + 0, pm.NewPartitionNo + 0;
        `;

    const [dt] = await sequelize.query(sql);
    return res.json(dt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---- Area=TotalArea & IsMinus=Yes ----
export const getAreaTotalIsMinusYes = async (req, res) => {
  try {
    const { wardNo } = req.body;
    if (!wardNo || wardNo.length === 0) return res.status(400).json({ message: "Please select ward numbers" });
    const wardsStr = formatWardNumbers(wardNo);

    const sql = `
        SELECT pm.NewWardNo, pm.NewPropertyNo, pm.NewPartitionNo
        FROM FloorSubmissionDetails fd
        INNER JOIN PropertyMast pm ON pm.OwnerID = fd.OwnerID
        WHERE fd.Area = fd.TotalArea AND fd.Remark = 'OpenPlot' AND fd.IsMinus = '1'
        AND pm.NewWardNo IN (${wardsStr})
        ORDER BY pm.NewWardNo + 0, pm.NewPropertyNo + 0, pm.NewPartitionNo + 0;
        `;

    const [dt] = await sequelize.query(sql);
    return res.json(dt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ---- Utility Having Room Count ----
export const getUtilityRoomCount = async (req, res) => {
  console.log(req.body)
  try {
    const { wardNo } = req.body;
    if (!wardNo || wardNo.length === 0) return res.status(400).json({ message: "Please select ward numbers" });
    const wardsStr = formatWardNumbers(wardNo);

    const sql = `
        SELECT pm.NewWardNo, pm.NewPropertyNo, pm.NewPartitionNo
        FROM FloorSubmissionDetails fd
        INNER JOIN PropertyMast pm ON pm.OwnerID = fd.OwnerID
        WHERE fd.Remark = 'OpenPlot'
          AND fd.TypeOfUseID LIKE 'W%'
          AND fd.TypeOfUseID = 'WT'
          OR fd.TypeOfUseID = 'V'
          AND (fd.NoOfRooms > 0 OR fd.RoomNo NOT IN ('','0'))
          AND pm.NewWardNo IN (${wardsStr})
        ORDER BY pm.NewWardNo + 0, pm.NewPropertyNo + 0, pm.NewPartitionNo + 0;
        `;

    const [dt] = await sequelize.query(sql);
    return res.json(dt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getInvoiceReport = async (req, res) => {
  try {
    const { wardNo, year, billBookNo, activePanel } = req.body;

    if (!wardNo || wardNo.length === 0) {
      return res.status(400).json({ message: "Please select ward numbers" });
    }

    const intWardNo = wardNo.map((item) => parseInt(item.trim(), 10));
    if (activePanel == "missingInvoiceNo") {
      // 1️⃣ Get invoice ranges
      const invoiceWhere = { Year: year };
      if (billBookNo !== "All") invoiceWhere.BillBookNo = billBookNo;

      const invoiceList = await BillBookEntry.findAll({
        attributes: ["ReceiptNoFrom", "ReceiptNoTo", "EmpName", "BillBookNo"],
        where: invoiceWhere,
        raw: true,
      });

      if (!invoiceList || invoiceList.length === 0) {
        return res.status(200).json({ missingInvoices: [] });
      }

      // 2️⃣ Generate all invoice numbers
      const allInvoices = [];
      invoiceList.forEach((inv) => {
        for (let i = inv.ReceiptNoFrom; i <= inv.ReceiptNoTo; i++) {
          allInvoices.push({
            Year: year,
            BillBookNo: inv.BillBookNo,
            InvoiceNo: i,
            EmpName: inv.EmpName,
          });
        }
      });

      // 3️⃣ Fetch active invoices from InvoiceNoMaster
      const activeInvoices = await InvoiceNoMaster.findAll({
        attributes: ["InvoiceNo", "BillBookNo"],
        where: {
          Year: year,
          BillBookNo: {
            [Op.in]: [...new Set(allInvoices.map((i) => i.BillBookNo))],
          },
          InvoiceNo: { [Op.in]: allInvoices.map((i) => i.InvoiceNo) },
          Status: { [Op.ne]: 0 },
        },
        raw: true,
      });

      const activeSet = new Set(
        activeInvoices.map((i) => `${i.BillBookNo}-${i.InvoiceNo}`)
      );

      // 4️⃣ Fetch all existing transactions
      const existingTransactions = await BillTransactionDetails.findAll({
        attributes: ["InvoiceNo", "BillBookNo"],
        where: {
          FinanceYear: year,
          BillBookNo: {
            [Op.in]: [...new Set(allInvoices.map((i) => i.BillBookNo))],
          },
          InvoiceNo: { [Op.in]: allInvoices.map((i) => i.InvoiceNo) },
        },
        raw: true,
      });

      const existingTransactionsAdvance =
        await BillTransactionDetailsAdvance.findAll({
          attributes: ["InvoiceNo", "BillBookNo"],
          where: {
            FinanceYear: year,
            BillBookNo: {
              [Op.in]: [...new Set(allInvoices.map((i) => i.BillBookNo))],
            },
            InvoiceNo: { [Op.in]: allInvoices.map((i) => i.InvoiceNo) },
          },
          raw: true,
        });

      const existingSet = new Set([
        ...existingTransactions.map((i) => `${i.BillBookNo}-${i.InvoiceNo}`),
        ...existingTransactionsAdvance.map(
          (i) => `${i.BillBookNo}-${i.InvoiceNo}`
        ),
      ]);

      // 5️⃣ Determine missing invoices
      const missingInvoices = allInvoices
        .filter(
          (i) =>
            activeSet.has(`${i.BillBookNo}-${i.InvoiceNo}`) &&
            !existingSet.has(`${i.BillBookNo}-${i.InvoiceNo}`)
        )
        .map((i) => ({
          वर्ष: i.Year,
          "बिल बुक क्रं.": i.BillBookNo,
          "पावती क्रं": i.InvoiceNo,
          "कर्मचाऱ्याचे नाव": i.EmpName,
        }));

      res.status(200).json(missingInvoices);
    } else if (activePanel == "canceledInvoice") {
      let subQuery = "";
      if (billBookNo && billBookNo !== "All") {
        subQuery = `AND b.BillBookNo = '${billBookNo}' AND b.Year = ${year}`;
      } else {
        subQuery = `AND b.Year = ${year}`;
      }

      // 2️⃣ Construct raw SQL query
      const sql = `
      SELECT 
        a.BillBookNo,
        a.InvoiceNo,
        'Canceled Receipt' AS Remark,
        b.EmpName,
        b.Year
      FROM InvoiceNoMaster AS a
      INNER JOIN BillBookMaster AS b
        ON a.BillBookNo = b.BillBookNo
      WHERE a.Status = 0
        AND a.Year = b.Year
        ${subQuery}
      GROUP BY a.BillBookNo, a.InvoiceNo, b.EmpName, b.Year
      ORDER BY a.BillBookNo, a.InvoiceNo
    `;

      // 3️⃣ Execute the query
      const canceledInvoices = await sequelize.query(sql, {
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
      });

      // 4️⃣ Rename columns (like your C# DataTable)
      const formattedData = canceledInvoices.map((row) => ({
        "बिल बुक क्रं.": row.BillBookNo,
        "पावती क्र.": row.InvoiceNo,
        "टिप्पणी/शेरा": row.Remark,
        "कर्मचाऱ्याचे नाव": row.EmpName,
        वर्ष: row.Year,
      }));

      // 5️⃣ Send response
      res.status(200).json(formattedData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTransactionReport = async (req, res) => {
  try {
    console.log("getTransactionReport", req.body);
    const { wardNo, year, demand } = req.body;
    if (!wardNo || wardNo.length === 0)
      return res.status(400).json({ message: "Please select ward numbers" });

    // Format ward numbers for SQL IN clause
    const wardsStr = wardNo.map((w) => `'${w}'`).join(",");

    // Build query depending on Current or Pending
    let whereClause = `bill.FinanceYear='${year}' AND pm.NewWardNo IN (${wardsStr})`;
    if (demand === "Current") {
      whereClause += ` AND bill.PendingYear='${year}'`;
    } else {
      whereClause += ` AND bill.PendingYear='${year - 1}'`;
    }

    // Construct raw SQL with formatted column names
    const sql = `
      SELECT
        pm.NewWardNo AS "वॉर्ड नं.",
        pm.NewPropertyNo AS "मालमत्ता नं.",
        pm.NewPartitionNo AS "पार्टीशन नं.",
        pm.OwnerName AS "मालमत्ता धारकाचे नाव",
        OwnerRenterNM.MarathiOwnerName AS "मराठी मालमत्ता धारकाचे नाव",
        OwnerRenterNM.RenterName AS "भोगवटदाराचे नाव",
        OwnerRenterNM.MarathiRenterName AS "मराठी भोगवटदाराचे नाव",
        bill.BillBookNo AS "बिल बुक नं.",
        bill.InvoiceNo AS "पावती क्रं.",
        bill.PropertyTax AS "मालमत्ता कर/PropertyTax",
        bill.Tax1 AS "टॅक्स १/Tax1",
        bill.EducationTax AS "शिक्षन कर/EducationTax",
        bill.EmploymentTax AS "रोजगार कर/EmploymentTax",
        bill.TreeCess AS "वृक्ष कर/TreeCess",
        bill.SpWaterCess AS "वि.पाणीपट्टी कर/SpWaterCess",
        bill.Sanitation AS "मल निसारण कर/Sanitation",
        bill.DrainCess AS "नाली कर/DrainCess",
        bill.RoadCess AS "रस्ता कर/RoadCess",
        bill.FireCess AS "अग्निशामक कर/FireCess",
        bill.LightCess AS "दिवाबत्ती/LightCess",
        bill.WaterBenefit AS "पाणीपट्टी लाभकर/WaterBenefit",
        bill.MajorBuilding AS "शास्ती/MajorBuilding",
        bill.SewageDisposalCess AS "वि.स्वच्छता कर/SewageDisposalCess",
        bill.SpEducationTax AS "महा.शिक्षन कर/SpEducationTax",
        bill.WaterBill AS "पाणीपट्टी कर/WaterBill",
        bill.TaxTotal AS "एकूण/TaxTotal",
        bill.Interest AS "शास्ती/Interest",
        bill.Discount AS "सवलत/Discount",
        bill.Noticefee AS "नोटीस फी/Noticefee",
        bill.WarrentFee AS "वॉरंट फी/WarrentFee",
        bill.MiscellaneousFee AS "इतर वसुली/MiscellaneousFee",
        bill.NetTotal AS "निव्वळ एकूण/NetTotal",
        bill.PaymentType AS "व्यवहाराचा प्रकार",
        ${
          demand === "Current" ? "bill.FinanceYear" : "bill.PendingYear"
        } AS "वर्ष"
      FROM PropertyMast AS pm
      INNER JOIN billtransactiondetails AS bill ON pm.OwnerID = bill.OwnerID
      LEFT JOIN combinedownerrenternames AS OwnerRenterNM ON pm.OwnerID = OwnerRenterNM.OwnerID
      WHERE ${whereClause}
      ORDER BY pm.NewWardNo, pm.NewPropertyNo, pm.NewPartitionNo
    `;

    const transactions = await sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });
    console.log("Transactions fetched:", transactions);
    return res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAdvanceAndBillBookReport = async (req, res) => {
  try {
    const { activePanel, wardNo, year } = req.body;

    if (!wardNo || wardNo.length === 0) {
      return res.status(400).json({ message: "Please select ward numbers" });
    }

    // Format ward numbers for SQL IN clause
    const wardsStr = wardNo.map((w) => `'${w}'`).join(",");
    let sql;
    if (activePanel == "advancePaymentReport") {
      sql = `
      SELECT
        pm.NewWardNo AS "वॉर्ड नं.",
        pm.NewPropertyNo AS "मालमत्ता नं.",
        pm.NewPartitionNo AS "पार्टीशन नं.",
         pm.OwnerName AS "मालमत्ता धारकाचे नाव",
        OwnerRenterNM.MarathiOwnerName AS "मराठी मालमत्ता धारकाचे नाव",
        OwnerRenterNM.RenterName AS "भोगवटदाराचे नाव",
        OwnerRenterNM.MarathiRenterName AS "मराठी भोगवटदाराचे नाव",
        bill.BillBookNo AS "बिल बुक नं.",
        bill.InvoiceNo AS "पावती क्रं.",
        bill.PropertyTax AS "मालमत्ता कर/PropertyTax",
        bill.Tax1 AS "टॅक्स १/Tax1",
        bill.EducationTax AS "शिक्षन कर/EducationTax",
        bill.EmploymentTax AS "रोजगार कर/EmploymentTax",
        bill.TreeCess AS "वृक्ष कर/TreeCess",
        bill.SpWaterCess AS "वि.पाणीपट्टी कर/SpWaterCess",
        bill.Sanitation AS "मल निसारण कर/Sanitation",
        bill.DrainCess AS "नाली कर/DrainCess",
        bill.RoadCess AS "रस्ता कर/RoadCess",
        bill.FireCess AS "अग्निशामक कर/FireCess",
        bill.LightCess AS "दिवाबत्ती/LightCess",
        bill.WaterBenefit AS "पाणीपट्टी लाभकर/WaterBenefit",
        bill.MajorBuilding AS "शास्ती/MajorBuilding",
        bill.SewageDisposalCess AS "वि.स्वच्छता कर/SewageDisposalCess",
        bill.SpEducationTax AS "महा.शिक्षन कर/SpEducationTax",
        bill.WaterBill AS "पाणीपट्टी कर/WaterBill",
        bill.TaxTotal AS "एकूण/TaxTotal",
        bill.Interest AS "शास्ती/Interest",
        bill.Discount AS "सवलत/Discount",
        bill.Noticefee AS "नोटीस फी/Noticefee",
        bill.WarrentFee AS "वॉरंट फी/WarrentFee",
        bill.MiscellaneousFee AS "इतर वसुली/MiscellaneousFee",
        bill.NetTotal AS "निव्वळ एकूण/NetTotal",
        bill.PaymentType AS "व्यवहाराचा प्रकार",
        bill.FinanceYear AS "वर्ष"
      FROM propertymast AS pm
      INNER JOIN billtransactiondetailsadvance AS bill
        ON pm.OwnerID = bill.OwnerID
      LEFT JOIN combinedownerrenternames AS OwnerRenterNM
        ON pm.OwnerID = OwnerRenterNM.OwnerID
      WHERE bill.FinanceYear='${year}' AND pm.NewWardNo IN (${wardsStr})
      ORDER BY pm.NewWardNo, pm.NewPropertyNo, pm.NewPartitionNo
    `;
    } else if (activePanel == "billBookList") {
      sql = `select BillBookNo AS "बिल बुक क्रं.",ReceiptNoFrom
    AS "पावती क्र.पासुन" ,ReceiptNoTo AS "पावती क्र.पर्यंत ",EmpName AS "कर्मचाऱ्याचे नाव",Year AS "वर्ष"
    from billbookmaster where Year ='${year}' order by billbookmaster.BillBookNo`;
    }

    // Execute the query
    const transactions = await sequelize.query(sql, {
      type: Sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
