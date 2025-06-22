# Scheduler Microservice

A NestJS-based microservice for scheduling and managing jobs with a RESTful API, built for the Digantara Backend Developer assessment.

## Overview
This project implements a scheduler microservice with the following features:
- **Job Scheduling**: Schedules jobs using cron expressions (e.g., weekly jobs every Monday) with `@nestjs/schedule`.
- **API Endpoints**:
  - `GET /jobs`: List all jobs.
  - `GET /jobs/:id`: Get job details by ID.
  - `POST /jobs`: Create a new job.
- **Database Integration**: Uses MongoDB to store job details (name, schedule, lastRun, nextRun, status, parameters).
- **Customization**: Supports custom job parameters and schedules.
- **Scalability**: Designed to handle ~10,000 users, ~1,000 services, and ~6,000 API requests/minute (see scaling-strategy.md).

The code adheres to SOLID principles, uses modular architecture, and includes Swagger for API documentation.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or provide a connection URI)
- Git


### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Hiran-2001/scheduler-microservice.git
   cd scheduler-microservice  
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   # Update the .env file with your database connection details
   ```

4. Start the development server:
   ```bash
   npm run start:dev
   ```
5. Create a test job via Postman
   
   <p><strong>URL:<strong> http://localhost:3000/jobs</p>
   <p><strong>Method:</strong> <code>POST</code></p>
   <h3>🔹 Body (JSON)</h3>
   <pre><code>
    {
    "name": "Test Every Minute",
    "type": "data-processing", // Available types: data-processing, email, notification
    "schedule": "* * * * *",
    "parameters": { "task": "test" },
    "isActive": true
    }
   </code></pre>
