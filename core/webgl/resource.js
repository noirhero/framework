// Copyright 2018 TAP, Inc. All Rights Reserved.

var WebGL = WebGL || {};

WebGL.Resource = function(gl) {
  'use strict';

  this.gl_ = gl;
};

WebGL.Resource.prototype.Initialize = function() {};

WebGL.Resource.prototype.OnContextLost = function() {};
