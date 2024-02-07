const responseFormatter = (req, res, next) => {
  res.apiSuccess = (data, message = "Success", status = 200) => {
    res.status(status).json({
      success: true,
      message: message,
      data,
    });
  };

  res.apiError = (message = "Internal Server Error", status = 500) => {
    res.status(status).json({
      success: false,
      message,
      data: null,
    });
  };

  next();
};

module.exports = responseFormatter;
