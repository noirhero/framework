// Copyright 2018 TAP, Inc. All Rights Reserved.

WebGL.Instance = function() {
  'use strict';

  this.world_transform_ = mat4.create();
  this.world_position_ = vec3.create();
};

WebGL.Instance.prototype.GetWorldTransform = function() {
  'use strict';
  return this.world_transform_;
};
