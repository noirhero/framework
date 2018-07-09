// Copyright 2018 TAP, Inc. All Rights Reserved.

Col.Sphere = function(x, y, r) {
  'use strict';

  this.data_ = new SAT.Circle(new SAT.Vector(x, y), r);
};

Col.Sphere.prototype = Object.create(Col.Shape.prototype);
Col.Sphere.prototype.constructor = Col.Sphere;
