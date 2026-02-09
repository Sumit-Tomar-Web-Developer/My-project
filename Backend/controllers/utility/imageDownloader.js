import sequelize from "../../config/connectionDB.js";
import PropertyMast from "../../models/models/propertymast.js";
import PropertyImageMast from "../../models/models/propertyimagesmast.js";
import { Op, where, cast, col } from "sequelize";
import fs from "fs";
import path from "path";


export const getPropertyImages = async (req, res) => {
  const { ward, fromPropertyNo, toPropertyNo } = req.query;
  console.log(
    "getPropertyImages req query:",
    ward,
    fromPropertyNo,
    toPropertyNo
  );


  if (!ward || !fromPropertyNo || !toPropertyNo) {
    return res.status(400).json({ error: "Missing property numbers or ward" });
  }


  // Split property numbers
  const [fromBase, fromPartRaw] = fromPropertyNo.split("-");
  const [toBase, toPartRaw] = toPropertyNo.split("-");
  const fromPart = fromPartRaw || "";
  const toPart = toPartRaw || "";
  console.log("FromBase:", fromBase, "ToBase:", toBase);
  console.log("FromPart:", fromPart, "ToPart:", toPart);


  try {
    // Fetch all OwnerIDs from PropertyMast
    const propertyMast = await PropertyMast.findAll({
      attributes: ["OwnerID"],
      where: {
        NewWardNo: ward,
        [Op.and]: [
          // CAST(NewPropertyNo AS UNSIGNED) BETWEEN fromBase AND toBase
          where(cast(col("NewPropertyNo"), "UNSIGNED"), {
            [Op.between]: [fromBase, toBase],
          }),


          // Handle NewPartitionNo cases
          {
            [Op.or]: [
              { NewPartitionNo: null }, // IS NULL
              { NewPartitionNo: "" }, // empty string
              where(cast(col("NewPartitionNo"), "UNSIGNED"), {
                [Op.between]: [fromPart, toPart],
              }),
            ],
          },
        ],
      },
      raw: true,
    });


    if (!propertyMast.length) {
      console.log("No ownerIDs found in this range", propertyMast);
      return res
        .status(404)
        .json({ message: "No ownerIDs found in this property range" });
    }


    const ownerIds = propertyMast.map((record) => record.OwnerID);


    // Fetch images for all ownerIds
    const propertyImageMast = await PropertyImageMast.findAll({
      where: { ownerid: { [Op.in]: ownerIds } },
      raw: true,
    });


    if (!propertyImageMast.length) {
      return res
        .status(404)
        .json({ message: "OwnerIDs exist but no property images found" });
    }


    const imageFields = [
      "PropertyPathA",
      "PropertyPathB",
      "PropertyPathC",
      "PropertyPathD",
      "PlanPath",
    ];
    //C:/ntis
    //192.168.5.104/d$/NTIS_New_Images
    const BASE_IMAGE_PATH = path.resolve('//192.168.5.244/e$/NTIS_New_Images');
    console.log("BASE_IMAGE_PATH", BASE_IMAGE_PATH);


    // Collect images per owner
    const allImages = propertyImageMast
      .map((record) => {
        const images = {};


        for (const field of imageFields) {
          const relativePath = record[field];
          if (relativePath) {
            const fullPath = path.join(BASE_IMAGE_PATH, relativePath);
            if (fs.existsSync(fullPath)) {
              const imageBuffer = fs.readFileSync(fullPath);
              const base64Image = imageBuffer.toString("base64");
              // Include both base64 data and file name
              images[field] = {
                fileName: path.basename(relativePath),
                data: `data:image/jpeg;base64,${base64Image}`,
              };
              console.warn(`File found: ${fullPath}`);
            } else {
              console.warn(`File not found: ${fullPath}`);
              //   // images[field] = null;
            }
          }
          // else {
          // images[field] = null;
          // }
        }
        // Only return owner if at least one image exists
        if (Object.keys(images).length > 0) {
          // return { ownerid: record.ownerid, images };
          return { images };
        } else {
          return null; // skip this owner
        }
      })
      .filter(Boolean); //removes all null values


    return res.status(200).json({
      inRangeImages: allImages,
    });
  } catch (error) {
    console.warn("Error in getPropertyImages", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


