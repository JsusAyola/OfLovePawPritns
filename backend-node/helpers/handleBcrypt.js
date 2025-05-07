const bcrypt = require('bcryptjs');

// Encriptar la contraseña
const encrypt = async (textPlain) => {
  const hash = await bcrypt.hash(textPlain, 10);
  return hash;
};

// Comparar la contraseña ingresada con la encriptada
const compare = async (passwordPlain, hashPassword) => {
  return await bcrypt.compare(passwordPlain, hashPassword);
};

module.exports = { encrypt, compare };
