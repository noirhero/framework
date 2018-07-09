// Copyright 2018 TAP, Inc. All Rights Reserved.

Col.Box = function(x, y, w, h) {
  'use strict';

  this.data_ = new SAT.Box(new SAT.Vector(x, y), w, h);
};

Col.Box.prototype = Object.create(Col.Shape.prototype);
Col.Box.prototype.constructor = Col.Box;
