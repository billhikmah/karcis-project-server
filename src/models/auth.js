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

const checkRegisteredEmail = (email) =>
  new Promise((resolve, reject) => {
    supabase
      .from("user")
      .select("email")
      .eq("email", email)
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const logIn = (email, password) =>
  new Promise((resolve, reject) => {
    supabase
      .from("user")
      .insert([{ email, password }])
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const getUserByEmail = (email) =>
  new Promise((resolve, reject) => {
    supabase
      .from("user")
      .select("password, id, role")
      .eq("email", email)
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

module.exports = { signUp, checkRegisteredEmail, logIn, getUserByEmail };
