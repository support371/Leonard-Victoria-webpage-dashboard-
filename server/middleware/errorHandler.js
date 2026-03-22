function errorHandler(err, req, res, _next) {
  console.error(err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
