// routes/emailRoutes.js
import express from 'express';
import { sendResetEmail } from '../controllers/ResetPassword.js';

const router = express.Router();

router.post('/send-reset-email', sendResetEmail);

export default router;
