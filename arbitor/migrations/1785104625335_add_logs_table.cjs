/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('logs', {
    id: 'id',
    level: { type: 'varchar(10)', notNull: true },
    method: { type: 'varchar(10)' },
    path: { type: 'varchar(2000)' },
    status_code: { type: 'integer' },
    ip: { type: 'varchar(100)' },
    duration_ms: { type: 'integer' },
    message: { type: 'text' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.createIndex('logs', 'created_at');
  pgm.createIndex('logs', 'level');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable({ name: 'logs' });
};
