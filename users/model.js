const db = require('../data/config');

exports.create = user => {
  return db('users').insert(user);
};
