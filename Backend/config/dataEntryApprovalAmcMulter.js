import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadFilePath = path.resolve("E:/NTIS_Uploads_approval/wadhghat_dataEntryApproval");
//const uploadFilePath = path.resolve("C:/NTIS_Uploads_approval/wadhghat_dataEntryApproval");

if (!fs.existsSync(uploadFilePath)) {
  fs.mkdirSync(uploadFilePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, uploadFilePath); },
  filename: (req, file, cb) => { cb(null, file.originalname); }
});


export const uploadDataEntryApproval = multer({ storage }).array('file', 10);