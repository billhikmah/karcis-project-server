const random = require("simple-random-number-generator");

const params = {
  min: 100000,
  max: 999,
  integer: true,
};
const a = random(params);
console.log(a);
