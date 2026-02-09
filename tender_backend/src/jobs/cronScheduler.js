const cron = require('node-cron');

class CronScheduler {
  constructor({ cronExpression, timezone, task, enabled = true, name = 'Cron job' }) {
    this.cronExpression = cronExpression;
    this.timezone = timezone;
    this.task = task;
    this.enabled = enabled;
    this.name = name;
    this.job = null;
  }

  start() {
    if (!this.enabled) {
      console.log(`${this.name} disabled via configuration.`);
      return;
    }

    if (this.job) {
      console.log(`${this.name} is already scheduled.`);
      return;
    }

    this.job = cron.schedule(
      this.cronExpression,
      async () => {
        try {
          await this.task();
        } catch (error) {
          console.error(`${this.name} execution failed:`, error);
        }
      },
      {
        scheduled: true,
        timezone: this.timezone,
      },
    );

    console.log(`${this.name} scheduled with cron '${this.cronExpression}' (${this.timezone}).`);
  }

  stop() {
    if (this.job) {
      this.job.stop();
      this.job = null;
      console.log(`${this.name} stopped.`);
    }
  }
}

module.exports = CronScheduler;
