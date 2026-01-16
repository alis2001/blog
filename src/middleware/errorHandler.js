const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (req.path.startsWith('/admin')) {
    return res.status(statusCode).render('admin/error', {
      message,
      error: process.env.NODE_ENV === 'development' ? err : {},
      user: req.user || null
    });
  }

  res.status(statusCode).render('public/error', {
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;

