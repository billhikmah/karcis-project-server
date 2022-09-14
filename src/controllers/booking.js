/* eslint-disable camelcase */
const bookingModel = require("../models/booking");
const responseHandler = require("../utils/responseHandler");

const createBooking = async (req, res) => {
  try {
    const result = await bookingModel.createBooking(req.payload, req.body);
    const booking_id = result.data[0].id;
    const { section } = req.body;
    const createBookingSections = await Promise.all(
      section.map(async (elemen) => {
        try {
          await bookingModel.createBookingSection(booking_id, elemen, false);
          return elemen;
        } catch (error) {
          return error.error;
        }
      })
    );

    const data = { ...result.data[0], section: createBookingSections };
    return responseHandler(
      res,
      result.status,
      "Booking and booking section have been created.",
      data
    );
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const getBookingByUserId = async (req, res) => {
  try {
    const result = await bookingModel.getBookingByUserId(req.payload.user_id);
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Booking not found.", result.data);
    }
    return responseHandler(res, result.status, result.statusText, result.data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message);
  }
};

const getBookingSectionByEventId = async (req, res) => {
  try {
    const result = await bookingModel.getBookingSectionByEventId(
      req.params.event_id
    );
    if (result.data.length === 0) {
      return responseHandler(res, 404, "Booking not found.", result.data);
    }

    const sectionList = [];
    result.data.forEach((element) => {
      element.booking_section.forEach((sectionElements) => {
        sectionList.push(sectionElements.section);
      });
    });

    const countedSection = sectionList.reduce((container, section) => {
      const currentCount = container[section] || 0;
      return {
        ...container,
        [section]: currentCount + 1,
      };
    }, {});

    const capacity = [
      { section: "VVIP", capacity: 10 },
      { section: "VIP", capacity: 20 },
      { section: "REG", capacity: 30 },
    ];

    const data = [];
    // Get section name from countedSection
    Object.keys(countedSection).forEach((sectionName) => {
      // Get section capacity
      const sectionCapacity = capacity.filter((sectionKey) =>
        sectionName.includes(sectionKey.section)
      );

      const resultSection = {
        section: sectionName,
        booked: countedSection[sectionName],
        available: sectionCapacity[0].capacity - countedSection[sectionName],
        statusFull: sectionCapacity[0].capacity === countedSection[sectionName],
      };
      data.push(resultSection);
    });

    return responseHandler(res, result.status, result.statusText, data);
  } catch (error) {
    return responseHandler(res, error.status, error.error.message, null);
  }
};

module.exports = {
  createBooking,
  getBookingByUserId,
  getBookingSectionByEventId,
};
