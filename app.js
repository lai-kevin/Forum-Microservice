require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const middleware = require("./middleware");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require('body-parser');

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({     
  extended: true
})); 
app.use(middleware.requestLogger);
app.use(
  session({
    secret: "secret string",
    cookie: {},
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
  })
)

const questionsRouter = require("./controllers/questions");
const answersRouter = require("./controllers/answers");
const tagsRouter = require("./controllers/tags");
const usersRouter = require("./controllers/users");
const commentsRouter = require("./controllers/comments");
app.use("/api/questions", questionsRouter);
app.use("/api/answers", answersRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

app.use(middleware.unknownEndpoint);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error)
    console.log("failed to connect to database");
  });

module.exports = app;