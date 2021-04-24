import express from 'express';

import authRoute from './auth.route';
import usersRoute from './user.route';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', usersRoute);

export default router;
