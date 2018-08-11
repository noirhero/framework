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

    'const float smoothing = 1.0/16.0;',

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
};
