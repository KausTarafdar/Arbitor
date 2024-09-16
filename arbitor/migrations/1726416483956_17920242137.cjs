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
    pgm.createTable('services', {
      id: 'id',
      api_name: { type: 'varchar(1000)', notNull: true , primaryKey: true},
      api_key: {type: 'varchar(1000)', notNull: true, primaryKey: true},
      endpoint: {type: 'varchar(1000)', notNull: true, primaryKey: true},
      base_url: {type: 'varchar(1000)', notNull: true, primaryKey: true},
      port: {type: 'varchar(1000)', notNull: true, primaryKey: true},
      access_type: {type: 'varchar(1000)', notNull: true},
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
    });
    pgm.createTable('flagged_services', {
      id: 'id',
      api_name: { type: 'varchar(1000)', notNull: true, primaryKey: true },
      base_url: { type: 'varchar(1000)', notNull: true, primaryKey: true },
      port: { type: 'varchar(1000)', notNull: true, primaryKey: true},
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable({name: 'services'})
  pgm.dropTable({name: 'flagged_services'})
};
