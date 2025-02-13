const fieldParsers = {
  retailer: (val) => {
    if (typeof val !== "string") throw new Error(`value is not a string`);
    // remove non-matching characters
    const sanitized = val.replace(
      /[^\p{L}\p{N}\s'&!@#$%^&*(),.?":{}|<>+-]/gu,
      ""
    );
    if (sanitized.length < 1) throw new Error(`must be at least 1 character`);
    if (sanitized.length > 100)
      throw new Error(`must be less than or equal to 100 characters`);
    return sanitized;
  },

  purchaseDate: (val) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val))
      throw new Error(`format is invalid. Expecting YYYY-MM-DD`);

    const date = new Date(`${val}`);
    if (isNaN(date)) throw new Error(`not a valid date`);
    return date;
  },

  purchaseTime: (val) => {
    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(val)) return val;
    throw new Error(`invalid time of day`);
  },

  total: (val) => {
    const total = Number(val);
    if (isNaN(total)) throw new Error(`not a valid number`);
    // not handling refunds
    if (total <= 0) throw new Error(`should be greater than $0.00`);
    return val;
  },

  items: (val) => {
    if (!Array.isArray(val)) throw new Error(`should be an array`);
    if (val.length === 0) throw new Error(`array should not be empty`);
    val.forEach(({ shortDescription, price }, index) => {
      if (!shortDescription)
        throw new Error(
          `shortDescription missing from item at index: ${index}`
        );
      if (!price) throw new Error(`price missing from item at index: ${index}`);
    });

    return val;
  },
};

function jsonIsObject(req, res, next) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Request body is not an object" });
  }

  return next();
}

function bodyHasExpectedFields(req, res, next) {
  const { body } = req;
  const requiredFields = [
    "retailer",
    "purchaseDate",
    "purchaseTime",
    "total",
    "items",
  ];
  const fields = Object.keys(body);
  const missingFields = requiredFields.filter(
    (field) => !fields.includes(field)
  );

  if (missingFields.length) {
    const { originalUrl, method} = req;
    const missingFieldObjects = missingFields.map((mf) => ({
      title: "Missing required field",
      detail: `The '${mf}' field is required`,
      path: originalUrl,
      method: method,
      requestBody: body,
    }));
    return res.status(400).json({ errors: missingFieldObjects });
  }

  return next();
}

function bodyHasValidFieldValues(req, res, next) {
  // remove quotations from values in json body and compare with
  const fields = Object.entries(req.body);
  const errors = fields.reduce((acc, [key, value]) => {
    const parser = fieldParsers[key];
    try {
      parser(value);
      return acc;
    } catch (error) {
      return {
        ...acc,
        [key]: error.message,
      };
    }
  }, {});

  if (Object.keys(errors).length) {
    return res.status(401).json({ errors: errors });
  }

  return next();
}

const validateReceipt = [
  jsonIsObject,
  bodyHasExpectedFields,
  bodyHasValidFieldValues,
];
export default validateReceipt;
