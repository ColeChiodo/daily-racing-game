import { Router } from 'express';

const router = Router();

router.get('/me', (req, res) => {
	if (req.isAuthenticated()) {
        res.json({ user: req.user });
	} else {
		res.status(401).json({ user: null }); // <- send JSON, not redirect
	}
});

export default router;