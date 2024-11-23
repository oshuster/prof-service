export const checkQueryParam = (requiredParams) => (req, res, next) => {
  const missingParams = requiredParams.filter((param) => !req.query[param]);

  if (missingParams.length > 0) {
    return res.status(400).json({
      error: `Missing required query parameter(s): ${missingParams.join(", ")}`,
    });
  }

  next();
};
