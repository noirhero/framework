// Copyright 2018 TAP, Inc. All Rights Reserved.

function Projection() {
  'use strict';

  const canvas_ = document.getElementById('main_canvas');

  let half_width_ = 0;
  let half_height_ = 0;

  let frustum_ = {
    x: 0,
    y: 0,
    width: 1920,
    height: 1200,
    near: -1000,
    far: 1000,
  };
  let projection_transform_ = mat4.create();

  this.Update = function() {
    frustum_.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    frustum_.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    canvas_.width = frustum_.width;
    canvas_.height = frustum_.height;

    half_width_ = frustum_.width * 0.5;
    half_height_ = frustum_.height * 0.5;

    mat4.ortho(projection_transform_, -half_width_, half_width_, -half_height_, half_height_, frustum_.near, frustum_.far);
  };

  this.GetFrustum = function() {
    return frustum_;
  };

  this.GetTransform = function() {
    return projection_transform_;
  };
}
