const File = require("./models/schema");
const bcrypt = require("bcrypt");

 const users = async () => {
  try {
      const ex = await File.find();
      console.log(ex);
    return ex;
  } catch (error) {
      console.log(error.message)
  }
}

module.exports = { users }