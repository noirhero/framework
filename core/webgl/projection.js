// Copyright 2018 TAP, Inc. All Rights Reserved.

function Projection() {
  'use strict';

  /*
  public functions
  */
  this.GetTransform = function() {
    return projection_transform_;
  };

  this.SetFrustum = function(frustum) {
    var half_width = frustum.width * 0.5;
    var half_height = frustum.height * 0.5;
    mat4.ortho(projection_transform_, -half_width, half_width, -half_height, half_height, frustum.near, frustum.far);
  };



  /*
  private variables
  */
  var projection_transform_ = mat4.create();
}
