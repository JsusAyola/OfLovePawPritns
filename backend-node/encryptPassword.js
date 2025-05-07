const { encrypt } = require('./helpers/handleBcrypt');

(async () => {
  const password = '14dejulio2024';  // La contraseña que deseas encriptar
  const hashedPassword = await encrypt(password);
  console.log('Contraseña encriptada:', hashedPassword);
})();
