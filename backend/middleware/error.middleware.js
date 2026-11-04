function errorHandler(err, req, res, next) {
  console.error(" Centralized API Error:", err.stack || err.message || err);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    message: err.message || "An internal server error occurred",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
}

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Resource not found on endpoint: ${req.method} ${req.originalUrl}`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};
