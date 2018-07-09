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

WebGL.Pipeline.prototype.Initialize = function() {
  'use strict';

  const gl = this.gl_;

  let vs_ = null;
  let fs_ = null;
  let program_ = null;

  let vertex_buffer_ = null;
  let vertices_ = null;

  let index_buffer_ = null;
  let indices_ = null;

  let a_world_pos_ = null;
  let a_texcoord_pos_ = null;
  let u_transform_vp_ = null;
  let u_albedo_ = null;

  function CreateShader_(type, src) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('Compile shader failed.\n' + src + '\n');
      shader = null;
    }

    return shader;
  }

  function CreateShadersAndLinkProgram_() {
    vs_ = CreateShader_(gl.VERTEX_SHADER, [
      'attribute vec3 aWorldPos;',
      'attribute vec2 aTextureCoord;',

      'uniform mat4 uViewProjectionTransform;',

      'varying vec2 vTextureCoord;',

      'void main() {',
      ' gl_Position = uViewProjectionTransform * vec4(aWorldPos, 1.0);',
      ' vTextureCoord = aTextureCoord;',
      '}',
    ].join('\n'));
    if (!vs_) {
      return false;
    }

    fs_ = CreateShader_(gl.FRAGMENT_SHADER, [
      'precision mediump float;',

      'uniform sampler2D uAlbedo;',

      'varying vec2 vTextureCoord;',

      'void main() {',
      ' gl_FragColor = texture2D(uAlbedo, vTextureCoord);',
      ' if(0.0 == gl_FragColor.a) {',
      '   discard;',
      ' }',
      '}',
    ].join('\n'));
    if (!fs_) {
      return false;
    }

    program_ = gl.createProgram();
    gl.attachShader(program_, vs_);
    gl.attachShader(program_, fs_);
    gl.linkProgram(program_);
    if (!gl.getProgramParameter(program_, gl.LINK_STATUS)) {
      alert('Prgram link failed.');
      vs_ = null;
      fs_ = null;
      program_ = null;
      return false;
    }

    a_world_pos_ = gl.getAttribLocation(program_, 'aWorldPos');
    a_texcoord_pos_ = gl.getAttribLocation(program_, 'aTextureCoord');
    u_transform_vp_ = gl.getUniformLocation(program_, 'uViewProjectionTransform');
    u_albedo_ = gl.getUniformLocation(program_, 'uAlbedo');

    return true;
  }

  function CreateBuffer_(target, src, usage) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, src, usage);

    return buffer;
  }

  function CreateVertexBuffer_() {
    vertices_ = new Float32Array(CONST.NUM_MAX_INSTANCES * CONST.VERTEX_STRIDE_X_Y_Z_TU_TV);

    let offset = 0;
    for(var i = 0; i < CONST.NUM_MAX_INSTANCES; ++i) {
      offset = i * CONST.VERTEX_STRIDE_X_Y_Z_TU_TV;

      vertices_[offset] = -0.5;
      vertices_[offset + 1] = 0.5;
      vertices_[offset + 2] = 0.0;
      vertices_[offset + 3] = 0.0;
      vertices_[offset + 4] = 1.0;

      vertices_[offset + 5] = 0.5;
      vertices_[offset + 6] = 0.5;
      vertices_[offset + 7] = 0.0;
      vertices_[offset + 8] = 1.0;
      vertices_[offset + 9] = 1.0;

      vertices_[offset + 10] = -0.5;
      vertices_[offset + 11] = -0.5;
      vertices_[offset + 12] = 0.0;
      vertices_[offset + 13] = 0.0;
      vertices_[offset + 14] = 0.0;

      vertices_[offset + 15] = 0.5;
      vertices_[offset + 16] = -0.5;
      vertices_[offset + 17] = 0.0;
      vertices_[offset + 18] = 1.0;
      vertices_[offset + 19] = 0.0;
    }
    vertex_buffer_ = CreateBuffer_(gl.ARRAY_BUFFER, vertices_, gl.DYNAMIC_DRAW);
  }

  function CreateIndexBuffer_() {
    indices_ = new Uint16Array(CONST.NUM_MAX_INSTANCES * CONST.INDEX_STRIDE_TWO_POLYGON);

    let offset_i = 0;
    let offset_v = 0;
    for(var i = 0; i < CONST.NUM_MAX_INSTANCES; ++i) {
      offset_v = i * CONST.QUAD_STRIDE;

      indices_[offset_i++] = offset_v;
      indices_[offset_i++] = offset_v + 1;
      indices_[offset_i++] = offset_v + 2;
      indices_[offset_i++] = offset_v + 2;
      indices_[offset_i++] = offset_v + 1;
      indices_[offset_i++] = offset_v + 3;
    }
    index_buffer_ = CreateBuffer_(gl.ELEMENT_ARRAY_BUFFER, indices_, gl.STATIC_DRAW);
  }

  if (false === CreateShadersAndLinkProgram_()) {
    return false;
  }

  CreateVertexBuffer_();
  CreateIndexBuffer_();

  this.vs_ = vs_;
  this.fs_ = fs_;
  this.program_ = program_;

  this.a_world_pos_ = a_world_pos_;
  this.a_texcoord_pos_ = a_texcoord_pos_;
  this.u_transform_vp_ = u_transform_vp_;
  this.u_albedo_ = u_albedo_;

  this.vertices_ = vertices_;
  this.indices_ = indices_;

  this.vertex_buffer_ = vertex_buffer_;
  this.index_buffer_ = index_buffer_;

  return true;
};

WebGL.Pipeline.prototype.UpdateViewProjection = function(camera, projection) {
  'use strict';

  mat4.multiply(this.transform_vp_, projection.GetTransform(), camera.GetTransform());
};

WebGL.Pipeline.prototype.Run = function() {
  const instances_ = this.instances_;
  const num_instances = instances_.length;
  if(0 === num_instances) {
    return;
  }

  const vertex_stride = 20; // x, y, z, tu, tv
  const index_stride = 6; // 2 polygon

  const gl = this.gl_;

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

  gl.vertexAttribPointer(a_world_pos_, 3, gl.FLOAT, false, vertex_stride, 0);
  gl.enableVertexAttribArray(a_world_pos_);
  gl.vertexAttribPointer(a_texcoord_pos_, 2, gl.FLOAT, false, vertex_stride, 12);
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
