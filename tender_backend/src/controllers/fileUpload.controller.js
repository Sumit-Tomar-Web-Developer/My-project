const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { FileUpload } = require('../models');
const { API_STATUS } = require('../utilities/utils');
const { authenticate } = require('../middlewares/auth.middleware');

const storage = multer.diskStorage({
  destination: config.fileUpload.path,
  filename: (req, file, cb) => {
    // generate a UUID, keep original extension
    const ext = path.extname(file.originalname);
    const guid = uuidv4();
    cb(null, guid + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: config.fileUpload.maxSize ||  1024 * 1024 * 50 } // Default to 50 MB if not set
});



/**
 * @swagger
 * /files/:
 *   post:
 *     summary: Upload a file
 *     tags:
 *       - File Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guid:
 *                   type: string
 *                   description: Unique identifier for the uploaded file
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

exports.router = router => {
 
  router.post('/', authenticate, upload.single('file'), async (req, res, next) => {
    try {
      // Remove the file extension from the UUID
      const guid = path.parse(req.file.filename).name;

      const rec = await FileUpload.create({
        guid: guid, // Save guid without extension
        fileName: req.file.originalname
      });

      res.json({
        type: API_STATUS.SUCCESS,
        message: 'File uploaded successfully',
        data: {
          guid: rec.guid // Return guid without extension
        }
      }); // Return guid without extension
    } catch (err) {
      next(err);
    }
  });


  /**
   * @swagger
   * /files/{tenderid}:
   *   post:
   *     summary: Upload a file for a specific tender
   *     tags:
   *       - File Upload
   *     parameters:
   *       - in: path
   *         name: tenderid
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the tender
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: File uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 guid:
   *                   type: string
   *                   description: Unique identifier for the uploaded file
   *       400:
   *         description: Bad request
   *       500:
   *         description: Internal server error
   */
  router.post('/:tenderid', authenticate, upload.single('file'), async (req, res, next) => {
    try {
      const tenderId = req.params.tenderid;
      const tenderFolderPath = path.join(config.fileUpload.path, tenderId);

      // Check if the folder exists, if not, create it
      if (!fs.existsSync(tenderFolderPath)) {
        fs.mkdirSync(tenderFolderPath, { recursive: true });
      }

      // Generate a UUID and remove the file extension
      const guid = path.parse(req.file.filename).name;

      // Move the uploaded file to the tender-specific folder
      const filePath = path.join(tenderFolderPath, req.file.filename);
      fs.renameSync(req.file.path, filePath);

      const rec = await FileUpload.create({
        guid: guid, // Save guid without extension
        fileName: req.file.originalname,
        tenderId: tenderId // Optionally associate the file with the tenderId
      });

      res.json({
        type: API_STATUS.SUCCESS,
        message: 'File uploaded successfully',
        data: {
          guid: rec.guid // Return guid without extension
        }
      });
    } catch (err) {
      next(err);
    }
  });

  /**
   * @swagger
   *   /files/{guid}:
   *   get:
   *     summary: Download a file by GUID
   *     tags:
   *       - File Upload
   *     parameters:
   *       - in: path
   *         name: guid
   *         required: true
   *         schema:
   *           type: string
   *         description: Unique identifier of the file
   *     responses:
   *       200:
   *         description: File downloaded successfully
   *         content:
   *           application/octet-stream:
   *             schema:
   *               type: string
   *               format: binary
   *       404:
   *         description: File not found
   *       500:
   *         description: Internal server error
   */
  router.get('/:guid', authenticate, async (req, res, next) => {
    try {
      const rec = await FileUpload.findOne({ where: { guid: req.params.guid } });
      if (!rec) return res.sendStatus(404);

      res.download(
        path.join(config.fileUpload.path, `${rec.guid}${path.extname(rec.fileName)}`),
        rec.fileName
      );
    } catch (err) {
      next(err);
    }
  });

  /**
   * @swagger
   *   /files/{guid}/{tenderid}:
   *   get:
   *     summary: Download a file by GUID and tender id
   *     tags:
   *       - File Upload
   *     parameters:
   *       - in: path
   *         name: tenderid
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the tender
   *       - in: path
   *         name: guid
   *         required: true
   *         schema:
   *           type: string
   *         description: Unique identifier of the file
   *     responses:
   *       200:
   *         description: File downloaded successfully
   *         content:
   *           application/octet-stream:
   *             schema:
   *               type: string
   *               format: binary
   *       404:
   *         description: File not found
   *       500:
   *         description: Internal server error
   */
  router.get('/:guid/:tenderid', async (req, res, next) => {
    try {
      //

      const rec = await FileUpload.findOne({ where: { guid: req.params.guid } });
      if (!rec) return res.sendStatus(404);
      const tenderFolderPath = path.join(config.fileUpload.path, req.params.tenderid);
      res.download(
       
        path.join(tenderFolderPath, `${rec.guid}${path.extname(rec.fileName)}`),
        rec.fileName
      );
    } catch (err) {
      next(err);
    }
  });
};