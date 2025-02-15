const bcrypt = require('bcrypt');

const hashPassword = async () => {
  const password = "12345";  // Replace with the password you want to hash
  const saltRounds = 10;  // Number of hashing rounds (higher is more secure)

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed Password:", hashedPassword);
  } catch (error) {
    console.error("Error hashing password:", error);
  }
};

hashPassword();