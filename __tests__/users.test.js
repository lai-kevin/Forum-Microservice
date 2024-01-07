const { expect } = require("chai");
const sinon = require("sinon");
const Users = require("../models/users");
const usersController = require("../controllers/users");

describe("usersController", () => {
  describe("createUser", () => {
    it("should create a new user", async () => {
      // Arrange
      const req = {
        body: {
          username: "testuser",
          email: "testuser@example.com",
          password: "testpassword",
        },
      };
      const passwordHash = "hashedpassword";
      const newUser = {
        username: req.body.username,
        email: req.body.email,
        passwordHash: passwordHash,
      };
      const createStub = sinon.stub(Users, "create").resolves(newUser);

      // Act
      const result = await usersController.createUser(req);

      // Assert
      expect(createStub.calledOnce).to.be.true;
      expect(createStub.calledWith(newUser)).to.be.true;
      expect(result).to.deep.equal(newUser);

      // Restore stub
      createStub.restore();
    });
  });
});