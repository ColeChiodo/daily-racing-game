import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT) || 5432,
	ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.connect()
	.then((client) => {
		console.log('✅ Connected to PostgreSQL database');
		client.release();
	})
	.catch((err) => {
		console.error('❌ PostgreSQL connection error:', err.stack);
		process.exit(1);
	});

export default pool;
