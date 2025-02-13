import express from 'express';
const router = express.Router();
import { process, calculatePoints } from '../controllers/receipts.controller.js';
import validateReceipt from '../middleware/receiptValidation.js'
import validateId from '../middleware/idValidation.js';

router.route("/process").post(validateReceipt, process)

router.route("/:id/points").get(validateId, calculatePoints)

export default router;