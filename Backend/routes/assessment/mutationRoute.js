import express from "express";
import {
  postOwnerIdSelectionMutationHistory,
  postMutationDetails,
  postUpdatedMutationData,
  updateJoinOwnerAndPropertyMastDetails,
  uploadMutationDocument,
  getNpTitle,
} from "../../controllers/assessment/mutationController.js";
import { upload } from "../../config/multer.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
router.post("/mutation-transfer-details", postOwnerIdSelectionMutationHistory);
router.post("/mutation-details-new-data", postMutationDetails);
router.post("/mutation-updated-details", postUpdatedMutationData);
router.post(
  "/mutation-update-joint-owner-propertymast",
  updateJoinOwnerAndPropertyMastDetails
);
router.post("/mutation-upload",upload.single("file"), uploadMutationDocument )

// GET NPTitle (always fetches AssessmentID=1 for now)
router.get("/npTitle", getNpTitle);




// ✅ NEW: Serve mutation documents back
// router.get("/mutation/document/:filename", (req, res) => {
//   const filePath = path.join(__dirname, "../uploads/mutation", req.params.filename);

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ error: "File not found" });
//   }

//   res.setHeader("Content-Type", "application/pdf");
//   res.setHeader("Content-Disposition", "inline");

//   fs.createReadStream(filePath).pipe(res);
// });




export default router;
