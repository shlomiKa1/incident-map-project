export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const error = err.message || "Internal Server Error";
  const message = { success: false, error };

  if (status === 500) {
    console.error(err);
  }

  res.status(status).send(message);
}
