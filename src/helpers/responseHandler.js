const responseHandler = (success, data, message, statusCode) => {
  if (success) {
    return {
      success: true,
      data: data,
      status: message || "Success",
    };
  } else {
    return {
      success: false,
      error: {
        message: message || "Error",
        statusCode: statusCode,
      },
    };
  }
};

module.exports = {
  responseHandler,
};
