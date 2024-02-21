const responseFormatter = (req, res, next) => {
  res.apiSuccess = (data, message = "Success", status = 200) => {
    res.status(status).json({
      success: true,
      message,
      data,
    });
  };

  res.apiSuccessPagination = (
    data,
    pageInfo,
    message = "Success",
    status = 200
  ) => {
    res.status(status).json({
      success: true,
      message,
      data,
      pageInfo,
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
