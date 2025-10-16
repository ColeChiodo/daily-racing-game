import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 5,                    // number of connections in pool
  idleTimeoutMillis: 30000,  // close idle connections after 30s
  connectionTimeoutMillis: 20000, // timeout when connecting
});

pool.connect()
  .then(client => {
    console.log(`✅ Connected to PostgreSQL database via ${process.env.DB_POOL_MODE} mode`);
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection error:', err.stack);
    process.exit(1);
  });

export default pool;