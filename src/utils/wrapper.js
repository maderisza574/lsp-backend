module.exports = {
  response: (res, status, msg, data = null, pagination = null) => {
    const result = {
      status,
      message: msg,
      data,
      pagination,
    };
    return res.status(status).json(result);
  },
};
