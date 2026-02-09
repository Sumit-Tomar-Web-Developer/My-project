// import express from "express";
// import { getCouncilInfo, saveCouncilInfo, upload } from "../../controllers/master/councilDetailsController.js";



// const router = express.Router();

// router.get("/fetchCouncilInfo", getCouncilInfo);


// // Optional middleware to log the uploaded file
// const logFileMiddleware = (req, res, next) => {
//   if (req.file) {
//     console.log("File received by multer:", req.file);
//   } else {
//     console.log("No file received");
//   }
//   next();
// };

// // Route for saving/updating council info with file upload
// router.post(
//   "/saveCouncilInfo", 
//   upload.single("NPImage"), 
//   logFileMiddleware,
//   saveCouncilInfo
// );


// export default router;

import express from 'express';


import { getCouncilInfo, saveCouncilInfo } from '../../controllers/master/councilDetailsController.js';
import {uploadCouncilFiles} from '../../config/CouncilMulter.js';
 
const router = express.Router();

// Get council info
router.get('/fetchCouncilInfo', getCouncilInfo);

// Save/update council info with all file uploads
router.post(
  '/saveCouncilInfo',
  uploadCouncilFiles,   // handles NPImage, NPIcon, ThirdPartyImage, ThirdPartyIcon
  saveCouncilInfo
);

export default router;
