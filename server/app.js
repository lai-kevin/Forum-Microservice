const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const middleware = require("./middleware");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.requestLogger);

const questionsRouter = require("./controllers/questions");
const answersRouter = require("./controllers/answers");
const tagsRouter = require("./controllers/tags")
app.use("/api/questions", questionsRouter);
app.use("/api/answers", answersRouter);
app.use("/api/tags", tagsRouter);

const questionsRouter2 = require("./controllers/questions_v2");
const answersRouter2 = require("./controllers/answers_v2");
const tagsRouter2 = require("./controllers/tags_v2");
const usersRouter = require("./controllers/users");
app.use("/api/questions_v2", questionsRouter2);
app.use("/api/answers_v2", answersRouter2);
app.use("/api/tags_v2", tagsRouter2);
app.use("/api/users", usersRouter);

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