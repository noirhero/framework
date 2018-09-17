// Copyright TAP, Inc. All Rights Reserved.

WebGL.InstancePostprocessTorch = function(gl) {
  'use strict';

  WebGL.InstancePostprocess.call(this, gl);

  this.vb_ = null;
  this.ib_ = null;

  this.vs_ = null;
  this.fs_ = null;
  this.program_ = null;

  this.a_projection_pos_ = null;
  this.a_tex_coord_ = null;
  this.u_scene_color_ = null;
  this.u_window_size_ = null;
  this.window_size_ = null;
  this.u_torch_radius_ = null;
};

WebGL.InstancePostprocessTorch.prototype = Object.create(WebGL.InstancePostprocess.prototype);
WebGL.InstancePostprocessTorch.prototype.constructor = WebGL.InstancePostprocessTorch;

WebGL.InstancePostprocessTorch.prototype.PostprocessInitialize = WebGL.InstancePostprocess.prototype.Initialize;
WebGL.InstancePostprocessTorch.prototype.Initialize = function() {
  'use strict';

  const gl = this.gl_;

  this.PostprocessInitialize();

  this.CreateVertexBuffer();
  this.CreateIndexBuffer();
  this.CreateVertexShader();
  this.CreateFragmentShader();

  let program = this.CreateProgram(this.vs_, this.fs_);
  this.a_projection_pos_ = gl.getAttribLocation(program, 'projection_pos');
  this.a_tex_coord_ = gl.getAttribLocation(program, 'tex_coord');
  this.u_scene_color_ = gl.getUniformLocation(program, 'scene_color');
  this.u_window_size_ = gl.getUniformLocation(program, 'window_size');
  this.u_torch_radius_ = gl.getUniformLocation(program, 'torch_radius');
  this.window_size_ = vec2.fromValues(this.scene_width_, this.scene_height_);
  this.program_ = program;
};

WebGL.InstancePostprocessTorch.prototype.PostprocessOnContextLost = WebGL.InstancePostprocess.prototype.OnContextLost;
WebGL.InstancePostprocessTorch.prototype.OnContextLost = function() {
  'use strict';

  this.PostprocessOnContextLost();

  this.vb_ = null;
  this.ib_ = null;

  this.vs_ = null;
  this.fs_ = null;
  this.program_ = null;
};

WebGL.InstancePostprocessTorch.prototype.CreateVertexBuffer = function() {
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

WebGL.InstancePostprocessTorch.prototype.CreateIndexBuffer = function() {
  'use strict';

  const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

  this.ib_ = this.CreateBuffer(this.gl_.ELEMENT_ARRAY_BUFFER, indices, this.gl_.STATIC_DRAW);
};

WebGL.InstancePostprocessTorch.prototype.CreateVertexShader = function() {
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

WebGL.InstancePostprocessTorch.prototype.CreateFragmentShader = function() {
  'use strict';

  const src = [
    'precision mediump float;',

    'uniform sampler2D scene_color;',
    'uniform vec2 window_size;',
    'uniform float torch_radius;',

    'varying vec2 out_tex_coord;',

    'void main() {',
    ' vec4 color = texture2D(scene_color, out_tex_coord);',

    ' vec2 window_center = vec2(window_size.x * 0.5, window_size.y * 0.5);',
    ' vec2 window_tex_coord = vec2(out_tex_coord.x * window_size.x, out_tex_coord.y * window_size.y);',

    ' float dist = distance(window_tex_coord, window_center);',
    ' float smoothing_dist = torch_radius * 1.5;',

     ' if(dist <= smoothing_dist && dist >= torch_radius) {',
     '  float est = (dist - smoothing_dist) / (torch_radius- smoothing_dist);',
     '  color.x *= est;',
     '  color.y *= est;',
     '  color.z *= est;',
     '  gl_FragColor = vec4(vec3(color), color.a);',
     '  return;',
     ' }',

    ' if(dist < torch_radius){',
    '  gl_FragColor = vec4(vec3(color), color.a);',
    '  return;',
    ' }',

    ' gl_FragColor = vec4(vec3(0, 0, 0), color.a);',
    '}',
  ].join('\n');

  this.fs_ = this.CreateShader(this.gl_.FRAGMENT_SHADER, src);
};

WebGL.InstancePostprocessTorch.prototype.Run = function(prev_result_texture) {
  'use strict';

  const gl = this.gl_;

  const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  const u_window_size_ = this.u_window_size_;
  const window_size_ = this.window_size_ = vec2.fromValues(width, height);
  const u_torch_radius_ = this.u_torch_radius_;

  let torch_radius = Math.random() * (150 - 140) + 140;

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.result_frame_buffer_);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(this.program_);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, prev_result_texture);

  gl.uniform2fv(u_window_size_, window_size_);
  gl.uniform1f(u_torch_radius_, torch_radius);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib_);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vb_);
  gl.vertexAttribPointer(this.a_projection_pos_, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(this.a_projection_pos_);
  gl.vertexAttribPointer(this.a_tex_coord_, 2, gl.FLOAT, false, 16, 8);
  gl.enableVertexAttribArray(this.a_tex_coord_);

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};
