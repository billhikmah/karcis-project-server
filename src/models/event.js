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

const getAllEvents = (body) =>
  new Promise((resolve, reject) => {
    const { from, to } = pagination(body.page, body.limit);
    supabase
      .from("event")
      .select("*")
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

module.exports = { createEvent, getAllEvents, getEventById };
