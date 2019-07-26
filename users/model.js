const db = require('../data/config');

exports.create = user => {
  return db('users').insert(user);
};

exports.findBy = filter => {
  return db('users').where(filter);
};

exports.find = () => {
  return db('users');
};
