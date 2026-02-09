// controllers/utility/uploadPhotoAndPlanController.js
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { Op, where } from 'sequelize';
import PropertyImageMast from '../../models/models/propertyimagesmast.js';
import PropertyMast from '../../models/models/propertymast.js';

export const uploadFolder = async (req, res) => {

    // Expecting req.body.files = [{ name, mime, base64, ... }, ...]
    const files = Array.isArray(req.body?.files)
        ? req.body.files
        : Array.isArray(req.body?.files?.files) ? req.body.files.files : [];

    console.log(files, 'files in backend');

    const isNum = (s) => /^\d+$/.test(String(s || '').trim());
    let ErrorProperties = []
    try {
        // slot -> DB field
        const pathFieldMap = {
            A: 'PropertyPathA',
            B: 'PropertyPathB',
            C: 'PropertyPathC',
            D: 'PropertyPathD',
            plan: 'PlanPath'
        };

        // UNC base paths (these worked in your logs)
        const BASE_IMAGE_PATH = '\\\\192.168.5.244\\e$\\NTIS_New_Images';

        const COMMON_IMAGE_PATH = path.join(BASE_IMAGE_PATH, 'Image/Photo');
        const PLAN_IMAGE_PATH = path.join(BASE_IMAGE_PATH, 'Image/Plan');

        // Access check (log only)
        fs.access(
            COMMON_IMAGE_PATH,
            fs.constants.R_OK | fs.constants.W_OK,
            (err) => {
                if (err) {
                    console.error(':x: No access to:', COMMON_IMAGE_PATH);
                    console.error(err.message);
                } else {
                    console.log(':white_check_mark: Controller has read/write access to:', COMMON_IMAGE_PATH);
                }
            }
        );

        for (const file of files) {
            const { name, mime, base64 } = file || {};
            if (!name || !base64) {
                console.warn('⚠️ Missing name/base64 on item, skipping');
                continue;
            }

            // ------- parse filename -------
            // Supported:
            //   W-P-PP-A.jpg   (partition present)
            //   W-P-A.jpg      (partition missing -> treat as 0)
            //   W-P-Plan.wmf   (plan)
            const baseName = name.trim();
            const nameNoExt = baseName.replace(/\.[^.]+$/, ''); // strip extension
            const parts = nameNoExt.split('-');                // ['20','20','20','A'] or ['20','20','A'] or ['20','20','Plan']

            if (parts.length < 3) {
                console.log(baseName, 'invalid file name');
                continue;
            }

            const NewWardNo = parts[0];
            const NewPropertyNo = parts[1];
            let NewPartitionNo = ''; // default if omitted
            let PhotoSlot = 'plan';


            const lastToken = (parts[parts.length - 1] || '').toUpperCase();

            if (['A', 'B', 'C', 'D'].includes(lastToken)) {
                PhotoSlot = lastToken;
                // If we have 4 parts: W-P-PP-A; else W-P-A (no partition)
                NewPartitionNo = (parts.length === 4 ? parts[2] : '');
            } else if (lastToken === 'PLAN') {
                PhotoSlot = 'plan';
                NewPartitionNo = ''; // plan ignores partition
            } else {
                // Unknown last token -> treat as plan (your earlier rule)
                PhotoSlot = 'plan';
                NewPartitionNo = (parts.length >= 3 ? parts[2] : '');
            }

            const isPlan = (PhotoSlot === 'plan');
            const pathField = pathFieldMap[PhotoSlot];

            // ------- decode base64 data URL -------
            const m = String(base64).match(/^data:[^;]+;base64,(.+)$/);
            const payload = m ? m[1] : base64;            // allow both with/without dataURL prefix
            let decodedBuffer;
            try {
                decodedBuffer = Buffer.from(payload, 'base64'); // use global Buffer
            } catch (e) {
                console.warn('⚠️ Invalid base64 for', baseName, e.message);
                continue;
            }

            // ------- write file to disk -------
            const targetDir = isPlan ? PLAN_IMAGE_PATH : COMMON_IMAGE_PATH;
            const fileName = baseName; // keep incoming name as you did
            const newFilePath = path.join(targetDir, fileName);
            fs.mkdirSync(targetDir, { recursive: true });

            try {
                fs.writeFileSync(newFilePath, decodedBuffer);
                console.log(`✅ Saved file: ${newFilePath}`);
            } catch (e) {
                console.error(`❌ Write failed for ${newFilePath}:`, e.message);
                continue;
            }

            // ------- find owner id -------
            if (!isNum(NewWardNo) || !isNum(NewPropertyNo)) {
                console.log(NewWardNo, NewPropertyNo, NewPartitionNo, 'invalid ward/property');
                continue;
            }

            // When partition missing -> allow 0/null/''
            const partWhere =
                NewPartitionNo === '' || NewPartitionNo == null
                    ? { [Op.or]: [0, null, ''] }
                    : Number(NewPartitionNo);

            const ownerRow = await PropertyMast.findOne({
                attributes: ['OwnerID', 'NewWardNo', 'NewPropertyNo', 'NewPartitionNo'],
                where: {
                    NewWardNo: Number(NewWardNo),
                    NewPropertyNo: Number(NewPropertyNo),
                    NewPartitionNo: partWhere
                },
                raw: true
            });

            console.log('Found OwnerID:', ownerRow ? ownerRow.OwnerID : 'Not found');

            if (!ownerRow?.OwnerID) {
                const data = {
                    NewWardNo: Number(NewWardNo),
                    NewPropertyNo: Number(NewPropertyNo),
                    NewPartitionNo: partWhere.NewPartitionNo || 0,
                    Name: name,
                }
                ErrorProperties.push(data);
                continue;
            }

            // ------- update/create image path in DB -------
            // store relative path (your earlier convention used backslashes)
            const storedPath = isPlan
                ? `\\Image\\Plan\\${fileName}`
                : `\\Image\\Photo\\${fileName}`;

            const updateData = {
                ownerid: ownerRow.OwnerID,
                [pathField]: storedPath
            };

            // Update if exists, else create
            const imageRecord = await PropertyImageMast.findOne({
                where: { ownerid: ownerRow.OwnerID }
            });

            console.log('Updated data:', baseName);

            if (imageRecord) {
                console.log('Updating existing record with data:', updateData);
                // update returns [affectedCount]
                const [affected] = await PropertyImageMast.update(updateData, {
                    where: { ownerid: ownerRow.OwnerID }
                });

                if (!affected) {
                    console.error(':x: No rows updated. Possible constraints issue.');
                } else {
                    console.log(`:white_check_mark: Updated ${affected} row(s) for OwnerID ${ownerRow.OwnerID}`);
                }
            } else {
                // create returns the instance (not [count])
                console.log('Creating new record with data:', updateData);
                await PropertyImageMast.create({
                    ...updateData,
                    CreatedBy: ownerRow.OwnerID,
                    CreatedDate: new Date(),
                    UpdatedBy: ownerRow.OwnerID,
                    UpdatedDate: new Date()
                });
                console.log(`:white_check_mark: Created record for OwnerID ${ownerRow.OwnerID}`);
            }
        }

        return res.json({ ok: true, message: ErrorProperties.length ? { message: 'Some files processed with errors', errors: ErrorProperties } : { message: 'All files processed successfully' } });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ ok: false, message: e.message });
    }
};


const BASE_IMAGE_PATH =  '\\\\192.168.5.244\\e$\\NTIS_New_Images';


// Pick a reasonable mime type by file extension
const guessMime = (p) => {
    const ext = String(path.extname(p) || '').toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.gif': return 'image/gif';
        case '.webp': return 'image/webp';
        case '.bmp': return 'image/bmp';
        case '.svg': return 'image/svg+xml';
        case '.wmf': return 'image/x-wmf'; // some browsers won’t preview this, but it’s fine for data transport
        default: return 'application/octet-stream';
    }
};

const toDataUrl = (absPath) => {
    const buf = fs.readFileSync(absPath);
    const mime = guessMime(absPath);
    return `data:${mime};base64,${buf.toString('base64')}`;
};

// Normalize relative path strings coming from DB and join with base
const safeJoinBase = (rel) => {
    const cleaned = String(rel || '')
        .replace(/^([/\\])+/, '')      // strip leading slashes/backslashes
        .replace(/\\/g, '/');          // normalize to forward slashes
    return path.join(BASE_IMAGE_PATH, cleaned);
};

// Fields we care about
const IMAGE_FIELDS = ['PropertyPathA', 'PropertyPathB', 'PropertyPathC', 'PropertyPathD', 'PlanPath'];

export const getImages = async (req, res) => {
    try {
        // Accept either { ownerIds: [...] } or raw array [...]
        const raw = Array.isArray(req.body) ? req.body : (req.body?.ownerIds || req.body?.OwnerIDs || []);
        const ownerIds = (raw || [])
            .map((v) => (typeof v === 'object' ? v?.OwnerID ?? v?.ownerid : v))
            .filter((v) => v !== undefined && v !== null);

        if (!Array.isArray(ownerIds) || ownerIds.length === 0) {
            return res.status(400).json({ ok: false, message: 'Provide ownerIds as an array.' });
        }

        // Fetch all in one query
        const rows = await PropertyImageMast.findAll({
            where: { ownerid: { [Op.in]: ownerIds } },
            raw: true
        });

        // Index by ownerid for quick lookup
        const byOwner = new Map(rows.map((r) => [String(r.ownerid), r]));

        // Build response per OwnerID
        const result = {};
        for (const id of ownerIds) {
            const key = String(id);
            const rec = byOwner.get(key);

            // Default all to null
            result[key] = {
                PropertyPathA: null,
                PropertyPathB: null,
                PropertyPathC: null,
                PropertyPathD: null,
                PlanPath: null
            };

            if (!rec) {
                // Not found — leave nulls and continue
                // console.warn(`No propertyimagesmast row for OwnerID ${key}`);
                continue;
            }

            for (const field of IMAGE_FIELDS) {
                const rel = rec[field];
                if (!rel) {
                    result[key][field] = null;
                    continue;
                }

                const full = safeJoinBase(rel);
                try {
                    if (fs.existsSync(full)) {
                        result[key][field] = toDataUrl(full);
                    } else {
                        // console.warn(`File not found for ${field} of OwnerID ${key}: ${full}`);
                        result[key][field] = null;
                    }
                } catch (e) {
                    // console.error(`Error reading ${full} for OwnerID ${key}:`, e);
                    result[key][field] = null;
                }
            }
        }

        return res.status(200).json({ ok: true, images: result });
    } catch (err) {
        console.error('getImages error:', err);
        return res.status(500).json({ ok: false, message: 'Failed to fetch images.' });
    }
};

export const deleteImages = async (req, res) => {
  const { idsToDelete, imagesToDelete } = req.body || {};
  // Basic validation
  if (!Array.isArray(idsToDelete) || idsToDelete.length === 0) {
    return res.status(400).json({ ok: false, message: 'idsToDelete must be a non-empty array' });
  }
  if (!imagesToDelete || typeof imagesToDelete !== 'object') {
    return res.status(400).json({ ok: false, message: 'imagesToDelete must be an object of booleans' });
  }

  // Map UI flags -> DB path fields
  const FLAG_TO_DB_FIELD = {
   
    // If frontend already sends DB field names, this keeps them valid too:
    PropertyPathA:  'PropertyPathA',
    PropertyPathB:  'PropertyPathB',
    PropertyPathC:  'PropertyPathC',
    PropertyPathD:  'PropertyPathD',
    PlanPath:       'PlanPath',
  };

  // Select only the fields the user wants to delete
  const fieldsToDelete = Object.entries(imagesToDelete)
    .filter(([, v]) => Boolean(v))
    .map(([k]) => FLAG_TO_DB_FIELD[k])
    .filter(Boolean);

  if (fieldsToDelete.length === 0) {
    return res.status(400).json({ ok: false, message: 'No image types selected to delete' });
  }

  // Base dirs
  const BASE_IMAGE_PATH = '\\\\192.168.5.244\\e$\\NTIS_New_Images';

  // Helper: normalize a stored relative path into an absolute filesystem path
  const toFullPath = (relativePath) => {
    if (!relativePath) return null;
    // stored DB value might be like "\Image\Photo\1-1-1-A.jpg" or "Image/Photo/..."
    const cleaned = String(relativePath)
      .replace(/^[\\/]+/, '')            // drop leading slashes
      .replace(/\//g, path.sep)          // normalize forward slashes on Windows
      .replace(/\\/g, path.sep);         // normalize backslashes too (idempotent)
    return path.join(BASE_IMAGE_PATH, cleaned);
  };

  const results = []; // collect per-owner summary

  try {
    for (const id of idsToDelete) {
      // Adjust column name if your model uses lowercase (ownerid) instead of OwnerID.
      const rec = await PropertyImageMast.findOne({
        where: { ownerid: id },
        raw: true
      });

      if (!rec) {
        results.push({ ownerId: id, ok: false, reason: 'no record', deleted: [] });
        continue;
      }

      const updateObj = {};
      const perOwnerDeleted = [];

      for (const field of fieldsToDelete) {
        const rel = rec[field]; // e.g. "\Image\Photo\1-1-1-A.jpg"
        if (!rel) {
          perOwnerDeleted.push({ field, ok: false, reason: 'no path set' });
          updateObj[field] = null; // still clear the DB field
          continue;
        }

        const full = toFullPath(rel);
        try {
          // Check existence before unlink to avoid noisy errors
          if (full && fs.existsSync(full)) {
            await fsp.unlink(full);
            perOwnerDeleted.push({ field, ok: true, file: full });
          } else {
            perOwnerDeleted.push({ field, ok: false, reason: 'file not found', file: full });
          }
          // Clear the DB field regardless
          updateObj[field] = null;
        } catch (e) {
          perOwnerDeleted.push({ field, ok: false, reason: e.message });
          // still attempt to clear path so UI reflects it’s gone/cleared
          updateObj[field] = null;
        }
      }

      // Persist cleared fields
      try {
        await PropertyImageMast.update(updateObj, { where: { ownerid: id } });
        results.push({ ownerId: id, ok: true, deleted: perOwnerDeleted });
      } catch (e) {
        results.push({ ownerId: id, ok: false, reason: 'db update failed', error: e.message, deleted: perOwnerDeleted });
      }
    }

    return res.status(200).json({ ok: true, results });
  } catch (err) {
    console.error('deleteImages fatal error:', err);
    return res.status(500).json({ ok: false, message: err.message });
  }
};