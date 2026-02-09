


import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const NPTitle = req.body.NPTitle || "Council";

    // ✅ CORRECT E-drive path
    const uploadFilePath = path.resolve(
      `E:/Owner_Mutation_Documents/Council/${NPTitle}/Mutation_Property_Docs`
    );

    // ensure folder exists
    if (!fs.existsSync(uploadFilePath)) {
      fs.mkdirSync(uploadFilePath, { recursive: true });
    }

    cb(null, uploadFilePath);
  },

  filename: (req, file, cb) => {
    const NPTitle = req.body.NPTitle || "Council";
    const wardNo = req.body.WardNo || "UnknownWard";
    const propertyNo = req.body.PropertyNo || "UnknownProp";
    const partitionNo = req.body.PartitionNo;
    const ext = path.extname(file.originalname);

    const baseName =
      partitionNo && partitionNo.trim() !== ""
        ? `${NPTitle}_${wardNo}_${propertyNo}_${partitionNo}`
        : `${NPTitle}_${wardNo}_${propertyNo}`;

    let finalName = baseName + ext;

    const targetDir = path.resolve(
      `E:/Owner_Mutation_Documents/Council/${NPTitle}/Mutation_Property_Docs`
    );

    // avoid overwrite
    let counter = 1;
    while (fs.existsSync(path.join(targetDir, finalName))) {
      finalName = `${baseName}_${counter}${ext}`;
      counter++;
    }

    cb(null, finalName);
  },
});

export const upload = multer({ storage });
