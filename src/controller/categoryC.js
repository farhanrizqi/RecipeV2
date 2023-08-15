const { getCategory } = require("../model/categoryM");

const categoryController = {
  getData: async (req, res, next) => {
    let data = await getCategory();
    if (data) {
      res.status(200).json({
        status: 200,
        message: "get data category success",
        data: data.rows,
      });
    }
  },
};

module.exports = categoryController;
