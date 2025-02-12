const fieldParsers = {
  retailer: (val) => {
    if (typeof val !== "string")
      throw new Error(`retailer value is not a string`);
    // remove non-matching characters
    const sanitized = val.replace(
      /[^\p{L}\p{N}\s'&!@#$%^&*(),.?":{}|<>+-]/gu,
      ""
    );
    if (sanitized.length < 1)
      throw new Error(`retailer string must be at least 1 character`);
    if (sanitized.length > 100)
      throw new Error(
        `retailer string must be less than or equal to 100 characters`
      );
    return sanitized;
  },

  purchaseDate: (val) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val))
      throw new Error(`purchaseDate format is invalid. Expecting YYYY-MM-DD`);

    const date = new Date(`${val}`);
    if (isNaN(date)) throw new Error(`purchaseDate is not a valid date`);
    return date;
  },

  purchaseTime: (val) => {
    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(val)) return val;
    throw new Error(`purchaseTime is invalid`);
  },

  total: (val) => {
    const total = Number(val);
    if (isNaN(total)) throw new Error(`total is not a valid number`);
    // not handling refunds
    if (total <= 0) throw new Error(`total should be greater than $0.00`);
    return val;
  },

  items: (val) => {
    if (!Array.isArray(val)) throw new Error(`items value should be an array`);
    if (val.length === 0) throw new Error(`items array should not be empty`);
    val.forEach(({ shortDescription, price }, index) => {
      if (!shortDescription)
        throw new Error(`shortDescription missing from item ${index}`);
      if (!price) throw new Error(`price missing from item ${index}`);
    });

    return val;
  },
};

function jsonIsObject(req, res, next) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ message: "Request body is not an object" });
  }

  next();
}

function bodyHasExpectedFields(req, res, next) {
  let message = "Missing required fields: ";
  // TODO
  const requiredFields = [
    "retailer",
    "purchaseDate",
    "purchaseTime",
    "total",
    "items",
  ];
  const fields = Object.keys(req.body);

  const missingFields = requiredFields.filter(
    (field) => !fields.includes(field)
  );

  if (missingFields.length > 0) {
    message += missingFields.join(", ");
    return res.status(400).json({ error: message });
  }

  next();
}

function bodyHasValidFieldValues(req, res, next) {
  const errors = [];
  // remove quotations from values in json body and compare with
  let message = "Incorrect values for fields: ";
  const fields = Object.entries(req.body);
  const parsedFields = fields.map(([key, value]) => {
    const parser = fieldParsers[key];
    try {
      return parser(value);
    } catch (error) {
      errors.push(error);
      return null;
    }
  });

  errors.forEach((e) => {
    const splitStack = e.stack.split("\n");
    console.error(`${splitStack[0]}\n${splitStack[1]}`);
  });
  if (errors.length) {
    return res.status(401).json({ errors: errors.map((e) => e.message) });
  }

  next();
}

const validateReceipt = [
  jsonIsObject,
  bodyHasExpectedFields,
  bodyHasValidFieldValues,
];
export default validateReceipt;
