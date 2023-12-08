# Twitter

## Overview

- **Framework:** [Express.js](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** NoSQL ([MongoDB](https://www.mongodb.com/))
- **Authentication:**
  - JWT (Access Token, Refresh Token)
  - OAuth 2.0 (Google)
- **Email Service:** [AWS SES (Simple Email Service)](https://aws.amazon.com/ses/)
- **Upload File:**
  - Server Storage
  - [AWS S3](https://aws.amazon.com/s3/)
- **File Handling:**
  - Upload and Resize Images, Videos
- **Streaming:**
  - [Node.js Stream](https://nodejs.org/api/stream.html)
  - [HLS (HTTP Live Streaming)](https://en.wikipedia.org/wiki/HTTP_Live_Streaming)
- **Websocket:** [Socket.io](https://socket.io/)
- **TypeODM:** [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- **Test API:** [Postman](https://www.postman.com/)
- **Deployment:**
  - [Docker](https://www.docker.com/)
  - [EC2 (AWS Elastic Compute Cloud)](https://aws.amazon.com/ec2/)
- **API Documentation:** [Swagger](https://swagger.io/)

## How to Run

1. Install dependencies: `npm install`
2. Set up MongoDB and configure connection in your own `.env` file.
3. Set up AWS SES credentials for email service.
4. Set up AWS S3 credentials for file storage.
5. Run the application: `npm run dev:prod` or  u should have a .env.production with your own setup depence on my .env.example

## API Documentation

-- Explore the API endpoints using [Swagger Documentation](https://twitter-clone-api.vuduyanh.id.vn/api-docs).


