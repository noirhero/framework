function Pipeline(gl) {
  'use strict';

  /*
  public functions
  */
  this.Initialize = function() {
    if (false === CreateShadersAndLinkProgram_()) {
      return false;
    }

    CreateVertexBuffer_();
    CreateIndexBuffer_();

    return true;
  };

  this.OnContextLost = function() {
    // empty
  };

  this.UpdateViewProjection = function(camera, projection) {
    mat4.multiply(transform_vp_, projection.GetTransform(), camera.GetTransform());
  };

  this.Run = function() {
    var num_instances = instances_.length;
    if(0 === num_instances) {
      return;
    }

    gl.useProgram(program_);
    gl.uniformMatrix4fv(u_transform_vp_, false, transform_vp_);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer_);

    var fill_index = 0;
    for(var i = 0; i < num_instances; ++i) {
      var instance = instances_[i];

      if(false == instance.GetAnimation().BindTexture(0, u_albedo_)) {
        continue;
      }

      instance.FillVertices(fill_index * vertex_stride_, vertices_, quad_position_);
      ++fill_index;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer_);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices_);

    gl.vertexAttribPointer(a_world_pos_, 3, gl.FLOAT, false, vertex_stride_, 0);
    gl.enableVertexAttribArray(a_world_pos_);
    gl.vertexAttribPointer(a_texcoord_pos_, 2, gl.FLOAT, false, vertex_stride_, 12);
    gl.enableVertexAttribArray(a_texcoord_pos_);

    gl.drawElements(gl.TRIANGLES, fill_index * index_stride_, gl.UNSIGNED_SHORT, 0);
  };

  this.AddInstance = function(instance) {
    instances_[instances_.length] = instance;
  };

  this.RemoveInstance = function(instance) {
    instances_ = instances_.filter(function(iter_instance) {
      return iter_instance !== instance;
    });
  };



  /*
  private functions
  */
  function CreateShader_(type, src) {
    var shader = gl.createShader(type);
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
    if (null === vs_) {
      return false;
    }

    fs_ = CreateShader_(gl.FRAGMENT_SHADER, [
      'precision mediump float;',

      'uniform sampler2D uAlbedo;',

      'varying vec2 vTextureCoord;',

      'void main() {',
      ' gl_FragColor = texture2D(uAlbedo, vTextureCoord);',
      ' gl_FragColor.rgb *= gl_FragColor.a;',
      '}',
    ].join('\n'));
    if (null === fs_) {
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

  function CreateVertexBuffer_() {
    for(var i = 0; i < num_index_; ++i) {
      var offset = i * vertex_stride_;

      // x, y, z, tx, ty
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
    var offset_i = 0;
    for(var i = 0; i < num_index_; ++i) {
      var offset_v = i * quad_stride_;
      indices_[offset_i++] = offset_v;
      indices_[offset_i++] = offset_v + 1;
      indices_[offset_i++] = offset_v + 2;
      indices_[offset_i++] = offset_v + 2;
      indices_[offset_i++] = offset_v + 1;
      indices_[offset_i++] = offset_v + 3;
    }
    index_buffer_ = CreateBuffer_(gl.ELEMENT_ARRAY_BUFFER, indices_, gl.STATIC_DRAW);
  }

  function CreateBuffer_(target, src, usage) {
    var buffer = gl.createBuffer();
    gl.bindBuffer(target, buffer);
    gl.bufferData(target, src, usage);

    return buffer;
  }



  /*
  private variables
  */
  var program_ = null;
  var vs_ = null;
  var fs_ = null;
  var a_world_pos_ = null;
  var a_texcoord_pos_ = null;
  var u_transform_vp_ = null;
  var u_albedo_ = null;

  var transform_vp_ = mat4.create();

  var num_vertex_ = 100;
  var vertex_stride_ = 20;
  var vertices_ = new Float32Array(num_vertex_ * vertex_stride_);

  var num_index_ = 100;
  var index_stride_ = 6;
  var quad_stride_ = 4;
  var indices_ = new Uint16Array(num_index_ * index_stride_);

  var vertex_buffer_ = null;
  var index_buffer_ = null;

  var instances_ = [];
  var quad_position_ = [
    vec3.fromValues(-0.5, 0.5, 0.0),
    vec3.fromValues(0.5, 0.5, 0.0),
    vec3.fromValues(-0.5, -0.5, 0.0),
    vec3.fromValues(0.5, -0.5, 0.0),
  ];
}
