// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/database.db3'
    },
    migrations: {
      directory: './data/migrations'
    },
    useNullAsDefault: true
  }
};
