require('dotenv').config();
const config = require('./config');
const express = require('express');
const cors = require('cors');
const { requestLogger } = require('./middlewares/log.middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const db = require('./models');
const bcrypt = require('bcryptjs');
const { USER_ROLES, TENDER_STATUS, EXPENSE_STATUS, DEPARTMENTS, TENDER_EXPENSE_TYPE } = require('./utilities/utils');
const DailyStatusScheduler = require('./jobs/dailyStatusScheduler');

const app = express();
console.log("Starting Tender Management System Server...");

console.log(`Using File Upload Path: ${config.fileUpload.path}`);
console.log(`Using File Upload Max Size: ${config.fileUpload.maxSize} bytes`);
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
if (config.enableRequestResponseLogging) app.use(requestLogger);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', require('./routes/auth.routes'));
app.use('/users', require('./routes/user.routes'));
app.use('/roles', require('./routes/userRole.routes'));
app.use('/files', require('./routes/fileUpload.routes'));
app.use('/tenders', require('./routes/tender.routes'));
app.use('/healthcheck', require('./routes/healthCheck.routes'));
app.use('/report', require('./routes/report.routes'));
app.use('/departments', require('./routes/department.routes'));


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.get('/', (req, res) => {
    res.send('Tender Management System Server is Running Successfully!');
});
  db.sequelize
    .sync({ alter: true })
    // .sync({ force: true })
    .then(async () => {

    // Add master Roles
    for (const r of Object.values(USER_ROLES)) await db.UserRole.upsert(r);

    //Add Master Tender Status
    for (const s of Object.values(TENDER_STATUS)) await db.MasterTenderStatus.upsert(s);

    //Add Master Tender Expense Status
    for (const s of Object.values(EXPENSE_STATUS)) await db.MasterExpenseStatus.upsert(s);

    //Add Master Departments 
    for (const s of Object.values(DEPARTMENTS)) await db.MasterDepartment.upsert(s);

    //Add Master Expense Types
    for (const s of Object.values(TENDER_EXPENSE_TYPE)) {
      console.log("Adding Master Expense Type: ", s);
      await db.MasterExpenseType.upsert(s);

    }
  
    const adminUser = await db.User.findOne({ where: { userId: 'admin' } });
    if (!adminUser) {
      await db.User.create({
        userId: 'admin',
        name: 'admin',
        department: DEPARTMENTS.IT.id,
        email: '',
        contactinfo: '',
        passwordHash: '$2a$10$d3KFU747bxSpDC9wqQUM0eWe6Ac.yEXsBIepuB1Yl0NTbYVFgzeNK',
        userRoleId: 6 // Assuming 'Admin' role has id 6
      });
    }

    let port = process.env.PORT || 8080;

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.listen(port, () => console.log(`Listening on port ${port}`));

    const dailyStatusJob = new DailyStatusScheduler();
    dailyStatusJob.start();
  }).catch(err => console.error('Sync failed:', err));
