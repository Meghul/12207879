export const logger = (req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
  // Custom in-memory logger (prints to terminal for this case)
  console.info(log);
  next();
};
