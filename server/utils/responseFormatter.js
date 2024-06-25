const responseFormatter = (req, res, next) => {
  res.apiSuccess = (data, message = "Success", status = 200) => {
    res.status(status).json({
      success: true,
      message,
      data,
      status,
    });
  };

  res.apiSuccessPagination = (
    data,
    pagination,
    message = "Success",
    status = 200
  ) => {
    res.status(status).json({
      success: true,
      message,
      data,
      pagination,
      status,
    });
  };

  res.apiError = (message = "Internal Server Error", status = 500) => {
    res.status(status).json({
      success: false,
      message,
      data: null,
      status,
    });
  };

  next();
};

module.exports = responseFormatter;
