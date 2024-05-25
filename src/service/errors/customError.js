class CustomError {
  static createError = ({
    name = "Error",
    cause = "Undefined",
    message,
    code = 1,
  }) => {
    const err = new Error(message);
    err.name = name;
    err.cause = cause;
    err.message = message;
    err.code = code;

    throw err;
  };
}

module.exports = CustomError