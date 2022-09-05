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

const getAllEvents = (query) =>
  new Promise((resolve, reject) => {
    const { from, to } = pagination(query.page, query.limit);
    const date = new Date();
    supabase
      .from("event")
      .select(
        `id, name, detail, date_time_show, price, category(name), location(name), image, updated_at, created_at`,
        { count: "exact" }
      )
      .gt("date_time_show", date.toISOString())
      .order("date_time_show", { ascending: true })
      .range(from, to)
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
      .select(
        "id, name, detail, date_time_show, price, category(name), location(name), image, updated_at, created_at"
      )
      .eq("id", id)
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const searchEvents = (data) =>
  new Promise((resolve, reject) => {
    const { page = 1, limit = 5, key, sort = "name", order = "true" } = data;
    const { from, to } = pagination(page, limit);
    const date = new Date();
    let query = supabase
      .from("event")
      .select(
        "id, name, detail, date_time_show, price, category(name), location(name), image, updated_at, created_at",
        { count: "exact" }
      )
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
    supabase
      .from("event")
      .update({ name, category, location, date_time_show, detail, price })
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
  searchEvents,
  updateEvent,
  deleteEvent,
};
