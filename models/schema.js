const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const File = mongoose.Schema({
  Filename: {
    type: String,
    required: [true, "This field is required"],
  },
  Author: {
    type: String,
    required: [true, "This field is required"],
  },
  Email: {
    type: String,
        minlength: [10, "The length of the email should at least 20 characters"],
        maxLength: [250, "The length of the email shouldnt be greater than 250 characters"],
        unique: [true, "This email is already exists"],
        match: [/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address']
  },
  Password: {
    type: String,
    required: [true, "This field is required"],
  },
  DownloadTimes: {
    type: Number,
    required: [true, "This field is required"],
  },
  Data: {
    type: Buffer,
    required : [true, "File data is required"],
  }
}, {
  timestamps : true
});

File.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
  const hashedPass = await bcrypt.hash(this.Password, salt);
  this.Password = hashedPass;
  next();
  } catch (error) {
    console.error(error.message);
  }
})

module.exports = mongoose.model("File", File);
