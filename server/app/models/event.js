'use strict';

var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Event = new Schema({
  name: String,
  dates: Array,
  weekDays: Object,
  participants: Array,
  uid: String,
  selectedTimeRange: Array,
  owner: String,
});

module.exports = mongoose.model('Event', Event);
