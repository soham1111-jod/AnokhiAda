const validator = require('validator');

const validate = (data) => {
  const requiredFields = ["firstName", "email", "password"]; 

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error("Fields Missing");
    }
  }
};

module.exports = validate;