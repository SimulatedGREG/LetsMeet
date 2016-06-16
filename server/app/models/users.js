'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  local: {
    username: String,
    password: String,
    avatar: String,
  },
  github: {
    id: String,
    username: String,
    avatar: String,
  },
  facebook: {
    id: String,
    username: String,
    avatar: String,
  },
});

module.exports = mongoose.model('User', User);
