// Copyright 2018 TAP, Inc. All Rights Reserved.

var Col = Col || {};

Col.Scene = function() {
  'use strict';

  let shapes_ = [];
  let response_ = new SAT.Response();

  this.AssignmentBox = function(w, h) {
    let box = new SAT.Box(undefined, w, h);
    shapes_[shapes_.length] = box;

    return box;
  };

  this.Sweep = function(shape) {
    response_.clear();

    const num_shapes = shapes_.length;
    for(let i = 0; i < num_shapes; ++i) {
      const other_shape = shapes_[i];
      if(other_shape === shape) {
        continue;
      }


    }
  };
};
