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
  describe("createUser", () => {
    it("should find a user by email", async () => {
      // Arrange
      const req = {
        body: {
          email: "testuser@example.com",
        },
      };
      const email = req.body.email;
      const user = {
        email: email,
        username: "testuser",
        passwordHash: "hashedpassword",
      };
      const findStub = sinon.stub(Users, "find").resolves([user]);

      // Act
      const result = await usersController.findUserByEmail(req);

      // Assert
      expect(findStub.calledOnce).to.be.true;
      expect(findStub.calledWith({ email: email })).to.be.true;
      expect(result).to.deep.equal(user);

      // Restore stub
      findStub.restore();
    });
  });
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

  describe("registerUser", () => {
    it("should register a new user", async () => {
      // Arrange
      const req = {
        body: {
          username: "testuser",
          email: "testuser@example.com",
          password: "testpassword",
        },
      };
      const salt = "salt";
      const passwordHash = "hashedpassword";
      const newUser = {
        username: req.body.username,
        email: req.body.email,
        passwordHash: passwordHash,
      };
      const bcryptStub = sinon.stub(bcrypt, "genSalt").resolves(salt);
      const bcryptHashStub = sinon.stub(bcrypt, "hash").resolves(passwordHash);
      const UsersStub = sinon.stub(Users.prototype, "save").resolves(newUser);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.registerUser(req, res);

      // Assert
      expect(bcryptStub.calledOnceWith(10)).to.be.true;
      expect(bcryptHashStub.calledOnceWith(req.body.password, salt)).to.be.true;
      expect(UsersStub.calledOnceWith(newUser)).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(newUser)).to.be.true;

      // Restore stubs
      bcryptStub.restore();
      bcryptHashStub.restore();
      UsersStub.restore();
    });

    it("should return error for invalid email format", async () => {
      // Arrange
      const req = {
        body: {
          username: "testuser",
          email: "invalidemail",
          password: "testpassword",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.registerUser(req, res);

      // Assert
      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.json.calledOnceWith({ error: "Invalid email format" })).to.be
        .true;
    });

    it("should return error for password containing username or email", async () => {
      // Arrange
      const req = {
        body: {
          username: "testuser",
          email: "testuser@example.com",
          password: "testuser",
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.registerUser(req, res);

      // Assert
      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(
        res.json.calledOnceWith({
          error: "Password should not contain username or email",
        })
      ).to.be.true;
    });

    it("should return error for existing email", async () => {
      // Arrange
      const req = {
        body: {
          username: "testuser",
          email: "testuser@example.com",
          password: "testpassword",
        },
      };
      const error = { keyValue: { email: "testuser@example.com" } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const UsersStub = sinon.stub(Users, "find").resolves([req.body]);

      // Act
      await usersController.registerUser(req, res);

      // Assert
      expect(UsersStub.calledOnceWith({ email: req.body.email })).to.be.true;
      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.json.calledOnceWith({ error: "Email already exists" })).to.be
        .true;

      // Restore stub
      UsersStub.restore();
    });

    it("should return internal server error", async () => {
      // Arrange
      const req = {
        body: {
          username: "testuser",
          email: "testuser@example.com",
          password: "testpassword",
        },
      };
      const error = new Error("Internal server error");
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const UsersStub = sinon.stub(Users, "find").rejects(error);

      // Act
      await usersController.registerUser(req, res);

      // Assert
      expect(UsersStub.calledOnceWith({ email: req.body.email })).to.be.true;
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(
        res.json.calledOnceWith({
          error: "Internal server error",
          message: error,
        })
      ).to.be.true;

      // Restore stub
      UsersStub.restore();
    });
  });

  describe("loginUser", () => {
    it("should login a user with valid credentials", async () => {
      // Arrange
      const req = {
        body: {
          email: "testuser@example.com",
          password: "testpassword",
        },
      };
      const user = {
        email: req.body.email,
        passwordHash: "hashedpassword",
      };
      const bcryptCompareStub = sinon.stub(bcrypt, "compare").resolves(true);
      const UsersStub = sinon.stub(Users, "find").resolves([user]);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.loginUser(req, res);

      // Assert
      expect(UsersStub.calledOnceWith({ email: req.body.email })).to.be.true;
      expect(
        bcryptCompareStub.calledOnceWith(req.body.password, user.passwordHash)
      ).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({ user: user })).to.be.true;

      // Restore stubs
      bcryptCompareStub.restore();
      UsersStub.restore();
    });

    it("should return error for invalid credentials", async () => {
      // Arrange
      const req = {
        body: {
          email: "testuser@example.com",
          password: "testpassword",
        },
      };
      const user = {
        email: req.body.email,
        passwordHash: "hashedpassword",
      };
      const bcryptCompareStub = sinon.stub(bcrypt, "compare").resolves(false);
      const UsersStub = sinon.stub(Users, "find").resolves([user]);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.loginUser(req, res);

      // Assert
      expect(UsersStub.calledOnceWith({ email: req.body.email })).to.be.true;
      expect(
        bcryptCompareStub.calledOnceWith(req.body.password, user.passwordHash)
      ).to.be.true;
      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnceWith({ error: "Invalid credentials" })).to.be
        .true;

      // Restore stubs
      bcryptCompareStub.restore();
      UsersStub.restore();
    });
  });

  describe("logoutUser", () => {
    it("should logout a user", async () => {
      // Arrange
      const req = {
        session: {
          user: { _id: "1234567890" },
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.logoutUser(req, res);

      // Assert
      expect(req.session.user).to.be.undefined;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({ message: "Logged out" })).to.be.true;
    });

    it("should return error if user is not logged in", async () => {
      // Arrange
      const req = {
        session: {},
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.logoutUser(req, res);

      // Assert
      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(res.json.calledOnceWith({ error: "Not logged in" })).to.be.true;
    });
  });

  describe("getUsers", () => {
    it("should get all users if admin", async () => {
      // Arrange
      const req = {
        session: {
          user: { admin: true },
        },
      };
      const users = [
        { username: "user1", email: "user1@example.com" },
        { username: "user2", email: "user2@example.com" },
      ];
      const UsersStub = sinon.stub(Users, "find").resolves(users);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.getUsers(req, res);

      // Assert
      expect(req.session.user.admin).to.be.true;
      expect(UsersStub.calledOnceWith({})).to.be.true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(users)).to.be.true;

      // Restore stub
      UsersStub.restore();
    });

    it("should return error if user is not admin", async () => {
      // Arrange
      const req = {
        session: {
          user: { admin: false },
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.getUsers(req, res);

      // Assert
      expect(req.session.user.admin).to.be.false;
      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnceWith({ error: "Unauthorized" })).to.be.true;
    });

    it("should return internal server error", async () => {
      // Arrange
      const req = {
        session: {
          user: { admin: true },
        },
      };
      const error = new Error("Internal server error");
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const UsersStub = sinon.stub(Users, "find").rejects(error);

      // Act
      await usersController.getUsers(req, res);

      // Assert
      expect(req.session.user.admin).to.be.true;
      expect(UsersStub.calledOnceWith({})).to.be.true;
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(
        res.json.calledOnceWith({
          error: "Internal server error",
          message: error,
        })
      ).to.be.true;

      // Restore stub
      UsersStub.restore();
    });
  });

  describe("updateUser", () => {
    it("should return not implemented error", async () => {
      // Arrange
      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.updateUser(req, res);

      // Assert
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(res.json.calledOnceWith({ error: "Not implemented" })).to.be.true;
    });
  });

  describe("deleteUser", () => {
    it("should delete a user if admin", async () => {
      // Arrange
      const req = {
        session: {
          user: { admin: true, _id: "1234567890" },
        },
      };
      const deleted = { n: 1 };
      const UsersStub = sinon.stub(Users, "deleteOne").resolves(deleted);
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.deleteUser(req, res);

      // Assert
      expect(req.session.user.admin).to.be.true;
      expect(UsersStub.calledOnceWith({ _id: req.session.user._id })).to.be
        .true;
      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith(deleted)).to.be.true;

      // Restore stub
      UsersStub.restore();
    });

    it("should return error if user is not admin", async () => {
      // Arrange
      const req = {
        session: {
          user: { admin: false },
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      // Act
      await usersController.deleteUser(req, res);

      // Assert
      expect(req.session.user.admin).to.be.false;
      expect(res.status.calledOnceWith(401)).to.be.true;
      expect(res.json.calledOnceWith({ error: "Unauthorized" })).to.be.true;
    });

    it("should return internal server error", async () => {
      // Arrange
      const req = {
        session: {
          user: { admin: true, _id: "1234567890" },
        },
      };
      const error = new Error("Internal server error");
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const UsersStub = sinon.stub(Users, "deleteOne").rejects(error);

      // Act
      await usersController.deleteUser(req, res);

      // Assert
      expect(req.session.user.admin).to.be.true;
      expect(UsersStub.calledOnceWith({ _id: req.session.user._id })).to.be
        .true;
      expect(res.status.calledOnceWith(500)).to.be.true;
      expect(
        res.json.calledOnceWith({
          error: "Internal server error",
          message: error,
        })
      ).to.be.true;

      // Restore stub
      UsersStub.restore();
    });
  });
});
