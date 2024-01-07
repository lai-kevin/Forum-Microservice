const { expect } = require("chai");
const sinon = require("sinon");
const Question = require("../models/question");
const questionsController = require("../controllers/questions");

describe("questionsController", () => {
  describe("create", () => {
    it("should create a new question", async () => {
      // Arrange
      const req = {
        session: {
          user: {
            _id: "user123",
          },
        },
      };
      const title = "Sample Title";
      const summary = "Sample Summary";
      const question_text = "Sample Question Text";
      const tags = ["tag1", "tag2"];
      const question = new Question({
        title: title,
        summary: summary,
        text: question_text,
        tags: tags,
        asked_by: req.session.user._id,
      });
      const saveStub = sinon.stub(question, "save").resolves(question);

      // Act
      const result = await questionsController.create(req, title, summary, question_text, tags);

      // Assert
      expect(saveStub.calledOnce).to.be.true;
      expect(result).to.deep.equal(question);

      // Restore stub
      saveStub.restore();
    });
  });
});