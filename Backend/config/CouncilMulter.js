

import multer from "multer";
import fs from "fs";
import path from "path";

const ensureFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const baseDrive = "E:";

if (!fs.existsSync("E:/")) {
  throw new Error("❌ E: drive not available on server");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!file) return cb(null, false);

    console.log(req.body?.NPTitle, "NP PAROL");

    const npTitle = req.body?.NPTitle || "Council";
    const basePath = path.join(baseDrive, "Council_Images", "Council", npTitle);

    let folderPath = basePath;

    switch (file.fieldname) {
      case "NPImage":
        folderPath = path.join(basePath, "NPImage");
        break;
      case "NPIcon":
        folderPath = path.join(basePath, "NPIcon");
        break;
      case "ThirdPartyImage":
        folderPath = path.join(basePath, "ThirdPartyProvider", "ThirdPartyImage");
        break;
      case "ThirdPartyIcon":
        folderPath = path.join(basePath, "ThirdPartyProvider", "ThirdPartyIcon");
        break;
    }

    ensureFolder(folderPath);
    cb(null, folderPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + path.extname(file.originalname);

    // ✅ Full path of the file to check
    const npTitle = req.body?.NPTitle || "Council";
    let folderPath = path.join(baseDrive, "Council_Images", "Council", npTitle);

    switch (file.fieldname) {
      case "NPImage":
        folderPath = path.join(folderPath, "NPImage");
        break;
      case "NPIcon":
        folderPath = path.join(folderPath, "NPIcon");
        break;
      case "ThirdPartyImage":
        folderPath = path.join(folderPath, "ThirdPartyProvider", "ThirdPartyImage");
        break;
      case "ThirdPartyIcon":
        folderPath = path.join(folderPath, "ThirdPartyProvider", "ThirdPartyIcon");
        break;
    }

    const fullPath = path.join(folderPath, fileName);

    
    setTimeout(() => {
      console.log("File will exist here:", fullPath, fs.existsSync(fullPath));
    }, 500); 

    cb(null, fileName);
  },
});

// Multer instance for multiple fields
export const uploadCouncilFiles = multer({ storage }).fields([
  { name: "NPImage", maxCount: 1 },
  { name: "NPIcon", maxCount: 1 },
  { name: "ThirdPartyImage", maxCount: 1 },
  { name: "ThirdPartyIcon", maxCount: 1 },
]);

console.log("Council upload base folder:", path.join(baseDrive, "Council_Images"));
