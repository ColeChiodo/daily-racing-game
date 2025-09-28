/* eslint-disable @typescript-eslint/no-var-requires */
exports.up = (pgm) => {
	pgm.createTable('users', {
		id: {
			type: 'serial',
			primaryKey: true,
		},
		google_id: {
			type: 'varchar(255)',
			notNull: true,
			unique: true,
		},
		email: {
			type: 'varchar(255)',
			notNull: true,
			unique: true,
		},
		name: {
			type: 'varchar(255)',
			notNull: true,
		},
		created_at: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
		updated_at: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
	});
};

exports.down = (pgm) => {
	pgm.dropTable('users');
};
