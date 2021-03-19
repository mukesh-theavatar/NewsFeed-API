const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Story = require("./newsfeed");
var timestamps = require("mongoose-timestamp");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    requred: true,
    trim: true,
    maxLength: 32,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid Email Address" });
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
  },
  mobile: {
    type: String,
    trim: true,
    unique: true,
    validate: (value) => {
      if (!validator.isMobilePhone(value, "en-IN")) {
        throw new Error({ error: "Invalid Phone Number" });
      }
    },
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  stories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: Story,
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
});

userSchema.plugin(timestamps);

userSchema.pre("save", async function (next) {
  const user = this;
  // console.log("HIII",user)
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 14);
  }
  next();
});

userSchema.methods.getAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });
  user.tokens.push({ token });
  return token;
};

userSchema.statics.findByCredentials = async (email, pass) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Credentials");
  }
  const match = bcrypt.compare(pass, user.password);
  if (!match) {
    throw new Error("Invalid Credentials");
  }
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
