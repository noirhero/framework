// Copyright TAP, Inc. All Rights Reserved.

WebGL.PipelineFont = function(gl) {
  'use strict';

  WebGL.Resource.call(this, gl);

  this.vs_ = null;
  this.fs_ = null;
  this.program_ = null;

  this.a_world_pos_ = null;
  this.a_tex_coord_ = null;
  this.u_font_texture_ = null;
  this.u_font_color_ = null;

  this.vertices_ = null;
  this.indices_ = null;
  this.vb_ = null;
  this.ib_ = null;
};

WebGL.PipelineFont.prototype = Object.create(WebGL.Resource.prototype);
WebGL.PipelineFont.prototype.constructor = WebGL.PipelineFont;

WebGL.PipelineFont.prototype.Initialize = function() {
  'use strict';

  const gl = this.gl_;

  let vs = this.CreateShader(gl.VERTEX_SHADER, [
    'attribute vec2 world_pos;',
    'attribute vec2 tex_coord;',

    'uniform mat4 vp_transform;',

    'varying vec2 out_tex_coord;',
    'varying float out_tex_index;',

    'void main() {',
    ' gl_Position = vp_transform * vec4(world_pos, 1.0);',
    ' out_tex_coord = tex_coord;',
    '}',
  ].join('\n'));

  let fs = this.CreateShader(gl.FRAGMENT_SHADER, [
    'precision mediump float;',

    'uniform sampler2D font_texture;',
    'uniform vec4 font_color;',

    'varying vec2 out_tex_coord;',

    'const float smoothing = 1.0 / 16.0;',

    'void main() {',
    '  float distance = texture2D(font_texture, out_tex_coord).r;',
    '  float alpha = smoothstep(0.5 - smoothing, 0.5 + smoothing, distance);',
    '  gl_FragColor = vec4(font_color.rgb, font_color.a * alpha);',
    '}',
  ].join('\n'));

  let program = this.CreateProgram(vs, fs);
  if(!program) {
    return false;
  }

  if(!this.vertices_) {
    this.vertices_ = this.FillVertices();
  }

  if(!this.indices_) {
    this.indices_ = this.FillIndices();
  }

  this.vb_ = this.CreateBuffer(gl.ARRAY_BUFFER, this.vertices_, gl.DYNAMIC_DRAW);
  this.ib_ = this.CreateBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices_, gl.STATIC_DRAW);

  return true;
};

WebGL.PipelineFont.prototype.OnContextLost = function() {
  'use strict';

  this.vs_ = null;
  this.fs_ = null;
  this.program_ = null;

  this.a_world_pos_ = null;
  this.a_tex_coord_ = null;
  this.u_font_texture_ = null;
  this.u_font_color_ = null;

  this.vb_ = null;
  this.ib_ = null;
};

WebGL.PipelineFont.prototype.FillVertices = function() {
  'use strict';

  const max_instance = CONST.NUM_MAX_INSTANCES;
  const stride = 16; // x, y, tu, tv

  let vertices = new Float32Array(max_instance * stride);

  let offset = 0;
  for(var i = 0; i < max_instance; ++i) {
    offset = i * stride;

    vertices[offset] = -0.5;
    vertices[offset + 1] = 0.5;
    vertices[offset + 2] = 0.0;
    vertices[offset + 3] = 1.0;

    vertices[offset + 4] = 0.5;
    vertices[offset + 5] = 0.5;
    vertices[offset + 6] = 1.0;
    vertices[offset + 7] = 1.0;

    vertices[offset + 8] = -0.5;
    vertices[offset + 9] = -0.5;
    vertices[offset + 10] = 0.0;
    vertices[offset + 11] = 0.0;

    vertices[offset + 12] = 0.5;
    vertices[offset + 13] = -0.5;
    vertices[offset + 14] = 1.0;
    vertices[offset + 15] = 0.0;
  }

  return vertices;
};

WebGL.PipelineFont.prototype.FillIndices = function() {
  'use strict';

  const max_instance = CONST.NUM_MAX_INSTANCES;
  const stride = CONST.QUAD_STRIDE;

  let indices = new Uint16Array(max_instance * CONST.INDEX_STRIDE_TWO_POLYGON);

  let offset_i = 0;
  let offset_v = 0;
  for(var i = 0; i < max_instance; ++i) {
    offset_v = i * stride;

    indices[offset_i++] = offset_v;
    indices[offset_i++] = offset_v + 1;
    indices[offset_i++] = offset_v + 2;
    indices[offset_i++] = offset_v + 2;
    indices[offset_i++] = offset_v + 1;
    indices[offset_i++] = offset_v + 3;
  }

  return indices;
};
