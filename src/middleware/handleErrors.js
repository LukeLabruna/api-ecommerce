const Errors = require("../service/errors/enumErrors")

const handleError = (err, req, res, next) => {
  console.log(err.cause);

  const errorHandlers = {
    [Errors.ALL_FIELD_REQUIRED]: (res, err) => res.status(400).json({ status: "error", error: err.name }),
    [Errors.INVALID_ID]: (res, err) => res.status(400).json({ status: "error", error: err.name }),
    [Errors.NOT_FOUND]: (res, err) => res.status(400).json({ status: "error", error: err.name }),
    [Errors.INVALID_CODE]: (res, err) => res.status(400).json({ status: "error", error: err.name }),
  }

  const handler = errorHandlers[err.code] || ((res) => res.status(500).json({ status: "error", error: "Unhandled error" }));

  handler(res, err);
}

module.exports = handleError