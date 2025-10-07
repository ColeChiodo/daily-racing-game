import { Router } from 'express';

const router = Router();

router.get('/me', (req, res) => {
	if (!req.isAuthenticated()) {
		return res.status(401).json({ user: null });
	}

	const profile = req.user as any;

	// Normalize into your own structure
	const user = {
		id: profile.id,
		name: profile.displayName, // or { givenName: profile.name.givenName, familyName: profile.name.familyName }
		email: profile.emails?.[0]?.value,
		picture: profile.photos?.[0]?.value || profile._json?.picture || null,
	};

	res.json({ user });
});

export default router;