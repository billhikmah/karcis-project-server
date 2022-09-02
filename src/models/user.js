/* eslint-disable camelcase */
const supabase = require("../config/supabase");

const createUser = (body) =>
  new Promise((resolve, reject) => {
    const {
      name,
      username,
      gender,
      profession,
      nationality,
      date_of_birth,
      email,
      password,
    } = body;
    supabase
      .from("user")
      .insert([
        {
          name,
          username,
          gender,
          profession,
          nationality,
          date_of_birth,
          email,
          password,
        },
      ])
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

module.exports = { createUser };
