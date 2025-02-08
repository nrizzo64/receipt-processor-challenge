import express from 'express';
const router = express.Router();
import { process } from '../controllers/receipts.controller.js';

router.route("/process").post(process)

export default router;