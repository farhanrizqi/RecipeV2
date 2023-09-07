const argon2 = require("argon2");

const hashPassword = async (plainPassword, isHash = true) => {
  try {
    if (isHash) {
      const hashedPassword = await argon2.hash(plainPassword);
      return hashedPassword;
    } else {
      // Di sini, hashedPassword adalah kata sandi yang sudah di-hash sebelumnya
      // Anda perlu membandingkannya dengan kata sandi yang diberikan
      // plainPassword adalah kata sandi yang akan diperiksa
      const isMatch = await argon2.verify(hashPassword, plainPassword);
      return isMatch;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  hashPassword,
};
