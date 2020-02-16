
const success = (res, data, code=200) => {
  const statusCode = data.statusCode || code;
  if (data.statusCode) delete data.statusCode;

  res.status(statusCode).json({
    success: true,
    data,
  });
};


const error = (res, error, code=500) => {
  const statusCode = error.statusCode || code;
  if (error.statusCode) delete error.statusCode;

  res.status(statusCode).json({
    success: false,
    error,
  });
};

module.exports = {
  success,
  error
};
