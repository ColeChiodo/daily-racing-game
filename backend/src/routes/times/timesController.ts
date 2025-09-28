import { Request, Response } from 'express';
import pool from '../../config/db';

export const getTimes = async (req: Request, res: Response) => {
	try {
		const result = await pool.query('SELECT * FROM times');
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Database error' });
	}
};

export const createTime = async (req: Request, res: Response) => {
	const { name, duration } = req.body;
	try {
		const result = await pool.query(
			'INSERT INTO times (name, duration) VALUES ($1, $2) RETURNING *',
			[name, duration]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Database error' });
	}
};
