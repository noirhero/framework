// Copyright 2018 TAP, Inc. All Rights Reserved.

var Math = Math || {};

Math.RandomRanged = function(min, max) {
  'use strict';
  return Math.random() * (max - min) + min;
};

Math.Clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};
