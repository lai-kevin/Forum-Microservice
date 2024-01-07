const { expect } = require("chai");
const sinon = require("sinon");
const Question = require("../models/question");
const commentsController = require("../controllers/comments");

describe("addCommentToQuestion", () => {
  it("should add a new comment to the question", async () => {
    // Arrange
    const question_id = "question123";
    const newComment = {
      _id: "comment2",
      text: "New comment",
      posted_by: {
        _id: "user2",
        name: "Jane Smith",
      },
    };
    const findOneAndUpdateStub = sinon
      .stub(Question, "findOneAndUpdate")
      .resolves(newComment);

    // Act
    const result = await commentsController.addCommentToQuestion(
      question_id,
      newComment
    );

    // Assert
    expect(findOneAndUpdateStub.calledOnce).to.be.true;
    expect(
      findOneAndUpdateStub.calledWith(
        { _id: question_id },
        { $push: { comments: newComment._id } },
        { new: true }
      )
    ).to.be.true;
    expect(result).to.deep.equal(newComment);

    // Restore stub
    findOneAndUpdateStub.restore();
  });
});

describe("getQuestionWithComments", () => {
  it("should return the question with populated comments", async () => {
    // Arrange
    const question_id = "question123";
    const populatedQuestion = {
      _id: question_id,
      comments: [
        {
          _id: "comment1",
          text: "Great comment!",
          posted_by: {
            _id: "user1",
            name: "John Doe",
          },
        },
      ],
    };
    const findOneStub = sinon
      .stub(Question, "findOne")
      .resolves(populatedQuestion);

    // Act
    const result = await commentsController.getQuestionWithComments(
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

describe("updateComment", () => {
  it("should update the comment text", async () => {
    // Arrange
    const comment_id = "comment123";
    const text = "Updated comment";
    const updatedComment = {
      _id: comment_id,
      text: text,
      posted_by: {
        _id: "user1",
        name: "John Doe",
      },
    };
    const findOneAndUpdateStub = sinon
      .stub(Comment, "findOneAndUpdate")
      .resolves(updatedComment);

    // Act
    const result = await commentsController.updateComment(comment_id, text);

    // Assert
    expect(findOneAndUpdateStub.calledOnce).to.be.true;
    expect(
      findOneAndUpdateStub.calledWith(
        { _id: comment_id },
        { text: text },
        { new: true }
      )
    ).to.be.true;
    expect(result).to.deep.equal(updatedComment);

    // Restore stub
    findOneAndUpdateStub.restore();
  });
});

describe("removeCommentFromQuestion", () => {
  it("should remove a comment from the question", async () => {
    // Arrange
    const question_id = "question123";
    const comment_id = "comment123";
    const updatedQuestion = {
      _id: question_id,
      comments: [],
    };
    const findOneAndUpdateStub = sinon
      .stub(Question, "findOneAndUpdate")
      .resolves(updatedQuestion);

    // Act
    const result = await commentsController.removeCommentFromQuestion(
      question_id,
      comment_id
    );

    // Assert
    expect(findOneAndUpdateStub.calledOnce).to.be.true;
    expect(
      findOneAndUpdateStub.calledWith(
        { _id: question_id },
        { $pull: { comments: comment_id } },
        { new: true }
      )
    ).to.be.true;
    expect(result).to.deep.equal(updatedQuestion);

    // Restore stub
    findOneAndUpdateStub.restore();
  });
});

describe("findOneComment", () => {
  it("should find and return a comment by its ID", async () => {
    // Arrange
    const comment_id = "comment123";
    const comment = {
      _id: comment_id,
      text: "Test comment",
      posted_by: {
        _id: "user1",
        name: "John Doe",
      },
    };
    const findOneStub = sinon.stub(Comment, "findOne").resolves(comment);

    // Act
    const result = await commentsController.findOneComment(comment_id);

    // Assert
    expect(findOneStub.calledOnce).to.be.true;
    expect(findOneStub.calledWith({ _id: comment_id })).to.be.true;
    expect(result).to.deep.equal(comment);

    // Restore stub
    findOneStub.restore();
  });
});
