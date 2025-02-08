import express from 'express';
const router = express.Router();
import { process, calculatePoints } from '../controllers/receipts.controller.js';

router.route("/process").post(process)

router.route("/:id/points").get(calculatePoints)

export default router;