const supabase = require("../config/supabase");

const signUp = (name, email, password) =>
  new Promise((resolve, reject) => {
    supabase
      .from("user")
      .insert([{ name, email, password }])
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

module.exports = { signUp };
