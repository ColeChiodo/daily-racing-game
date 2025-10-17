import { Router } from 'express';
import passport from '../../config/passport';
import pool from '../../config/db';

const router = Router();

// Start Google OAuth login
router.get(
	'/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	async (req, res, next) => {
	try {
	const profile = req.user as any;

	if (!profile || !profile.id || !profile.emails?.[0]?.value) {
		throw new Error('Incomplete Google profile');
	}

	const email = profile.emails[0].value;
	const name = profile.displayName;
	const photo = profile.photos?.[0]?.value || null;

	// Upsert user in database
	const { rows } = await pool.query(
		'SELECT * FROM users WHERE google_id = $1',
		[profile.id]
	);

	if (rows.length === 0) {
		await pool.query(
			'INSERT INTO users (google_id, email, name, profile_image) VALUES ($1, $2, $3, $4)',
			[profile.id, email, name, photo]
		);
	} else {
		await pool.query(
			'UPDATE users SET email = $1, name = $2, profile_image = $3 WHERE google_id = $4',
			[email, name, photo, profile.id]
		);
	}

	// Explicitly log in the user
	req.login(profile, (err) => {
		if (err) return next(err);

		// Save session before redirect
		req.session.save((err) => {
			if (err) return next(err);

			// The cookie will now be sent automatically
			res.redirect(`${process.env.FRONTEND_URL}?login=success`);
		});
	});
	} catch (err) {
		console.error('Error handling Google OAuth callback:', err);
		res.redirect(`${process.env.FRONTEND_URL}?login=failure`);
	}
});

// Logout route
router.get('/logout', (req, res, next) => {
	req.logout(function(err) {
		if (err) return next(err);

		req.session.destroy((err) => {
		if (err) {
			console.error('Error destroying session:', err);
			return res.redirect(`${process.env.FRONTEND_URL}?logout=failure`);
		}

		// Clear cookie with the same options as the session cookie
		res.clearCookie('connect.sid', {
			path: '/',
			httpOnly: process.env.NODE_ENV === 'production',
			secure: process.env.NODE_ENV === 'production',
			sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			domain: process.env.NODE_ENV === 'production' ? '.dailyracer.colechiodo.cc' : undefined,
		});

		res.redirect(`${process.env.FRONTEND_URL}?logout=success`);
		});
	});
});

export default router;
