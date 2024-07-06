import express from 'express';
import { createReferralProgram, joinWithReferralCode, } from '../controllers/referralController.js';
const router = express.Router();
router.post('/refer', createReferralProgram);
router.get('/:userId/:referralId', joinWithReferralCode);
export { router };
