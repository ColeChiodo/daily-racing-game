import { Router } from 'express';
import userRouter from './user';
import timesRouter from './times';
import authRouter from './auth';

const router = Router();

router.use('/user', userRouter);
router.use('/times', timesRouter);
router.use('/auth', authRouter);

export default router;
