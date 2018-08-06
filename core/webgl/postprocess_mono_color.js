// Copyright TAP, Inc. All Rights Reserved.

WebGL.PostprocessMonoColor = function(gl) {
  'use strict';

  WebGL.Postprocess.call(this, gl);

  this.vb_ = null;
  this.ib_ = null;

  this.vs_ = null;
  this.fs_ = null;
  this.program_ = null;

  this.a_projection_pos_ = null;
  this.a_tex_coord_ = null;
  this.u_scene_color_ = null;
};

WebGL.PostprocessMonoColor.prototype = Object.create(WebGL.Postprocess.prototype);
WebGL.PostprocessMonoColor.prototype.constructor = WebGL.PostprocessMonoColor;

WebGL.PostprocessMonoColor.prototype.PostprocessInitialize = WebGL.Postprocess.prototype.Initialize;
WebGL.PostprocessMonoColor.prototype.Initialize = function() {
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
  this.program_ = program;
};

WebGL.PostprocessMonoColor.prototype.PostprocessOnContextLost = WebGL.Postprocess.prototype.OnContextLost;
WebGL.PostprocessMonoColor.prototype.OnContextLost = function() {
  'use strict';

  this.PostprocessOnContextLost();

  this.vb_ = null;
  this.ib_ = null;

  this.vs_ = null;
  this.fs_ = null;
  this.program_ = null;
};

WebGL.PostprocessMonoColor.prototype.CreateVertexBuffer = function() {
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

WebGL.PostprocessMonoColor.prototype.CreateIndexBuffer = function() {
  'use strict';

  const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

  this.ib_ = this.CreateBuffer(this.gl_.ELEMENT_ARRAY_BUFFER, indices, this.gl_.STATIC_DRAW);
};

WebGL.PostprocessMonoColor.prototype.CreateVertexShader = function() {
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

WebGL.PostprocessMonoColor.prototype.CreateFragmentShader = function() {
  'use strict';

  const src = [
    'precision mediump float;',

    'uniform sampler2D scene_color;',

    'varying vec2 out_tex_coord;',

    'void main() {',
    ' gl_FragColor.rgb = texture2D(scene_color, out_tex_coord).rgb * 0.25;',
    ' gl_FragColor.a = 1.0;',
    '}',
  ].join('\n');

  this.fs_ = this.CreateShader(this.gl_.FRAGMENT_SHADER, src);
};

WebGL.PostprocessMonoColor.prototype.End = function() {
  'use strict';

  const gl = this.gl_;

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.GREATER);

  gl.disable(gl.CULL_FACE);
  gl.frontFace(gl.CW);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  gl.clearColor(0.25, 0.25, 0.75, 1);
  gl.clearDepth(0);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(this.program_);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.scene_texture_);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ib_);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vb_);
  gl.vertexAttribPointer(this.a_projection_pos_, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(this.a_projection_pos_);
  gl.vertexAttribPointer(this.a_tex_coord_, 2, gl.FLOAT, false, 16, 8);
  gl.enableVertexAttribArray(this.a_tex_coord_);

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};