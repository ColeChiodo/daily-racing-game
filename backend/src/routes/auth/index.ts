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
	async (req, res) => {
		try {
			const profile = req.user as any; // Passport attaches Google profile

			if (
				!profile ||
				!profile.id ||
				!profile.emails ||
				!profile.emails[0].value
			) {
				throw new Error('Incomplete Google profile');
			}

			// Check if user exists
			const { rows } = await pool.query(
				'SELECT * FROM users WHERE google_id = $1',
				[profile.id]
			);

			if (rows.length === 0) {
				// Insert new user
				await pool.query(
					'INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3)',
					[profile.id, profile.emails[0].value, profile.displayName]
				);
			}

			// Redirect to frontend after login
			res.redirect(`${process.env.FRONTEND_URL}?login=success`);
		} catch (err) {
			console.error('Error handling Google OAuth callback:', err);
			res.redirect(`${process.env.FRONTEND_URL}?login=failure`);
		}
	}
);

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.redirect(`${process.env.FRONTEND_URL}?logout=failure`);
            }
			console.log('Frontend URL:', process.env.FRONTEND_URL);

            res.clearCookie('connect.sid');
            res.redirect(`${process.env.FRONTEND_URL}?logout=success`);
        });
    });
});

export default router;
