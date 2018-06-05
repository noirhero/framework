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

    for(var i = 0; i < num_instances; ++i) {
      var instance = instances_[i];

      if(false == instance.GetAnimation().BindTexture(0, u_albedo_)) {
        continue;
      }

      instance.FillVertices(vertices_, quad_position_);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer_);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices_);
      gl.vertexAttribPointer(a_local_pos_, 3, gl.FLOAT, false, 20, 0);
      gl.enableVertexAttribArray(a_local_pos_);
      gl.vertexAttribPointer(a_texcoord_pos_, 2, gl.FLOAT, false, 20, 12);
      gl.enableVertexAttribArray(a_texcoord_pos_);

      gl.uniformMatrix4fv(u_transform_w_, false, instance.GetWorldTransform());
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
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
      'attribute vec3 aLocalPos;',
      'attribute vec2 aTextureCoord;',

      'uniform mat4 uWorldTransform;',
      'uniform mat4 uViewProjectionTransform;',

      'varying vec2 vTextureCoord;',

      'void main() {',
      ' gl_Position = uViewProjectionTransform * /*uWorldTransform */ vec4(aLocalPos, 1.0);',
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

    a_local_pos_ = gl.getAttribLocation(program_, 'aLocalPos');
    a_texcoord_pos_ = gl.getAttribLocation(program_, 'aTextureCoord');
    u_transform_w_ = gl.getUniformLocation(program_, 'uWorldTransform');
    u_transform_vp_ = gl.getUniformLocation(program_, 'uViewProjectionTransform');
    u_albedo_ = gl.getUniformLocation(program_, 'uAlbedo');

    return true;
  }

  function CreateVertexBuffer_() {
    for(var i = 0; i < num_index_; ++i) {
      var offset = i * vertex_stride_;
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
    for(var i = 0; i < num_index_; ++i) {
      var offset = i * index_stride_;
      indices_[offset] = offset;
      indices_[offset + 1] = offset + 1;
      indices_[offset + 2] = offset + 2;
      indices_[offset + 3] = offset + 2;
      indices_[offset + 4] = offset + 1;
      indices_[offset + 5] = offset + 3;
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
  var a_local_pos_ = null;
  var a_texcoord_pos_ = null;
  var u_transform_w_ = null;
  var u_transform_vp_ = null;
  var u_albedo_ = null;

  var transform_vp_ = mat4.create();

  var num_vertex_ = 1;
  var vertex_stride_ = 20;
  var vertices_ = new Float32Array(num_vertex_ * vertex_stride_);

  var num_index_ = 1;
  var index_stride_ = 6;
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
