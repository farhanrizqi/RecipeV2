const {
  getUsers,
  getUsersByEmail,
  regis,
  delUserById,
  putUsersById,
  getUsersById,
} = require("../model/usersM");
const { responseHandler } = require("../helpers/responseHandler");
const { hashPassword } = require("../middleware/argon2");
const { generateToken } = require("../middleware/jwt");
const cloudinary = require("../config/photos");

const usersController = {
  showUsersOnly: async (req, res) => {
    console.log("Control: Running get users");
    try {
      let users_roles = req.payload.role;
      console.log(users_roles);
      if (users_roles != "admin") {
        return res
          .status(405)
          .json(
            responseHandler(
              false,
              null,
              `Couldn't access this data, Not Authorized`,
              405
            )
          );
      }
      const result = await getUsers();
      if (result.rowCount > 0) {
        return res
          .status(200)
          .json(responseHandler(true, result.rows, "Success"));
      } else {
        console.log("Data tidak ditemukan");
        return res
          .status(404)
          .json(responseHandler(false, null, `Couldn't find the data`, 404));
      }
    } catch (error) {
      console.error(`Error : ${error.message}`);
      return res
        .status(500)
        .json(responseHandler(false, null, `Something's wrong`, 500));
    }
  },
  registerUsers: async (req, res) => {
    console.log("Control: Running register users");
    try {
      const { name, email, pass, role } = req.body;
      if (!name || !email || !pass) {
        return res
          .status(404)
          .json(
            responseHandler("Name, Email, and Password must be filled", 404)
          );
      }

      let user = await getUsersByEmail(email);
      if (user.rows[0]) {
        return res
          .status(404)
          .json(responseHandler("Email have been used, try other email!", 404));
      }
      let post = {
        name: name,
        email: email,
        pass: await hashPassword(pass),
        // photos: photos || 'default.png',
        role: role || "users",
      };

      if (req.file) {
        const result_up = await cloudinary.uploader.upload(req.file.path, {
          folder: "users",
        });
        console.log(result_up);

        post.photos = result_up.secure_url;
        post.public_id = result_up.public_id;
      } else {
        post.photos =
          "https://res.cloudinary.com/ddrecezrk/image/upload/v1693996090/users/no-users.png";
        post.public_id = "no-users";
      }

      const result = await regis(post);
      if (result.rowCount > 0) {
        console.log(result.rows);
        return res
          .status(200)
          .json(responseHandler(true, result.rows, "Registration success!"));
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).json(responseHandler("Registration error", 500));
    }
  },
  login: async (req, res) => {
    try {
      let { email, pass } = req.body;
      console.log(email, pass);

      if (!email || !pass) {
        return res
          .status(404)
          .json(responseHandler("Email and Password must be filled", 404));
      }

      let data = await getUsersByEmail(email);
      // console.log(data.rows[0])

      if (!data.rows[0]) {
        return res
          .status(404)
          .json(responseHandler("Email not registered", 404));
      }

      let users = data.rows[0];
      console.log(users);
      const isPasswordMatch = await hashPassword(pass, users.pass);
      if (isPasswordMatch) {
        delete users.pass;
        const token = generateToken(users);
        users.token = token;
        return res.status(200).json(
          responseHandler(true, {
            user: users,
            message: "Login success!",
            token: token,
          })
        );
      } else {
        return res.status(404).json(responseHandler("Incorrect", 404));
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json(responseHandler("Error when getting the token", 500));
    }
  },
  delUsersByIdOnly: async (req, res) => {
    console.log("Control: Running delete users");
    try {
      const { id } = req.params;
      let users_role = req.payload.role;
      if (users_role !== "admin") {
        return res
          .status(403) // Ubah status kode ke 403 (Not Authorized)
          .json(
            responseHandler(
              `You are not authorized to access this data.`, // Pesan yang lebih jelas
              403
            )
          );
      }
      const userData = await getUsersById(id);
      if (!userData.rows[0]) {
        return res
          .status(404)
          .json(
            responseHandler(`The data you requested could not be found.`, 404)
          );
      }

      if (userData.rows[0].photos) {
        const public_id = userData.rows[0].photos
          .split("/")
          .pop()
          .split(".")[0];
        await cloudinary.uploader.destroy(public_id);
      }

      const result = await delUserById(id);
      if (result.rowCount > 0) {
        console.log(result.rows);
        return res.status(200).json(responseHandler(result.rows, "Success"));
      } else {
        console.log("Data tidak ditemukan");
        return res
          .status(404)
          .json(
            responseHandler(`The data you requested could not be found.`, 404)
          );
      }
    } catch (error) {
      console.error(`Error : ${error.message}`);
      return res
        .status(500)
        .json(
          responseHandler(
            `An internal server error occurred. Please try again later.`,
            500
          )
        );
    }
  },
  showUsersById: async (req, res) => {
    console.log("Control: Running get users by id");
    try {
      const { id } = req.params;
      const result = await getUsersById(id);
      if (result.rowCount > 0) {
        // Ubah respons untuk mengirimkan objek data pengguna
        return res.status(200).json(
          responseHandler(true, {
            user: result.rows[0], // Mengirim data pengguna dalam objek "user"
            message: "Success",
          })
        );
      } else {
        console.log("Data tidak ditemukan");
        return res
          .status(404)
          .json(responseHandler(`Couldn't find the data`, 404));
      }
    } catch (error) {
      console.error(`Error : ${error.message}`);
      return res.status(500).json(responseHandler(`Something's wrong`, 500));
    }
  },
  putUsersByIdOnly: async (req, res) => {
    console.log("Control: Running put users by id");
    try {
      const { id } = req.params;
      const { name, email, pass, role } = req.body;

      let dataUsers = await getUsersById(id);
      let result_up = null;

      const fileExt = req.file
        ? req.file.originalname.split(".").pop().toLowerCase()
        : null;

      if (req.file) {
        // Jika req.file ada dan ekstensi file valid, upload gambar baru dan hapus gambar lama
        if (
          fileExt &&
          (fileExt === "png" ||
            fileExt === "jpg" ||
            fileExt === "jpeg" ||
            fileExt === "jfif")
        ) {
          result_up = await cloudinary.uploader.upload(req.file.path, {
            folder: "users",
          });
          await cloudinary.uploader.destroy(dataUsers.rows[0].public_id);
        } else {
          // Jika ekstensi file tidak valid, kirim respons JSON yang sesuai
          return res.status(400).json({ message: "Invalid image file format" });
        }
      }

      let post = {
        id: id,
        name: name,
        email: email ? email : dataUsers.rows[0].email,
        pass: await hashPassword(pass),
        role: role,
      };

      if (result_up) {
        // Jika gambar baru diupload, update properti image
        post.photos = result_up.secure_url;
        post.public_id = result_up.public_id;
      } else {
        // Jika tidak ada gambar baru diupload, ambil gambar yang masih ada
        post.photos = dataUsers.rows[0].photos;
        post.public_id = dataUsers.rows[0].public_id;
      }

      let users_id = req.payload.id;

      if (users_id != dataUsers.rows[0].id) {
        return res
          .status(403)
          .json(
            responseHandler(`You are not authorized to access this data.`, 403)
          );
      }

      const result = await putUsersById(post);
      res.setHeader("Content-Type", "application/json"); // Set header Content-Type ke application/json
      if (result.rowCount > 0) {
        console.log("Data yang akan direspons:", result.rows);
        return res
          .status(200)
          .json(responseHandler(true, result.rows, "Success"));
      } else {
        console.log(`Couldn't find the data`);
        return res
          .status(404)
          .json(
            responseHandler(
              false,
              `The data you requested could not be found.`,
              404
            )
          );
      }
    } catch (error) {
      console.error(error);
      res.setHeader("Content-Type", "application/json"); // Set header Content-Type ke application/json
      return res
        .status(500)
        .json(
          responseHandler(
            `An internal server error occurred. Please try again later.`,
            500
          )
        );
    }
  },
};

module.exports = usersController;
