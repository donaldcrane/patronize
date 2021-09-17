import Joi from "joi";

const validation = outgoing => {
  const schema = Joi.object({
    amount: Joi.number().integer().required().empty()
      .messages({
        "any.required": "An Amount is required.",
        "integer.empty": "Amount cannot be an empty field.",
        "integer.base": "Please provide a valid amount."
      }),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "uk", "co"] } }).min(5)
      .max(100)
      .empty()
      .messages({
        "any.required": "Sorry, email is required",
        "string.empty": "Sorry, Email cannot be an empty field",
        "string.email": "Please enter a valid email",
      }),
  }).messages({
    "object.unknown": "You have used an invalid key."
  }).options({ abortEarly: false });
  return schema.validate(outgoing);
};

const accountValidation = outgoing => {
  const schema = Joi.object({
    accountNo: Joi.number().required().empty()
      .messages({
        "any.required": "Account no is required.",
        "integer.empty": "Account no cannot be an empty field.",
        "integer.base": "Please provide a valid Account number."
      }),
    accountName: Joi.string().required().min(3).max(55)
      .empty()
      .messages({
        "any.required": "Sorry, Account Name is required",
        "string.alphanum": "Sorry, Account Name must contain only alphanumeric characters",
        "string.empty": "Account Name cannot be an empty field",
        "string.min": "Account Name should have a minimum length of 3 and a maximum length of 55"
      }),
    bankName: Joi.string().required().min(3).max(55)
      .empty()
      .messages({
        "any.required": "Sorry, Bank Name is required",
        "string.alphanum": "Sorry, Bank Name must contain only alphanumeric characters",
        "string.empty": "Bank Name cannot be an empty field",
        "string.min": "Bank Name should have a minimum length of 3 and a maximum length of 55"
      }),
  }).messages({
    "object.unknown": "You have used an invalid key."
  }).options({ abortEarly: false });
  return schema.validate(outgoing);
};
const validateId = ids => {
  const schema = Joi.object({
    id: Joi.string().required()
      .empty().guid({ version: "uuidv4" })
      .messages({
        "any.required": "ID not provided. Please provide an ID.",
        "string.empty": "ID cannot be an empty field.",
        "string.base": "ID must be a string.",
        "string.guid": "ID must be a UUID"
      }),
  }).messages({
    "object.unknown": "You have used an invalid key."
  }).options({ abortEarly: false });
  return schema.validate(ids);
};

export { validation, validateId, accountValidation };
