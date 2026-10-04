export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const error = { success: false, message };

  if (status === 500) {
    console.error(err);
  }

  res.status(status).send(error);
}
