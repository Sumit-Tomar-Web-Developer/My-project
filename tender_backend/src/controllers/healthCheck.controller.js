const { sendEmail } = require("../utilities/SendEmail");

/**
 * @swagger
 * /healthcheck/ping:
 *   get:
 *     summary: Health check endpoint to verify the server is running.
 *     tags:
 *       - Health Check
 *     security: []
 *     responses:
 *       200:
 *         description: Server is running.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pong
 */
exports.ping = async (req, res) => {
  try {
    await sendEmail({
      to: 'doroko4027@kudimi.com',
      subject: 'Health Check Ping',
      text: `Health check ping received at ${new Date().toISOString()}`,
    });
  } catch (err) {
    console.error('Failed to send health check email:', err);
  }

  res.status(200).json({ message: 'Pong. Version 1.0' });
};
