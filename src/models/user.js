/* eslint-disable camelcase */
const supabase = require("../config/supabase");

const pagination = (inputPage, inputLimit) => {
  const page = Number(inputPage);
  const limit = Number(inputLimit) || 5;
  const from = page ? (page - 1) * limit : 0;
  const to = page ? from + limit - 1 : limit - 1;

  return { from, to };
};

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

const getAllUser = (query) =>
  new Promise((resolve, reject) => {
    const { from, to } = pagination(query.page, query.limit);
    supabase
      .from("user")
      .select(`*, gender(name), profession(name), nationality(name)`, {
        count: "exact",
      })
      .order("name", { ascending: true })
      .range(from, to)
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const getUserById = (id) =>
  new Promise((resolve, reject) => {
    supabase
      .from("user")
      .select(`*, gender(name), profession(name), nationality(name)`)
      .eq("id", id)
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const updateUser = (body, payload, image) =>
  new Promise((resolve, reject) => {
    const { name, username, gender, profession, nationality, date_of_birth } =
      body;
    const { user_id: id } = payload;
    const updated_at = new Date();
    supabase
      .from("user")
      .update([
        {
          name,
          username,
          gender,
          profession,
          nationality,
          date_of_birth,
          updated_at,
          image,
        },
      ])
      .match({ id })
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const updatePassword = (password, id) =>
  new Promise((resolve, reject) => {
    const updated_at = new Date();
    supabase
      .from("user")
      .update([
        {
          password,
          updated_at,
        },
      ])
      .match({ id })
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

module.exports = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  updatePassword,
};
