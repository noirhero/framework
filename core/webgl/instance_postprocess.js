// Copyright TAP, Inc. All Rights Reserved.

WebGL.InstancePostprocess = function(gl) {
  'use strict';

  WebGL.Resource.call(this, gl);

  this.result_width_ = 0;
  this.result_height_ = 0;
  this.result_texture_ = null;
  this.result_frame_buffer_ = null;
};

WebGL.InstancePostprocess.prototype = Object.create(WebGL.Resource.prototype);
WebGL.InstancePostprocess.prototype.constructor = WebGL.InstancePostprocess;

WebGL.InstancePostprocess.prototype.Initialize = function() {
  'use strict';

  const gl = this.gl_;
  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  let texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  this.result_width_ = width;
  this.result_height_ = height;
  this.result_texture_ = texture;

  let frame_buffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.result_texture_, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  this.result_frame_buffer_ = frame_buffer;
};

WebGL.InstancePostprocess.prototype.OnCOntextLost = function() {
  'use strict';

  this.result_texture_ = null;
  this.result_frame_buffer_ = null;
};

WebGL.InstancePostprocess.prototype.Run = function(prev_result_texture) {
  'use strict';
};

WebGL.InstancePostprocess.prototype.GetResultTexture = function() {
  'use strict';
  return this.result_texture_;
};

WebGL.InstancePostprocess.prototype.GetResultFramebuffer = function() {
  'use strict';
  return this.result_frame_buffer_;
};
