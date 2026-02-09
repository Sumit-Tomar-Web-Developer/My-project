const config = require('../config');
const CronScheduler = require('./cronScheduler');
const { TenderCriticalDates, TenderBasicDetails, Tender } = require('../models');
const { fetchEmailUtility } = require('../utilities/fetchemailutility');
const { sendEmail } = require('../utilities/SendEmail');
const { Op } = require('sequelize');

class DailyStatusScheduler {
  constructor({ cronExpression = '0 8 * * *', timezone = 'Asia/Kolkata' } = {}) {
    this.timezone = timezone;
    this.lastRunDateKey = null;

    this.scheduler = new CronScheduler({
      cronExpression,
      timezone: this.timezone,
      task: this.run.bind(this),
      enabled: config.enableDailyStatusJob,
      name: 'Daily status job',
    });
  }

  async run() {
    this.markRunToday();
    console.log('Running daily status check job...');

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const upcomingTenders = await TenderCriticalDates.findAll({
      where: {
        [Op.or]: [
          { clarificationStartDate: { [Op.between]: [now, threeDaysFromNow] } },
          { clarificationEndDate: { [Op.between]: [now, threeDaysFromNow] } },
          { submissionStartDate: { [Op.between]: [now, threeDaysFromNow] } },
          { submissionEndDate: { [Op.between]: [now, threeDaysFromNow] } },
        ],
      },
      include: [
        {
          model: Tender,
          attributes: [],
          include: [
            {
              model: TenderBasicDetails,
              as: 'TenderBasicDetail',
              attributes: ['department', 'tenderIdText'],
            },
          ],
        },
      ],
    });

    if (!upcomingTenders.length) {
      console.log('No tenders with critical dates in the next 3 days.');
      return;
    }

    for (const tender of upcomingTenders) {
      const tenderDetails = tender.Tender?.TenderBasicDetail;
      if (!tenderDetails || !tenderDetails.department) {
        console.log(`Skipping tender ${tender.tenderId} due to missing department details.`);
        continue;
      }

      const recipients = await fetchEmailUtility({ departmentId: tenderDetails.department, isActive: true });
      if (!recipients.length) {
        console.log(`No recipients found for department ${tenderDetails.department}.`);
        continue;
      }

      const approachingDates = this.getApproachingDates(tender, now, threeDaysFromNow);
      for (const { label, date, daysRemaining } of approachingDates) {
        const formattedDate = new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: undefined }).format(date);
        const subject = `Important: ${label} is approaching in ${daysRemaining} days.`;
        const body = `${label} (${formattedDate}) is approaching in ${daysRemaining} days. Please make sure appropriate steps and actions are taken to not miss the deadline.`;

        await sendEmail({ to: recipients, subject, text: body });
      }
    }
  }

  getApproachingDates(tender, now, threeDaysFromNow) {
    const criticalFields = [
      { key: 'clarificationStartDate', label: 'Clarification start date' },
      { key: 'clarificationEndDate', label: 'Clarification end date' },
      { key: 'submissionStartDate', label: 'Submission start date' },
      { key: 'submissionEndDate', label: 'Submission end date' },
    ];

    return criticalFields
      .map(({ key, label }) => ({ key, label, date: tender[key] }))
      .filter(({ date }) => date instanceof Date && !Number.isNaN(date.valueOf()))
      .map(({ key, label, date }) => ({
        key,
        label,
        date,
        daysRemaining: Math.ceil((date - now) / (24 * 60 * 60 * 1000)),
      }))
      .filter(({ date, daysRemaining }) => date >= now && date <= threeDaysFromNow && daysRemaining >= 0);
  }

  start() {
    if (this.shouldRunImmediately()) {
      this.run();
    }

    this.scheduler.start();
  }

  stop() {
    this.scheduler.stop();
  }

  shouldRunImmediately() {
    const { hour, minute, dateKey } = this.getCurrentTimeParts();

    const isPastScheduledTime = hour > 8 || (hour === 8 && minute > 0);
    if (!isPastScheduledTime) return false;

    return !this.hasRunToday(dateKey);
  }

  hasRunToday(dateKey) {
    return this.lastRunDateKey === dateKey;
  }

  markRunToday() {
    const { dateKey } = this.getCurrentTimeParts();
    this.lastRunDateKey = dateKey;
  }

  getCurrentTimeParts() {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(new Date()).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

    const hour = parseInt(parts.hour, 10);
    const minute = parseInt(parts.minute, 10);
    const dateKey = `${parts.year}-${parts.month}-${parts.day}`;

    return { hour, minute, dateKey };
  }
}

module.exports = DailyStatusScheduler;
