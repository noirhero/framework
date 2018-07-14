// Copyright 2018 TAP, Inc. All Rights Reserved.

WebGL.Pipeline = function(gl) {
  'use strict';

  WebGL.Resource.call(this, gl);

  this.vs_ = null;
  this.fs_ = null;
  this.program_ = null;

  this.a_world_pos_ = null;
  this.a_texcoord_pos_ = null;
  this.u_transform_vp_ = null;
  this.u_albedo_ = null;

  this.transform_vp_ = mat4.create();

  this.vertices_ = null;
  this.indices_ = null;

  this.vertex_buffer_ = null;
  this.index_buffer_ = null;

  this.instances_ = [];
};

WebGL.Pipeline.prototype = Object.create(WebGL.Resource.prototype);
WebGL.Pipeline.prototype.constructor = WebGL.Pipeline;

WebGL.Pipeline.prototype.CreateShader = function(type, src) {
  'use strict';

  const gl = this.gl_;

  let shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('Compile shader failed.\n' + src + '\n');
    shader = null;
  }

  return shader;
};

WebGL.Pipeline.prototype.CreateVertexShader = function() {
  'use strict';

  const src = [
    'attribute vec3 aWorldPos;',
    'attribute vec2 aTextureCoord;',

    'uniform mat4 uViewProjectionTransform;',

    'varying vec2 vTextureCoord;',

    'void main() {',
    ' gl_Position = uViewProjectionTransform * vec4(aWorldPos, 1.0);',
    ' vTextureCoord = aTextureCoord;',
    '}',
  ].join('\n');

  return this.CreateShader(this.gl_.VERTEX_SHADER, src);
};

WebGL.Pipeline.prototype.CreateFragmentShader = function() {
  'use strict';

  const src = [
    'precision mediump float;',

    'uniform sampler2D uAlbedo;',

    'varying vec2 vTextureCoord;',

    'void main() {',
    ' gl_FragColor = texture2D(uAlbedo, vTextureCoord);',
    ' if(0.0 == gl_FragColor.a) {',
    '   discard;',
    ' }',
    '}',
  ].join('\n');

  return this.CreateShader(this.gl_.FRAGMENT_SHADER, src);
};

WebGL.Pipeline.prototype.CreateProgram = function(vs, fs)
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

WebGL.Pipeline.prototype.CreateBuffer = function(target, src, usage) {
  'use strict';

  const gl = this.gl_;

  let buffer = gl.createBuffer();
  gl.bindBuffer(target, buffer);
  gl.bufferData(target, src, usage);

  return buffer;
};

WebGL.Pipeline.prototype.FillVertices = function() {
  'use strict';

  let vertices = new Float32Array(CONST.NUM_MAX_INSTANCES * CONST.VERTEX_STRIDE_X_Y_Z_TU_TV);

  let offset = 0;
  for(var i = 0; i < CONST.NUM_MAX_INSTANCES; ++i) {
    offset = i * CONST.VERTEX_STRIDE_X_Y_Z_TU_TV;

    vertices[offset] = -0.5;
    vertices[offset + 1] = 0.5;
    vertices[offset + 2] = 0.0;
    vertices[offset + 3] = 0.0;
    vertices[offset + 4] = 1.0;

    vertices[offset + 5] = 0.5;
    vertices[offset + 6] = 0.5;
    vertices[offset + 7] = 0.0;
    vertices[offset + 8] = 1.0;
    vertices[offset + 9] = 1.0;

    vertices[offset + 10] = -0.5;
    vertices[offset + 11] = -0.5;
    vertices[offset + 12] = 0.0;
    vertices[offset + 13] = 0.0;
    vertices[offset + 14] = 0.0;

    vertices[offset + 15] = 0.5;
    vertices[offset + 16] = -0.5;
    vertices[offset + 17] = 0.0;
    vertices[offset + 18] = 1.0;
    vertices[offset + 19] = 0.0;
  }

  return vertices;
};

WebGL.Pipeline.prototype.CreateVertexBuffer = function(src) {
  'use strict';

  return this.CreateBuffer(this.gl_.ARRAY_BUFFER, src, this.gl_.DYNAMIC_DRAW);
};

WebGL.Pipeline.prototype.FillIndices = function() {
  'use strict';

  let indices = new Uint16Array(CONST.NUM_MAX_INSTANCES * CONST.INDEX_STRIDE_TWO_POLYGON);

  let offset_i = 0;
  let offset_v = 0;
  for(var i = 0; i < CONST.NUM_MAX_INSTANCES; ++i) {
    offset_v = i * CONST.QUAD_STRIDE;

    indices[offset_i++] = offset_v;
    indices[offset_i++] = offset_v + 1;
    indices[offset_i++] = offset_v + 2;
    indices[offset_i++] = offset_v + 2;
    indices[offset_i++] = offset_v + 1;
    indices[offset_i++] = offset_v + 3;
  }

  return indices;

};

WebGL.Pipeline.prototype.CreateIndexBuffer = function(src) {
  'use strict';

  return this.CreateBuffer(this.gl_.ELEMENT_ARRAY_BUFFER, src, this.gl_.STATIC_DRAW);
};

WebGL.Pipeline.prototype.Initialize = function() {
  'use strict';

  const gl = this.gl_;

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.GREATER);

  gl.disable(gl.CULL_FACE);  gl.frontFace(gl.CW);  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  gl.clearColor(0.25, 0.25, 0.75, 1);
  gl.clearDepth(0);

  let vs = this.CreateVertexShader();
  let fs = this.CreateFragmentShader();
  let program = this.CreateProgram(vs, fs);
  if(!program) {
    return false;
  }

  this.vs_ = vs;
  this.fs_ = fs;
  this.program_ = program;

  this.a_world_pos_ = gl.getAttribLocation(program, 'aWorldPos');
  this.a_texcoord_pos_ = gl.getAttribLocation(program, 'aTextureCoord');
  this.u_transform_vp_ = gl.getUniformLocation(program, 'uViewProjectionTransform');
  this.u_albedo_ = gl.getUniformLocation(program, 'uAlbedo');

  if(!this.vertices_) {
    this.vertices_ = this.FillVertices();
  }
  if(!this.indices_) {
    this.indices_ = this.FillIndices();
  }

  this.vertex_buffer_ = this.CreateVertexBuffer(this.vertices_);
  if(!this.vertex_buffer_) {
    return false;
  }

  this.index_buffer_ = this.CreateIndexBuffer(this.indices_);
  if(!this.index_buffer_) {
    return false;
  }

  return true;
};

WebGL.Pipeline.prototype.UpdateViewProjection = function(camera, projection) {
  'use strict';

  const frustum = projection.GetFrustum();
  this.gl_.viewport(frustum.x, frustum.y, frustum.width, frustum.height);

  mat4.multiply(this.transform_vp_, projection.GetTransform(), camera.GetTransform());
};

WebGL.Pipeline.prototype.Run = function() {
  const instances_ = this.instances_;
  const num_instances = instances_.length;
  if(0 === num_instances) {
    return;
  }

  const gl = this.gl_;

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const a_world_pos_ = this.a_world_pos_;
  const a_texcoord_pos_ = this.a_texcoord_pos_;
  const u_albedo_ = this.u_albedo_;
  const u_transform_vp_ = this.u_transform_vp_;
  const vertices_ = this.vertices_;
  const transform_vp_ = this.transform_vp_;

  const vertex_buffer_ = this.vertex_buffer_;
  const index_buffer_ = this.index_buffer_;

  gl.useProgram(this.program_);

  let fill_index = 0;
  let instance = null;
  let current_animation = null;
  let prev_bind_animation = null;

  for(let i = 0; i < num_instances; ++i) {
    instance = instances_[i];
    current_animation = instance.GetAnimation();

    if(prev_bind_animation !== current_animation) {
      if(false == current_animation.BindTexture(0, u_albedo_)) {
        continue;
      }

      prev_bind_animation = current_animation;
    }

    instance.FillVertices(fill_index * CONST.VERTEX_STRIDE_X_Y_Z_TU_TV, vertices_, CONST.QUAD_POSITION);
    ++fill_index;
  }

  if(0 === fill_index) {
    return;
  }

  gl.uniformMatrix4fv(u_transform_vp_, false, transform_vp_);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer_);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer_);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices_);

  gl.vertexAttribPointer(a_world_pos_, 3, gl.FLOAT, false, CONST.VERTEX_STRIDE_X_Y_Z_TU_TV, 0);
  gl.enableVertexAttribArray(a_world_pos_);
  gl.vertexAttribPointer(a_texcoord_pos_, 2, gl.FLOAT, false, CONST.VERTEX_STRIDE_X_Y_Z_TU_TV, 12);
  gl.enableVertexAttribArray(a_texcoord_pos_);

  gl.drawElements(gl.TRIANGLES, fill_index * CONST.INDEX_STRIDE_TWO_POLYGON, gl.UNSIGNED_SHORT, 0);
};

WebGL.Pipeline.prototype.AddInstance = function(instance) {
  'use strict';
  this.instances_[this.instances_.length] = instance;
};

WebGL.Pipeline.prototype.RemoveInstance = function(instance) {
  'use strict';

  this.instances_ = this.instances_.filter(function(iter_instance) {
    return iter_instance !== instance;
  });
};
