//C:\Users\Владелец\freelance-marketplace\server\config\jwtKeys.js
//для управления JWT-ключами

const crypto = require('crypto');

let jwtKeys = {
  current: process.env.JWT_SECRET, // Основной ключ из .env
  backup: null, // Резервный ключ (пуст при старте)
};

// Генерация нового ключа
const generateNewKey = () => crypto.randomBytes(32).toString('hex');

// Ротация ключей
/* const rotateKeys = () => {
  jwtKeys.backup = jwtKeys.current; // Текущий ключ становится резервным
  jwtKeys.current = generateNewKey(); // Генерация нового текущего ключа
  console.log('JWT ключи обновлены. Текущий ключ:', jwtKeys.current);
}; */
const rotateKeys = () => {
	jwtKeys.backup = jwtKeys.current;
	jwtKeys.current = generateNewKey();
	console.log('JWT ключи обновлены:', jwtKeys);
};
 

module.exports = {
  jwtKeys,
  generateNewKey,
  rotateKeys,
};
