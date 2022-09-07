/* eslint-disable camelcase */
const supabase = require("../config/supabase");

const pagination = (inputPage, inputLimit) => {
  const page = Number(inputPage);
  const limit = Number(inputLimit) || 5;
  const from = page ? (page - 1) * limit : 0;
  const to = page ? from + limit - 1 : limit - 1;

  return { from, to };
};

const createEvent = (body) =>
  new Promise((resolve, reject) => {
    const { name, category, location, date_time_show, detail, price } = body;
    supabase
      .from("event")
      .insert([{ name, category, location, detail, date_time_show, price }])
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const getEventById = (id) =>
  new Promise((resolve, reject) => {
    supabase
      .from("event")
      .select("*, category(name), location(name)")
      .eq("id", id)
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const getAllEvents = (data) =>
  new Promise((resolve, reject) => {
    const { page = 1, limit = 5, key, sort = "name", order = "true" } = data;
    const { from, to } = pagination(page, limit);
    const date = new Date();
    let query = supabase
      .from("event")
      .select("*, category(name), location(name)", { count: "exact" })
      .ilike("name", `%${key}%`)
      .gt("date_time_show", date.toISOString());

    if (sort === "name") {
      query = query.order("name", { ascending: JSON.parse(order) });
    }
    if (sort === "date") {
      query = query.order("date_time_show", { ascending: JSON.parse(order) });
    }

    query.range(from, to).then((result) => {
      if (!result.error) {
        resolve(result);
      } else {
        reject(result);
      }
    });
  });

const updateEvent = (body, params) =>
  new Promise((resolve, reject) => {
    const { name, category, location, date_time_show, detail, price } = body;
    const { id } = params;
    const updated_at = new Date();
    supabase
      .from("event")
      .update({
        name,
        category,
        location,
        date_time_show,
        detail,
        price,
        updated_at,
      })
      .eq("id", id)
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const deleteEvent = ({ id }) =>
  new Promise((resolve, reject) => {
    supabase
      .from("event")
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
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
