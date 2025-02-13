import Store from "../store.js";

function validateId(req, res, next) {
  const { id } = req.params;
  const receipt = Store.getReceipt(id);
  if (!receipt) {
    const { originalUrl, method, body } = req;
    return res.status(404).json({
      error: {
        title: "Resource Not Found",
        detail: "The requested receipt ID does not exist in the database.",
        path: originalUrl,
        method: method,
      },
      requestBody: body,
    });
  }

  res.locals.receipt = receipt;
  return next();
}



export default validateId;
