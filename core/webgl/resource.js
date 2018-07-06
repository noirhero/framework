// Copyright 2018 TAP, Inc. All Rights Reserved.

var WebGL = WebGL || {};

WebGL.Resource = function(gl) {
  'use strict';

  this.gl_ = gl;
};

WebGL.Resource.prototype.Initialize = function() {
  'use strict';
};

WebGL.Resource.prototype.OnContextLost = function() {
  'use strict';
};
