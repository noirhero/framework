// Copyright TAP, Inc. All Rights Reserved.

WebGL.InstanceFont = function(font) {
  'use strict';

  this.font_ = font;

  this.x_ = 0;
  this.y_ = 0;
  this.width_ = 0;
  this.height_ = 0;
  this.text_ = null;
};

WebGL.InstanceFont.prototype = Object.create(WebGL.Instance.prototype);
WebGL.InstanceFont.prototype.constructor = WebGL.InstanceFont;
