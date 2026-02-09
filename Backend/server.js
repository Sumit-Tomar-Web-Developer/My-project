



import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from "fs";

const app = express();
const port = process.env.PORT || 4000;

// ---------- CORS (IMPORTANT) ----------
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
  })
);
// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });
// app.disable("x-powered-by"); // removes Express header
// app.use((req, res, next) => {
//   res.setHeader("X-Powered-By", "Express");
//   next();
// });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDrive = "E:";

const councilFolder = path.join(baseDrive, "Council_Images");

app.use("/Council", express.static(path.join(councilFolder, "Council")));

app.use(
  "/Tax_Assessment_NTIS_Backend/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);
//app.use(
  //"/Tax_Assessment_NTIS_Backend/uploadDataEntryApproval",
 //express.static(path.join(process.cwd(), "uploadDataEntryApproval"))
//);
app.use(
  "/Owner_Mutation_Documents",
  express.static("E:/Owner_Mutation_Documents")
);
app.use('/Tax_Assessment_NTIS_Backend/FerFar_Documents', express.static('E:/FerFar_Documents'));

app.use('/Tax_Assessment_NTIS_Backend/NTIS_Uploads_approval', express.static('E:/NTIS_Uploads_approval'));

app.use('/Tax_Assessment_NTIS_Backend/NTIS_Images', express.static('\\\\192.168.5.244\\E$\\NTIS_New_Images'));

app.use(express.json({ limit: '50mb' })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Increase URL-encoded data limit
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow frontend
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });
app.get('/Tax_Assessment_NTIS_Backend/', (req, res) => {
  res.send('server is running ')
})
app.use(bodyParser.json());
// Serve static files (uploaded images)app.use('/upload', express.static(path.join(__dirname, '/uploads/Images/Photo')));
app.use('/Tax_Assessment_NTIS_Backend/', routes);
// GLOBAL ERROR HANDLER (MUST BE LAST)
app.use((err, req, res, next) => {
  console.error(":fire: ERROR:", err.stack || err);
  res.status(500).json({ error: "Internal Server Error" });
});
app.listen(port, () => {
  console.log("Backend running on port " + port);
});
export default app;