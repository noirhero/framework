// Copyright 2018 TAP, Inc. All Rights Reserved.

WebGL.DebugDrawer = function(gl) {
  'use strict';

  WebGL.Pipeline.call(this, gl);

  this.u_color_ = null;
}

WebGL.DebugDrawer.prototype = Object.create(WebGL.Pipeline.prototype);
WebGL.DebugDrawer.prototype.constructor = WebGL.DebugDrawer;

WebGL.DebugDrawer.prototype.CreateVertexShader = function() {
  'use strict';

  const src = [
    'attribute vec3 world_pos;',

    'uniform mat4 vp_transform;',

    'void main() {',
    ' gl_Position = vp_transform * vec4(world_pos, 1.0);',
    '}',
  ].join('\n');

  return this.CreateShader(this.gl_.VERTEX_SHADER, src);
};

WebGL.DebugDrawer.prototype.CreateFragmentShader = function() {
  'use strict';

  const src = [
    'precision lowp float;',

    'uniform vec4 u_color;',

    'void main() {',
    ' gl_FragColor = vec4(1, 0, 0, 1);',
    ' if(0.0 == gl_FragColor.a) {',
    '   discard;',
    ' }',
    '}',
  ].join('\n');

  return this.CreateShader(this.gl_.FRAGMENT_SHADER, src);
};

WebGL.DebugDrawer.prototype.FillVertices = function() {
  'use strict';

  const max_instance = 2;
  const stride = 3;

  let vertices = new Float32Array(max_instance * stride);

  // vertices[0] = -0.5; // left-top
  // vertices[1] = 0.5;
  // vertices[2] = 1.0;
  
  // vertices[3] = 0.5;  // right-top
  // vertices[4] = 0.5;
  // vertices[5] = 1.0;

  // vertices[] = 0.5;  // right-bottom
  // vertices[] = -0.5;
  // vertices[] = -0.5; // left-bottom
  // vertices[] = -0.5;

  return vertices;
};

WebGL.DebugDrawer.prototype.Initialize = function() {
  'use strict';

  const gl = this.gl_;

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
  this.u_vp_transform_ = gl.getUniformLocation(program, 'vp_transform');
  this.u_color_ = gl.getUniformLocation(program, 'u_color');

  if(!this.vertices_) {
    this.vertices_ = this.FillVertices();
  }

  this.vertex_buffer_ = this.CreateVertexBuffer(this.vertices_);
  if(!this.vertex_buffer_) {
    return false;
  }

  return true;
}

WebGL.DebugDrawer.prototype.Run = function() {
  //const instances_ = this.instances_;
  //const num_instances = instances_.length;
  // if(0 === num_instances) {
  //   return;
  // }

  const gl = this.gl_;

  gl.disable(gl.DEPTH_TEST);

  const a_world_pos_ = this.a_world_pos_;
  const u_vp_transform_ = this.u_vp_transform_;
  const vertices_ = this.vertices_;
  const transform_vp_ = this.transform_vp_;
//  const u_color_ = this.u_color_;

  const vertex_buffer_ = this.vertex_buffer_;

  gl.useProgram(this.program_);

  const QUAD_POSITION = [
    vec3.fromValues(-0.5, 0.5, 0.0),
    vec3.fromValues(0.5, 0.5, 0.0),
  ];

  const quad_position = QUAD_POSITION;
  let world_position_ = vec3.create();
  let world_transform_ = mat4.create();
  //world_transform_[12] = 10;
  //world_transform_[13] = 100;

  world_transform_[0] = 100;
  
  vec3.transformMat4(world_position_, quad_position[0], world_transform_);
  vertices_[0] = world_position_[0];
  vertices_[1] = world_position_[1];
  vertices_[2] = world_position_[2];

  vec3.transformMat4(world_position_, quad_position[1], world_transform_);
  vertices_[3] = world_position_[0];
  vertices_[4] = world_position_[1];
  vertices_[5] = world_position_[2];

  // for(let i = 0; i < num_instances; ++i) {
  //   instance = instances_[i];
  //   current_animation = instance.GetAnimation();

  //   if(prev_bind_animation !== current_animation) {
  //     if(false == current_animation.BindTexture(0, s_sprite_)) {
  //       continue;
  //     }

  //     prev_bind_animation = current_animation;
  //   }

  //   instance.FillVertices(fill_index * stride, vertices_, quad_position);
  //   ++fill_index;
  // }

  // if(0 === fill_index) {
  //   return;
  // }
  const stride = 12;

  gl.uniformMatrix4fv(u_vp_transform_, false, transform_vp_);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer_);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices_);

  gl.vertexAttribPointer(a_world_pos_, 3, gl.FLOAT, false, stride, 0);
  gl.enableVertexAttribArray(a_world_pos_);

  gl.drawArrays(gl.LINES, 0, 2);
};