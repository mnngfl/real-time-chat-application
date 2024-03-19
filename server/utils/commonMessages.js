const messages = {
  userNameFormat: "UserName must be 4 to 30 lowercase letters and numbers.",
  userNameDuplicate: "User with the given userName already exist.",
  nicknameFormat: "Nickname must be up to 30 letters and numbers.",
  passwordFormat: "Password must be a strong passwords.",
  required: "All fields are required.",
  notExist: "Invalid email or password.",
};

const commonMessages = (req, res, next) => {
  res.locals.messages = messages;
  next();
};

module.exports = commonMessages;
