/* eslint-disable camelcase */
const supabase = require("../config/supabase");

const pagination = (inputPage, inputLimit) => {
  const page = Number(inputPage);
  const limit = Number(inputLimit) || 5;
  const from = page ? (page - 1) * limit : 0;
  const to = page ? from + limit - 1 : limit - 1;

  return { from, to };
};

const createWishlist = (body, payload) =>
  new Promise((resolve, reject) => {
    const { event_id } = body;
    const { user_id } = payload;
    supabase
      .from("wishlist")
      .insert([
        {
          event_id,
          user_id,
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

const getAllWishList = (query, { user_id }) =>
  new Promise((resolve, reject) => {
    const { from, to } = pagination(query.page, query.limit);
    supabase
      .from("wishlist")
      .select(`*, user_id(id, name), event_id(id, name)`, {
        count: "exact",
      })
      .match({ user_id })
      .order("created_at", { ascending: false })
      .range(from, to)
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const getWishlistById = ({ id }) =>
  new Promise((resolve, reject) => {
    supabase
      .from("wishlist")
      .select(`*, user_id(id, name), event_id(id, name)`)
      .eq("id", id)
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const deleteWishlist = ({ id }) =>
  new Promise((resolve, reject) => {
    supabase
      .from("wishlist")
      .delete()
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
  createWishlist,
  getAllWishList,
  getWishlistById,
  deleteWishlist,
};
