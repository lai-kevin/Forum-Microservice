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

const saltRounds = 10;
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