const { getCategory } = require("../model/categoryM");
const { responseHandle } = require("../helpers/responseHandler");

const categoryController = {
  getData: async (req, res) => {
    console.log("Controller Get Recipe");
    try {
      const result = await getCategory();
      if (result.rowCount > 0) {
        console.log(result.rows);
        const response = responseHandler(true, result.rows, "Success!", 200);
        return res.status(200).json(response);
      } else {
        console.log("Data Not Found");
        const response = responseHandler(false, null, "Cant find data", 404);
        return res.status(404).json(response);
      }
    } catch (error) {
      console.error(`Error : ${error.message}`);
      const response = responseHandler(false, null, "Something's wrong", 500);
      return res.status(500).json(response);
    }
  },
};

module.exports = categoryController;
