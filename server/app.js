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
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/fake_so'})
  })
)

const questionsRouter2 = require("./controllers/questions_v2");
const answersRouter2 = require("./controllers/answers_v2");
const tagsRouter2 = require("./controllers/tags_v2");
const usersRouter = require("./controllers/users");
const commentsRouter = require("./controllers/comments");
app.use("/api/questions_v2", questionsRouter2);
app.use("/api/answers_v2", answersRouter2);
app.use("/api/tags_v2", tagsRouter2);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

app.use(middleware.unknownEndpoint);

mongoose
  .connect("mongodb://127.0.0.1:27017/fake_so")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("failed to connect to database");
  });

module.exports = app;