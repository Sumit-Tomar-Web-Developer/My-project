
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ✅ FORCE ONLY E DRIVE
const basePath = 'E:/FerFar_Documents/ferfar-mutation';

// ❌ Fail fast if E: is not available
if (!fs.existsSync('E:/')) {
  throw new Error('❌ E: drive not available on server');
}
// Ensure the folder exists
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, basePath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Accept multiple files
export const uploadFerFarMutation = multer({ storage }).array('file', 10);

console.log('Upload folder:', basePath);

