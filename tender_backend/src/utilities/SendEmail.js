const nodemailer = require('nodemailer');
const path = require('path');
const config = require('../config');
const hbs = require('nodemailer-express-handlebars').default;

// 1. Create transporter
function buildTransporter({ enableTemplates = false } = {}) {
  const transporter = nodemailer.createTransport({
    host: config.smtpConfig.host,
    port: parseInt(config.smtpConfig.port, 10),
    secure: config.smtpConfig.port == '465', // true for 465, false for other ports
    auth: {
      user: config.smtpConfig.auth.user,
      pass: config.smtpConfig.auth.pass
    },
  });

  // Configure Handlebars template engine only when a template is requested
  if (enableTemplates) {
    const templateDir = path.join(__dirname, '../mailtemplates');

    transporter.use('compile', hbs({
      viewEngine: {
        extName: '.hbs',
        partialsDir: templateDir,
        layoutsDir: templateDir,
        defaultLayout: false,
      },
      viewPath: templateDir,
      extName: '.hbs',
    }));
  }

  return transporter;
}

/**
 * sendEmail
 * @param {Object} options
 * @param {string|string[]} options.to       – recipient email or array of emails
 * @param {string}         options.subject  – email subject
 * @param {string} [options.template]       – name of .hbs file (without extension)
 * @param {Object} [options.context]        – template variables
 * @param {string} [options.text]           – plain-text body
 * @param {string} [options.html]           – raw HTML body
 */
async function sendEmail({ to, subject, template, context, text, html }) {
  if (config.enableemails === false) {
    console.log("Email sending is disabled in the configuration.");
    return;
  }

  // Basic validation
  if (!template && !text && !html) {
    throw new Error('Email content missing: provide a template or plain text/HTML body.');
  }

  if (template === '') {
    throw new Error('Email template name cannot be empty.');
  }

  if (template && (text || html)) {
    throw new Error('Pick either a template OR raw text/html, not both.');
  }

  const mailOptions = {
    from: config.smtpConfig.from,
    to,
    subject,
  };

  if (template) {
    mailOptions.template = template;
    mailOptions.context = context;
  } else {
    if (text) mailOptions.text = text;
    if (html) mailOptions.html = html;
  }

  const transporter = buildTransporter({ enableTemplates: Boolean(template) });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✔ Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('x Error sending email:', err);
    throw err;
  }
}

module.exports = { sendEmail };
