// Copyright TAP, Inc. All Rights Reserved.

WebGL.Postprocess = function(gl) {
  'ues strict';

  WebGL.Resource.call(this, gl);

  this.scene_width_ = 0;
  this.scene_height_ = 0;
  this.scene_texture_ = null;
  this.scene_frame_buffer_ = null;
  this.scene_depth_buffer_ = null;

  this.vb_ = null;
  this.ib_ = null;

  this.vs_ = null;
  this.fs_ = null;
  this.program_ = null;

  this.a_projection_pos_ = null;
  this.a_tex_coord_ = null;
  this.u_scene_color_ = null;

  this.instances_ = [];
};

WebGL.Postprocess.prototype = Object.create(WebGL.Resource.prototype);
WebGL.Postprocess.prototype.constructor = WebGL.Postprocess;

WebGL.Postprocess.prototype.Initialize = function() {
  'use strict';

  const gl = this.gl_;

  this.CreateSceneTexture();
  this.CreateFrameBuffer();
  this.CreateDepthBuffer();

  this.CreateVertexBuffer();
  this.CreateIndexBuffer();
  this.CreateVertexShader();
  this.CreateFragmentShader();

  let program = this.CreateProgram(this.vs_, this.fs_);
  this.a_projection_pos_ = gl.getAttribLocation(program, 'projection_pos');
  this.a_tex_coord_ = gl.getAttribLocation(program, 'tex_coord');
  this.u_scene_color_ = gl.getUniformLocation(program, 'scene_color');
  this.program_ = program;
};

WebGL.Postprocess.prototype.OnContextLost = function() {
  'use strict';

  this.scene_depth_buffer_ = null;
  this.scene_frame_buffer_ = null;
  this.scene_texture_ = null;

  this.vb_ = null;
  this.ib_ = null;

  this.vs_ = null;
  this.fs_ = null;
  this.program_ = null;

  this.a_projection_pos_ = null;
  this.a_tex_coord_ = null;
  this.u_scene_color_ = null;
};

WebGL.Postprocess.prototype.AddInstance = function(instance) {
  'use strict';

  this.instances_[this.instances_.length] = instance;
};

WebGL.Postprocess.prototype.RemoInstance = function(instance) {
  'use strict';

  this.instances_ = this.instances_.filter(function(instance_iter) {
    return instance_iter !== instance;
  });
};

WebGL.Postprocess.prototype.CreateVertexBuffer = function() {
  'use strict';

  // x, y, tu, tv
  const vertices = new Float32Array([
    -1, 1, 0, 1,
    1, 1, 1, 1,
    -1, -1, 0, 0,
    1, -1, 1, 0,
  ]);

  this.vb_ = this.CreateBuffer(this.gl_.ARRAY_BUFFER, vertices, this.gl_.STATIC_DRAW);
};

WebGL.Postprocess.prototype.CreateIndexBuffer = function() {
  'use strict';

  const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

  this.ib_ = this.CreateBuffer(this.gl_.ELEMENT_ARRAY_BUFFER, indices, this.gl_.STATIC_DRAW);
};

WebGL.Postprocess.prototype.CreateVertexShader = function() {
  'use strict';

  const src = [
    'attribute vec2 projection_pos;',
    'attribute vec2 tex_coord;',

    'varying vec2 out_tex_coord;',

    'void main() {',
    ' gl_Position = vec4(projection_pos, 0.0, 1.0);',
    ' out_tex_coord = tex_coord;',
    '}',
  ].join('\n');

  this.vs_ = this.CreateShader(this.gl_.VERTEX_SHADER, src);
};

WebGL.Postprocess.prototype.CreateFragmentShader = function() {
  'use strict';

  const src = [
    'precision mediump float;',

    'uniform sampler2D scene_color;',

    'varying vec2 out_tex_coord;',

    'void main() {',
    ' gl_FragColor = texture2D(scene_color, out_tex_coord);',
    '}',
  ].join('\n');

  this.fs_ = this.CreateShader(this.gl_.FRAGMENT_SHADER, src);
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

WebGL.Postprocess.prototype.CreateFrameBuffer = function() {
  'ues strict;';

  const gl = this.gl_;

  let frame_buffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.scene_texture_, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  this.scene_frame_buffer_ = frame_buffer;
};

WebGL.Postprocess.prototype.CreateDepthBuffer = function() {
  'ues strict;';

  const gl = this.gl_;
  const frame_buffer = this.scene_frame_buffer_;

  gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);

  let depth_buffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depth_buffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.scene_width_, this.scene_height_);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth_buffer);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);

  this.scene_depth_buffer_ = depth_buffer;
};

WebGL.Postprocess.prototype.Begin = function() {
  'use strict';

  const num_instances = this.instances_.length;
  if(0 === num_instances) {
    return;
  }

  const gl = this.gl_;

  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  if(width !== this.scene_width_ || height !== this.scene_height_) {
    this.CreateSceneTexture();

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene_frame_buffer_);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.scene_texture_, 0);

    this.CreateDepthBuffer();
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.scene_frame_buffer_);
};

WebGL.Postprocess.prototype.End = function() {
  'use strict';

  const instances = this.instances_;
  const num_instances = instances.length;
  if(0 === num_instances) {
    return;
  }

  const gl = this.gl_;

  gl.disable(gl.DEPTH_TEST);

  instances[0].Run(this.scene_texture_);
  for(let i = 1; i < num_instances; ++i) {
    instances[i].Run(instances[i - 1].GetResultTexture());
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(this.program_);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, instances[num_instances - 1].GetResultTexture());

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib_);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vb_);
  gl.vertexAttribPointer(this.a_projection_pos_, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(this.a_projection_pos_);
  gl.vertexAttribPointer(this.a_tex_coord_, 2, gl.FLOAT, false, 16, 8);
  gl.enableVertexAttribArray(this.a_tex_coord_);

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};
