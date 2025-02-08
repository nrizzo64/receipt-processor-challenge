import Store from '../store.js'
export function process(req, res, next) {
    const id = Store.processReceipt(req.body);
    res.status(201).json(id)
    next();
}

export default process;