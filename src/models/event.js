/* eslint-disable camelcase */
const supabase = require("../config/supabase");

const pagination = (inputPage, inputLimit) => {
  const page = Number(inputPage);
  const limit = Number(inputLimit) || 5;
  const from = page ? (page - 1) * limit : 0;
  const to = page ? from + limit - 1 : limit - 1;

  return { from, to };
};

const createEvent = (body, image) =>
  new Promise((resolve, reject) => {
    const { name, category, location, date_time_show, detail, price } = body;
    supabase
      .from("event")
      .insert([
        { name, category, location, detail, date_time_show, price, image },
      ])
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
    const {
      page = 1,
      limit = 5,
      key,
      sort = "name",
      order = "true",
      date,
    } = data;
    const { from, to } = pagination(page, limit);
    let query = supabase
      .from("event")
      .select("*, category(name), location(name)", { count: "exact" });

    // Filter by name
    if (key) {
      query = query.ilike(`"name"`, `%${key}%`);
    }

    // Only shows upcoming event
    if (!date) {
      const today = new Date();
      query = query.gt("date_time_show", today.toISOString());
    }

    // Filter by date
    if (date) {
      const today = new Date(date);
      const nextDay = new Date(new Date(today).setDate(today.getDate() + 1));

      query = query
        .gt("date_time_show", `${today.toISOString()}`)
        .lt("date_time_show", `${nextDay.toISOString()}`);
    }

    // Sort
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

const updateEvent = (body, params, image) =>
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
        image,
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
