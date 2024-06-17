# Forum-Microservice

## Overview

Forum-Microservice is designed to provide a scalable and containerized environment for deploying a microservice-based application resembling a Reddit-style forum. The docker image is available on [DockerHub](https://hub.docker.com/r/kevinlaisoftware/forum). This image encapsulates the Node.js application responsible for handling forum-related functionalities, with seamless integration capabilities for MongoDB.

## Technologies Used:
- JavaScript
- Express.js
- Node.js
- MongoDB
- Docker
- Github Actions
- Jest
- Bcrypt
- Postman
## Features

- **Users:** The Forum-Microservice supports user management and authentication. Users can register, log in, and perform various actions such as creating posts, commenting, and voting on posts. The microservice provides APIs for user-related operations, allowing developers to integrate user functionality into their applications easily.

- **Microservices Architecture:** Built to operate as a microservice, promoting modularization and scalability within a broader system.
  
- **MongoDB Integration:** Supports dynamic connection to a MongoDB instance through the `MONGODB_URI` environment variable.

## Postman Documentation
The API documentation can be found [here](https://documenter.getpostman.com/view/30898740/2sA3XQiNWS).

## Usage

To run the Docker container, set the required environment variables and port bindings:

```bash
docker run -e MONGODB_URI=<your_mongodb_uri> -p 8080:3000 your-docker-username/forum-microservice
```
## Getting Started

1. **Pull the Docker Image:**
   ```bash
   docker pull your-docker-username/forum-microservice
2. **Run the Docker Container:**
   ```bash
   docker run -e MONGODB_URI=<your_mongodb_uri> -p 8080:3000 your-docker-username/forum-microservice

3. **Initialize Database and Admin:**
    Adjust this template as needed to create an admin user
   ```javascript
        // Setup database with initial test data.
        // Include an admin user.
        // Script should take admin credentials as arguments as described in the requirements doc.
        require('dotenv').config();
        const Questions = require("./models/questions");
        const Comment = require("./models/comment");
        const Answers = require("./models/answers");
        const User = require("./models/users");
        const { default: mongoose } = require("mongoose");
        const bcrypt = require("bcrypt");

        const admin_email = process.argv[2];
        const admin_password = process.argv[3];
        const admin_username = process.argv[4];

        const saltRounds = 12;  // Default salt rounds 12
        const salt = bcrypt.genSaltSync(saltRounds);
        const admin_passwordHash = bcrypt.hashSync(admin_password, salt);

        const mongoUrl = process.env.MONGODB_URI;
        console.log(process.env.MONGODB_URI)
        mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        const database = mongoose.connection; 
        database.on('error', console.error.bind(console, 'connection error:'));
        database.once('open', async () => {
            console.log("Connected to database");
            try {
                const admin = new User({
                    username: admin_username,
                    email: admin_email,
                    passwordHash: admin_passwordHash,
                    admin: true,
                });
                await admin.save();
                console.log("Admin user created");
            } catch (error) {
                console.log(error);
            }
            database.close();
        });
   ```




