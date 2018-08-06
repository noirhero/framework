// Copyright 2018 TAP, Inc. All Rights Reserved.

var WebGL = WebGL || {};

WebGL.Resource = function(gl) {
  'use strict';

  this.gl_ = gl;
};

WebGL.Resource.prototype.Initialize = function() {};

WebGL.Resource.prototype.OnContextLost = function() {};

WebGL.Resource.prototype.CreateBuffer = function(target, src, usage) {
  'use strict';

  const gl = this.gl_;

  let buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, src, usage);

  return buffer;
};

WebGL.Resource.prototype.CreateShader = function(type, src) {
  'use strict';

  const gl = this.gl_;

  let shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('Compile shader failed.\n' + src + '\n + gl.getShaderInfoLog(shader)');
    shader = null;
  }

  return shader;
};

WebGL.Resource.prototype.CreateProgram = function(vs, fs)
{
  'use strict';

  const gl = this.gl_;

  let program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert('Prgram link failed.');
    program = null;
  }

  return program;
};
