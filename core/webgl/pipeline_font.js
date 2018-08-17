// Copyright TAP, Inc. All Rights Reserved.

WebGL.PipelineFont = function(gl) {
  'use strict';

  WebGL.Pipeline.call(this, gl);

  this.u_font_color_ = null;
};

WebGL.PipelineFont.prototype = Object.create(WebGL.Pipeline.prototype);
WebGL.PipelineFont.prototype.constructor = WebGL.PipelineFont;

WebGL.PipelineFont.prototype.CreateFragmentShader = function() {
  'use strict';

  const src = [
    'precision mediump float;',

    'uniform sampler2D sampler_sprite[' + CONST.NUM_MAX_TEXTURES + '];',
    'uniform vec4 font_color;',

    'varying vec2 out_tex_coord;',
    'varying float out_tex_index;',

    'const float smoothing = 1.0 / 16.0;',

    'float FindTexture(int tex_index) {',
    '  float color = 0.0;',
    '  for(int i = 0; i < ' + CONST.NUM_MAX_TEXTURES + '; ++i) {',
    '    if(i == tex_index) {',
    '      color = texture2D(sampler_sprite[i], out_tex_coord).r;',
    '      break;',
    '    }',
    '  }',
    '  return color;',
    '}',

    'void main() {',
    '  float distance = FindTexture(int(out_tex_index));',
    '  float alpha = smoothstep(0.5 - smoothing, 0.5 + smoothing, distance);',
    '  gl_FragColor = vec4(font_color.rgb, font_color.a * alpha);',
    '}',
  ].join('\n');

  return this.CreateShader(this.gl_.FRAGMENT_SHADER, src);
};

WebGL.PipelineFont.prototype.PipelineInitialize = WebGL.Pipeline.prototype.Initialize;
WebGL.PipelineFont.prototype.Initialize = function() {
  'use strict';

  this.PipelineInitialize();

  this.u_font_color_ = this.gl_.getUniformLocation(this.program_, 'font_color');
};

WebGL.PipelineFont.prototype.PipelineOnContextLost = WebGL.Pipeline.prototype.OnContextLost;
WebGL.PipelineFont.prototype.OnContextLost = function() {
  'use strict';

  this.OnContextLost();

  this.u_font_color_ = null;
};
