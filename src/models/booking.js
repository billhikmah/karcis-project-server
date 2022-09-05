/* eslint-disable camelcase */
const supabase = require("../config/supabase");

const createBooking = (params, body) =>
  new Promise((resolve, reject) => {
    const { user_id } = params;
    const {
      event_id,
      total_ticket,
      total_payment,
      payment_method,
      payment_status,
    } = body;

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

module.exports = { createBooking };
