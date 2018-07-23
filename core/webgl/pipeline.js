// Copyright 2018 TAP, Inc. All Rights Reserved.

WebGL.Pipeline = function(gl) {
  'use strict';

  WebGL.Resource.call(this, gl);

  this.vs_ = null;
  this.fs_ = null;
  this.program_ = null;

  this.a_world_pos_ = null;
  this.a_tex_coord_ = null;
  this.a_tex_index_ = null;
  this.u_vp_transform_ = null;
  this.s_sprite_ = null;

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
    console.error(gl.getShaderInfoLog(shader));
    alert('Compile shader failed.\n' + src + '\n');
    shader = null;
  }

  return shader;
};

WebGL.Pipeline.prototype.CreateVertexShader = function() {
  'use strict';

  const src = [
    'attribute vec3 world_pos;',
    'attribute vec2 tex_coord;',
    'attribute float tex_index;',

    'uniform mat4 vp_transform;',

    'varying vec2 out_tex_coord;',
    'varying float out_tex_index;',

    'void main() {',
    ' gl_Position = vp_transform * vec4(world_pos, 1.0);',
    ' out_tex_coord = tex_coord;',
    ' out_tex_index = tex_index;',
    '}',
  ].join('\n');

  return this.CreateShader(this.gl_.VERTEX_SHADER, src);
};

WebGL.Pipeline.prototype.CreateFragmentShader = function() {
  'use strict';

  const src = [
    'precision mediump float;',

    'uniform sampler2D sampler_sprite[' + CONST.NUM_MAX_TEXTURES + '];',

    'varying vec2 out_tex_coord;',
    'varying float out_tex_index;',

    'vec4 FindTexture(int tex_index) {',
    ' vec4 color = vec4(1.0);',
    ' for(int i = 0; i < ' + CONST.NUM_MAX_TEXTURES + '; ++i) {',
    '   if(i == tex_index) {',
    '     color = texture2D(sampler_sprite[i], out_tex_coord);',
    '     break;',
    '   }',
    ' }',
    ' return color;',
    '}',

    'void main() {',
    ' gl_FragColor = FindTexture(int(out_tex_index));',
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

  const max_instance = CONST.NUM_MAX_INSTANCES;
  const stride = CONST.VERTEX_STRIDE_X_Y_Z_TU_TV_TI;

  let vertices = new Float32Array(max_instance * stride);

  let offset = 0;
  for(var i = 0; i < max_instance; ++i) {
    offset = i * stride;

    vertices[offset] = -0.5;
    vertices[offset + 1] = 0.5;
    vertices[offset + 2] = 0.0;
    vertices[offset + 3] = 0.0;
    vertices[offset + 4] = 1.0;
    vertices[offset + 5] = 0.0;

    vertices[offset + 6] = 0.5;
    vertices[offset + 7] = 0.5;
    vertices[offset + 8] = 0.0;
    vertices[offset + 9] = 1.0;
    vertices[offset + 10] = 1.0;
    vertices[offset + 11] = 0.0;

    vertices[offset + 12] = -0.5;
    vertices[offset + 13] = -0.5;
    vertices[offset + 14] = 0.0;
    vertices[offset + 15] = 0.0;
    vertices[offset + 16] = 0.0;
    vertices[offset + 17] = 0.0;

    vertices[offset + 18] = 0.5;
    vertices[offset + 19] = -0.5;
    vertices[offset + 20] = 0.0;
    vertices[offset + 21] = 1.0;
    vertices[offset + 22] = 0.0;
    vertices[offset + 23] = 0.0;
  }

  return vertices;
};

WebGL.Pipeline.prototype.CreateVertexBuffer = function(src) {
  'use strict';

  return this.CreateBuffer(this.gl_.ARRAY_BUFFER, src, this.gl_.DYNAMIC_DRAW);
};

WebGL.Pipeline.prototype.FillIndices = function() {
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

WebGL.Pipeline.prototype.CreateIndexBuffer = function(src) {
  'use strict';

  return this.CreateBuffer(this.gl_.ELEMENT_ARRAY_BUFFER, src, this.gl_.STATIC_DRAW);
};

WebGL.Pipeline.prototype.Initialize = function() {
  'use strict';

  const gl = this.gl_;

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.GREATER);

  gl.disable(gl.CULL_FACE);
  gl.frontFace(gl.CW);
  gl.enable(gl.BLEND);
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

  this.a_world_pos_ = gl.getAttribLocation(program, 'world_pos');
  this.a_tex_coord_ = gl.getAttribLocation(program, 'tex_coord');
  this.a_tex_index_ = gl.getAttribLocation(program, 'tex_index');
  this.u_vp_transform_ = gl.getUniformLocation(program, 'vp_transform');
  this.s_sprite_ = gl.getUniformLocation(program, 'sampler_sprite');

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
  const a_tex_coord_ = this.a_tex_coord_;
  const a_tex_index_ = this.a_tex_index_;
  const s_sprite_ = this.s_sprite_;
  const u_vp_transform_ = this.u_vp_transform_;
  const vertices_ = this.vertices_;
  const transform_vp_ = this.transform_vp_;

  const vertex_buffer_ = this.vertex_buffer_;
  const index_buffer_ = this.index_buffer_;

  gl.useProgram(this.program_);

  let fill_index = 0;
  let instance = null;
  let current_texture = null;
  let bind_textures = [];

  const stride = CONST.VERTEX_STRIDE_X_Y_Z_TU_TV_TI;
  const quad_position = CONST.QUAD_POSITION;

  for(let i = 0; i < num_instances; ++i) {
    instance = instances_[i];
    current_texture = instance.GetTexture();

    if(!current_texture) {
      continue;
    }

    let texture_index = null;
    const num_bind_textures = bind_textures.length;
    for(let bi = 0; bi < num_bind_textures; ++bi) {
      if(bind_textures[bi] === current_texture) {
        texture_index = bi;
        break;
      }
    }

    if(null === texture_index) {
      if(false === current_texture.Bind(num_bind_textures, s_sprite_)) {
        continue;
      }

      bind_textures[num_bind_textures] = current_texture;
      texture_index = num_bind_textures;
    }

    instance.FillVertices(fill_index * stride, vertices_, quad_position, texture_index);
    ++fill_index;
  }

  if(0 === fill_index) {
    return;
  }

  gl.uniformMatrix4fv(u_vp_transform_, false, transform_vp_);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer_);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer_);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices_);

  gl.vertexAttribPointer(a_world_pos_, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(a_world_pos_);
  gl.vertexAttribPointer(a_tex_coord_, 2, gl.FLOAT, false, stride, 12);
  gl.enableVertexAttribArray(a_tex_coord_);
  gl.vertexAttribPointer(a_tex_index_, 1, gl.FLOAT, false, stride, 20);
  gl.enableVertexAttribArray(a_tex_index_);

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
