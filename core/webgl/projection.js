// Copyright 2018 TAP, Inc. All Rights Reserved.

function Projection() {
  'use strict';

  let projection_transform_ = mat4.create();
  let half_width_ = 0;
  let half_height_ = 0;

  this.GetTransform = function() {
    return projection_transform_;
  };

  this.SetFrustum = function(frustum) {
    half_width_ = frustum.width * 0.5;
    half_height_ = frustum.height * 0.5;

    mat4.ortho(projection_transform_, -half_width_, half_width_, -half_height_, half_height_, frustum.near, frustum.far);
  };
}
