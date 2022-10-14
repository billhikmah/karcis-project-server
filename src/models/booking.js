/* eslint-disable camelcase */
const supabase = require("../config/supabase");

const createBooking = (payload, body) =>
  new Promise((resolve, reject) => {
    const { user_id } = payload;
    const { event_id, total_payment, payment_method, payment_status, section } =
      body;
    const total_ticket = section.length;
    supabase
      .from("booking")
      .insert([
        {
          user_id,
          event_id,
          total_ticket,
          total_payment,
          payment_method,
          payment_status,
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

const createBookingSection = (booking_id, section, status_used) =>
  new Promise((resolve, reject) => {
    supabase
      .from("booking_section")
      .insert([
        {
          booking_id,
          section,
          status_used,
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

const getBookingByUserId = (user_id) =>
  new Promise((resolve, reject) => {
    supabase
      .from("booking")
      .select(
        `*, booking_section(*), user_id(id, name), event_id(id, name, date_time_show, location(id, name))`
      )
      .match({ user_id })
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });

const getBookingSectionByEventId = (event_id) =>
  new Promise((resolve, reject) => {
    supabase
      .from("booking")
      .select(`*, booking_section(section)`)
      .match({ event_id })
      .then((result) => {
        if (!result.error) {
          resolve(result);
        } else {
          reject(result);
        }
      });
  });
module.exports = {
  createBooking,
  createBookingSection,
  getBookingByUserId,
  getBookingSectionByEventId,
};
