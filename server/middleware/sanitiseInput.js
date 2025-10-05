const xss = require("xss");

const deepSanitize = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === "object") {
      deepSanitize(obj[key]);
    }
  }
  return obj;
};

module.exports = (req, res, next) => {
  if (req.body) deepSanitize(req.body);
  if (req.query) deepSanitize(req.query);
  if (req.params) deepSanitize(req.params);
  next();
};
