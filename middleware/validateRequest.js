const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    console.error(`Validation error: ${errorMessage}`, error.stack);
    return res.status(400).json({ error: errorMessage });
  }
  console.log('Request validation passed.');
  next();
};

module.exports = validateRequest;