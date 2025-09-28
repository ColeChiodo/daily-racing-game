import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: `${backendUrl}/auth/google/callback`,
		},
		(accessToken, refreshToken, profile, done) => {
			// Save profile info to DB if needed
			return done(null, profile);
		}
	)
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

export default passport;
