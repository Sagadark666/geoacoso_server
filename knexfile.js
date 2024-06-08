// knexfile.js

const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'geoacoso.sqlite')
    },
    migrations: {
      directory: path.resolve(__dirname, 'src/migrations')
    },
    useNullAsDefault: true
  }
};
