const { check } = require("express-validator");
const { validationResult } = require("express-validator");

exports.registerValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("First name is required!")
    .isString()
    .withMessage("must be a valid first name")
    .isLength({ min: 3, max: 25 })
    .withMessage("First name must be within 3 to 25 characters!"),
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid Email Address!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is Empty!")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least 6 characters"),
];

exports.loginValidator = [
  check("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email and/or Password must be Correct!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email and/or Password must be Correct!"),
];

exports.userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const error = result[0].msg;
  req.error = error;
  next();
};
