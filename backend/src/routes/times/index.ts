import { Router } from 'express';
import { getTimes, createTime } from './timesController';

const router = Router();

router.get('/', getTimes);
router.post('/', createTime);

export default router;
