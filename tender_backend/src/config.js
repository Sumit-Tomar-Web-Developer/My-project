const env = process.env.NODE_ENV || 'production';

const configs = {
  development: {
    db: { host: process.env.RDS_HOSTNAME??'192.168.5.103',port:process.env.RDS_PORT??'3306', database: process.env.RDS_DB_NAME??'tendermanagementsystem', username: process.env.RDS_USERNAME??'root', password:  process.env.RDS_PASSWORD??'root', dialect: 'mysql' },
    jwtSecret: 'c50f2776e73f536bc1117b8519a44305dc0eea8d11453a6f7470971ff264260c',
    jwtExpiresIn: '1h',
    passwordHashing: { saltRounds: 10 },
    logLevel: 'debug',
    enableLogging: true,
    enableRequestResponseLogging: false,
    enableemails:true,
    smtpConfig: { from:'"TMS [No Reply]" <progress@coreproject.in>' , host: 'smtp.gmail.com', port: 587, secure: true, auth: { user: 'progress@coreproject.in', pass: 'wmvqzihftchszaxm' } },
    fileUpload: { path: './uploads', maxSize: 1 * 1024 * 1024 *50 }, //50mb
     enableDailyStatusJob: false
  },
  production: {
    db: { host: process.env.RDS_HOSTNAME??'192.168.5.103',port:process.env.RDS_PORT??'3306', database: process.env.RDS_DB_NAME??'tendermanagementsystem', username: process.env.RDS_USERNAME??'root', password: process.env.RDS_PASSWORD??'root', dialect: 'mysql' },
    jwtSecret: 'f825523bd83ebcfa5ce82d3f8a062bd158de2a5d59c40ac283c383fc298fc603',
    jwtExpiresIn: '1h',
    passwordHashing: { saltRounds: 10 },
    logLevel: 'error',
    enableLogging: true,
    enableRequestResponseLogging: false,
    enableemails:true,
    smtpConfig: { from:'"TMS" <mail@codeindevelopment.com>' , host: 'email-smtp.ap-south-1.amazonaws.com', port: 465, secure: true, auth: { user: 'AKIA3RYC57M3OEJRZWGK', pass: 'BLqn/leojvyTOYWmlOM/mvsuE4kRiLerKf02Z/buK8Nc' } },
    fileUpload: { path: './uploads', maxSize: 1 * 1024 * 1024 * 50}, //50mb
     enableDailyStatusJob: false
  }
};

module.exports = configs[env];
