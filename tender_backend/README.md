# Tender Management System API Setup

# Project Documentation

## Overview



## Project Structure
The project is organized into the following key components:



## Getting Started
1. Clone the repository: `git clone [repository URL]`.
2. Install dependencies: [provide instructions, e.g., `npm install`].
3. Run the application: `npm run dev` or `npm run start`.

## Contribution Guidelines
- Submit pull requests with detailed descriptions of changes.
- Ensure all tests pass before submitting changes.

## License
This project is licensed under a private license. Sharing, reusing, or distributing any part of this project is strictly prohibited without proper authority and explicit permissions.


# Detailed Setup Steps

1. Install dependencies:
   ```
   npm install
   ```
2. Set NODE_ENV:
   ```
   export NODE_ENV=development
   ```
3. Start dev:
   ```
   npm run dev
   ```
4. Swagger UI: Access the API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs).

5. Run tests:
   ```
   npm test
   ```
   Ensure all tests pass before deploying.

6. Build for production:
   ```
   npm run build
   ```
   This will create an optimized production build in the `dist` folder.

7. Start production server:
   ```
   npm start
   ```
   The server will run on the default port unless specified otherwise.

8. Environment Variables:
   - Ensure you have a `.env` file in the root directory.
   - Example `.env` file:
     ```
     NODE_ENV=production
     PORT=3000
     DATABASE_URL=your-database-url
     ```

9. Linting and Formatting:
   - Run the linter:
     ```
     npm run lint
     ```
   - Automatically fix linting issues:
     ```
     npm run lint:fix
     ```
   - Format code:
     ```
     npm run format
     ```

10. Additional Notes:
    - For detailed API usage, refer to the Swagger documentation.
    - A background job runs daily at **8:00 AM Asia/Kolkata (IST)** to perform automated checks and email notifications.
      Set `ENABLE_DAILY_STATUS_JOB=false` in the environment to temporarily disable the scheduler.