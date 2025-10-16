import './config/db';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './config/passport';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            domain: process.env.NODE_ENV === 'production' ? '.colechiodo.cc' : undefined,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', routes);
app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
        console.log('Route:', r.route.path, Object.keys(r.route.methods));
    }
});

export default app;
