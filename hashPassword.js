const bcrypt = require('bcryptjs');

const password = 'qwerty456';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed Password:', hash);
  }
});
