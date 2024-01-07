const { expect } = require("chai");
const sinon = require("sinon");
const Question = require("../models/question");
const answersController = require("../controllers/answers");

describe("answersController", () => {
  describe("update", () => {
    it("should update the question with the new answer", async () => {
      // Arrange
      const req = {
        body: {
          question_id: "question123",
        },
      };
      const newAnswer = {
        _id: "423523424325",
      };
      const findOneAndUpdateStub = sinon
        .stub(Question, "findOneAndUpdate")
        .resolves(newAnswer);

      // Act
      const result = await answersController.update(req);

      // Assert
      expect(findOneAndUpdateStub.calledOnce).to.be.true;
      expect(
        findOneAndUpdateStub.calledWith(
          { _id: req.body.question_id },
          { $push: { answers: newAnswer._id } },
          { new: true }
        )
      ).to.be.true;
      expect(result).to.deep.equal(newAnswer);

      // Restore stub
      findOneAndUpdateStub.restore();
    });
  });

  describe("getQuestionWithAnswers", () => {
    it("should return the question with populated answers and comments", async () => {
      // Arrange
      const question_id = "question123";
      const populatedQuestion = {
        _id: question_id,
        answers: [
          {
            _id: "answer1",
            ans_by: {
              _id: "user1",
              name: "John Doe",
            },
            comments: [
              {
                _id: "comment1",
                text: "Great answer!",
                posted_by: {
                  _id: "user2",
                  name: "Jane Smith",
                },
              },
            ],
          },
        ],
      };
      const findOneStub = sinon
        .stub(Question, "findOne")
        .resolves(populatedQuestion);

      // Act
      const result = await answersController.getQuestionWithAnswers(
        question_id
      );

      // Assert
      expect(findOneStub.calledOnce).to.be.true;
      expect(findOneStub.calledWith({ _id: question_id })).to.be.true;
      expect(result).to.deep.equal(populatedQuestion);

      // Restore stub
      findOneStub.restore();
    });
  });
});

describe("delete", () => {
  it("should delete the answer", async () => {
    // Arrange
    const req = {
      body: {
        answer_id: "answer145346",
      },
    };
    const deleteOneStub = sinon.stub(Answer, "deleteOne").resolves({});

    // Act
    await answersController.delete(req);

    // Assert
    expect(deleteOneStub.calledOnce).to.be.true;
    expect(deleteOneStub.calledWith({ _id: req.body.answer_id })).to.be.true;

    // Restore stub
    deleteOneStub.restore();
  });
});

describe("update upvoted user", () => {
  it("should update the user's reputation when updating the answer", async () => {
    // Arrange
    const req = {
      session: {
        user: {
          _id: "user123",
        },
      },
    };
    const user = {
      _id: "user123",
      reputation: 10,
    };
    const findOneAndUpdateStub = sinon
      .stub(User, "findOneAndUpdate")
      .resolves(user);

    // Act
    await answersController.update(req);

    // Assert
    expect(findOneAndUpdateStub.calledOnce).to.be.true;
    expect(
      findOneAndUpdateStub.calledWith(
        { _id: req.session.user._id },
        { $inc: { reputation: -5 } },
        { new: true }
      )
    ).to.be.true;

    // Restore stub
    findOneAndUpdateStub.restore();
  });
});

describe("delete", () => {
  it("should update the user's reputation when deleting the answer", async () => {
    // Arrange
    const req = {
      session: {
        user: {
          _id: "user123",
        },
      },
    };
    const user = {
      _id: "user123",
      reputation: 15,
    };
    const findOneAndUpdateStub = sinon
      .stub(User, "findOneAndUpdate")
      .resolves(user);

    // Act
    await answersController.delete(req);

    // Assert
    expect(findOneAndUpdateStub.calledOnce).to.be.true;
    expect(
      findOneAndUpdateStub.calledWith(
        { _id: req.session.user._id },
        { $inc: { reputation: -5 } },
        { new: true }
      )
    ).to.be.true;

    // Restore stub
    findOneAndUpdateStub.restore();
  });
});

describe("update upvoted user", () => {
  it("should update the user's reputation when updating the answer", async () => {
    // Arrange
    const req = {
      session: {
        user: {
          _id: "user123",
        },
      },
    };
    const user = {
      _id: "user123",
      reputation: 10,
    };
    const findOneAndUpdateStub = sinon
      .stub(User, "findOneAndUpdate")
      .resolves(user);

    // Act
    await answersController.update(req);

    // Assert
    expect(findOneAndUpdateStub.calledOnce).to.be.true;
    expect(
      findOneAndUpdateStub.calledWith(
        { _id: req.session.user._id },
        { $inc: { reputation: -5 } },
        { new: true }
      )
    ).to.be.true;

    // Restore stub
    findOneAndUpdateStub.restore();
  });
});
