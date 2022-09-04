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

const getAllUser = (body) =>
  new Promise((resolve, reject) => {
    const { from, to } = pagination(body.page, body.limit);
    supabase
      .from("user")
      .select("*")
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
      .select("*")
      .eq("id", id)
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const updateUser = (body, params) =>
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
    const { id } = params;
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
          email,
          password,
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

module.exports = { createUser, getAllUser, getUserById, updateUser };
