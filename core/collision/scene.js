// Copyright 2018 TAP, Inc. All Rights Reserved.

var Col = Col || {};

Col.Scene = function() {
  'use strict';

  let shapes_ = [];
  let response_ = new SAT.Response();

  this.ReleaseShape = function(shape) {
    shapes_ = shapes_.filter((iter_shape)=>{
      return shape !== iter_shape;
    });
  };

  this.AssignmentBox = function(x, y, w, h) {
    let box = new Col.Box(x, y, w, h);
    shapes_[shapes_.length] = box;

    return box;
  };

  this.Sweep = function(shape) {
    let result = false;

    response_.clear();

    const num_shapes = shapes_.length;
    for(let i = 0; i < num_shapes; ++i) {
      const other_shape = shapes_[i];
      if(other_shape === shape) {
        continue;
      }

      const convex = shape.GetData().toPolygon();
      const other_convex = other_shape.GetData().toPolygon();

      if(false === SAT.testPolygonPolygon(other_convex, convex, response_)) {
        continue;
      }

      shape.AddTranslate(response_.overlapV.x, response_.overlapV.y);
      response_.clear();

      result = true;
    }

    return result;
  };
};
