// Copyright TAP, Inc. All Rights Reserved.

WebGL.PipelineFont = function(gl) {
  'use strict';

  WebGL.Pipeline.call(this, gl);
};

WebGL.PipelineFont.prototype = Object.create(WebGL.Pipeline.prototype);
WebGL.PipelineFont.prototype.constructor = WebGL.PipelineFont;

WebGL.PipelineFont.prototype.CreateFragmentShader = function() {
  'use strict';

  const src = [
    'precision mediump float;',

    'uniform sampler2D sampler_sprite[' + CONST.NUM_MAX_TEXTURES + '];',

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
    '  gl_FragColor = vec4(vec3(1.0), alpha);',
    '}',
  ].join('\n');

  return this.CreateShader(this.gl_.FRAGMENT_SHADER, src);
};

WebGL.PipelineFont.prototype.Run = function() {
  'use strict';

  const instances_ = this.instances_;
  const num_instances = instances_.length;
  if(0 === num_instances) {
    return;
  }

  const gl = this.gl_;

  const a_world_pos_ = this.a_world_pos_;
  const a_tex_coord_ = this.a_tex_coord_;
  const a_tex_index_ = this.a_tex_index_;
  const s_sprite_ = this.s_sprite_;
  const u_vp_transform_ = this.u_vp_transform_;
  const vertices_ = this.vertices_;
  const transform_vp_ = this.transform_vp_;

  const vertex_buffer_ = this.vertex_buffer_;
  const index_buffer_ = this.index_buffer_;

  let fill_index = 0;
  let instance = null;
  let current_texture = null;
  let bind_textures = [];
  let bind_texture_indices = [];

  const stride = CONST.VERTEX_STRIDE_X_Y_Z_TU_TV_TI;
  const quad_position = CONST.QUAD_POSITION;

  function DrawElements_() {
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices_);

    let num_bind_textures = bind_textures.length;
    for(let bi = 0; bi < num_bind_textures; ++bi) {
      bind_textures[bi].Bind(bi);
    }
    gl.uniform1iv(s_sprite_, bind_texture_indices);

    gl.drawElements(gl.TRIANGLES, fill_index * CONST.INDEX_STRIDE_TWO_POLYGON, gl.UNSIGNED_SHORT, 0);
  }

  gl.disable(gl.DEPTH_TEST);

  gl.useProgram(this.program_);
  gl.uniformMatrix4fv(u_vp_transform_, false, transform_vp_);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer_);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer_);
  gl.vertexAttribPointer(a_world_pos_, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(a_world_pos_);
  gl.vertexAttribPointer(a_tex_coord_, 2, gl.FLOAT, false, stride, 12);
  gl.enableVertexAttribArray(a_tex_coord_);
  gl.vertexAttribPointer(a_tex_index_, 1, gl.FLOAT, false, stride, 20);
  gl.enableVertexAttribArray(a_tex_index_);

  for(let i = 0; i < num_instances; ++i) {
    instance = instances_[i];
    current_texture = instance.GetTexture();

    if(!current_texture) {
      continue;
    }

    let texture_index = null;
    let num_bind_textures = bind_textures.length;
    for(let bi = 0; bi < num_bind_textures; ++bi) {
      if(bind_textures[bi] === current_texture) {
        texture_index = bi;
        break;
      }
    }

    if(null === texture_index) {
      if(false === current_texture.IsLoaded()) {
        continue;
      }

      if(CONST.NUM_MAX_TEXTURES <= num_bind_textures) {
        DrawElements_();

        fill_index = 0;
        num_bind_textures = 0;
        bind_textures.length = 0;
        bind_texture_indices.length = 0;
      }

      bind_textures[num_bind_textures] = current_texture;
      bind_texture_indices[num_bind_textures] = num_bind_textures;
      texture_index = num_bind_textures;
    }

    fill_index += instance.FillVertices(fill_index * stride, vertices_, quad_position, texture_index);
  }

  if(0 === fill_index) {
    return;
  }

  DrawElements_();
};
