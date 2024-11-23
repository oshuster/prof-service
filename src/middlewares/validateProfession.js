export const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = error.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    res.status(400).json({
      status: "error",
      message: "Невірні дані",
      errors,
    });
  }
};
