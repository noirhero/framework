// Copyright TAP, Inc. All Rights Reserved.

WebGL.Postprocess = function(gl) {
  'ues strict';

  WebGL.Resource.call(this, gl);

  this.scene_width_ = 0;
  this.scene_height_ = 0;
  this.scene_texture_ = null;
  this.scene_buffer_ = null;
};

WebGL.Postprocess.prototype = Object.create(WebGL.Resource.prototype);
WebGL.Postprocess.prototype.constructor = WebGL.Postprocess;

WebGL.Postprocess.prototype.Initialize = function() {
  'use strict';

  this.CreateSceneTexture();
  this.CreateSceneBuffer();
};

WebGL.Postprocess.prototype.OnContextLost = function() {
  'use strict';

  this.scene_buffer_ = null;
  this.scene_texture_ = null;
};

WebGL.Postprocess.prototype.CreateSceneTexture = function() {
  'use strict;';

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

  this.scene_width_ = width;
  this.scene_height_ = height;
  this.scene_texture_ = texture;
};

WebGL.Postprocess.prototype.CreateSceneBuffer = function() {
  'ues strict;';

  const gl = this.gl_;

  let frame_buffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.scene_texture_, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  this.scene_buffer_ = frame_buffer;
};

WebGL.Postprocess.prototype.CreateVertexBuffer = function() {
  'use strict';

  const gl = this.gl_;

  gl.createVertexBuffer
};

WebGL.Postprocess.prototype.Begin = function() {
  'use strict';

  const gl = this.gl_;

  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  if(width !== this.scene_width_ || height !== this.scene_height_) {
    this.CreateSceneTexture();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene_buffer_);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.scene_texture_, 0);
  }
  else {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene_buffer_);
  }
};

WebGL.Postprocess.prototype.End = function() {
  'use strict';

  this.gl_.bindFramebuffer(this.gl_.FRAMEBUFFER, this.scene_buffer_);
};
