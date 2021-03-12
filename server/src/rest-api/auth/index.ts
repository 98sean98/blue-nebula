import express, { Router } from 'express';

import { login } from './login';
import { logout } from './logout';
import { isAuthenticated } from './isAuthenticated';

// eslint-disable-next-line new-cap
const router: Router = express.Router();

router.post('/login', login);

router.post('/logout', logout);

router.get('/isAuthenticated', isAuthenticated);

export { router as auth };
