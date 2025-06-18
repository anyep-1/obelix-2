// check.js
const bcrypt = require("bcryptjs");

const plainPassword = "admin123"; // password yang kamu uji
const hashedPassword =
  "$2b$10$01F5PPaOelectI.NNs8ygOUWN1MaMf9ps.50IW1qfOEAD4LtX.BCK"; // ganti dengan hash dari database

bcrypt.compare(plainPassword, hashedPassword).then((result) => {
  console.log("Match?", result); // true = cocok, false = tidak cocok
});
