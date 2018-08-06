// Copyright 2018 TAP, Inc. All Rights Reserved.

WebGL.DebugDrawer = function(gl) {
  'use strict';

  WebGL.Pipeline.call(this, gl);

  this.u_color_ = null;

  this.boxes_ = [];
  this.circles_ = [];
  this.lines_ = [];
  this.bounds_ = [];
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

  let vertices = new Float32Array(24);

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

  const gl = this.gl_;

  gl.disable(gl.DEPTH_TEST);

  const a_world_pos_ = this.a_world_pos_;
  const u_vp_transform_ = this.u_vp_transform_;
  const vertices_ = this.vertices_;
  const transform_vp_ = this.transform_vp_;
  const vertex_buffer_ = this.vertex_buffer_;

  gl.useProgram(this.program_);
  
  // separate each part
  function DrawBoxes(boxes) {
    const num_boxes = boxes.length;
    if(0 === num_boxes) {
      return;
    }

    const QUAD_POSITION = [
      vec3.fromValues(-0.5, 0.5, 0.0),
      vec3.fromValues(0.5, 0.5, 0.0),
      vec3.fromValues(0.5, -0.5, 0.0),
      vec3.fromValues(-0.5, -0.5, 0.0)
    ];
  
    const quad_position = QUAD_POSITION;
    let world_position_ = vec3.create();
    let world_transform_ = mat4.create();

    let fill_index = 0;
    for(let i = 0; i < num_boxes; ++i) {
      world_transform_[12] = boxes[i].pos[0];
      world_transform_[13] = boxes[i].pos[1];

      world_transform_[0] = boxes[i].width;
      world_transform_[5] = boxes[i].height;
      
      for(let j = 0; j < CONST.QUAD_STRIDE; ++j) {
        vec3.transformMat4(world_position_, quad_position[j], world_transform_);
        vertices_[fill_index++] = world_position_[0];
        vertices_[fill_index++] = world_position_[1];
        vertices_[fill_index++] = world_position_[2];
      }
    }
  
    if(0 === fill_index) {
      return;
    }
    
    gl.uniformMatrix4fv(u_vp_transform_, false, transform_vp_);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer_);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices_);
  
    gl.vertexAttribPointer(a_world_pos_, 3, gl.FLOAT, false, 12, 0);
    gl.enableVertexAttribArray(a_world_pos_);
  
    gl.drawArrays(gl.LINE_LOOP, 0, 4);
  }

  function DrawCircles() {

  }

  function DrawLines() {

  }

  function DrawBounds(bounds) {
    const num_bounds = bounds.length;
    if(0 === num_bounds) {
      return;
    }

    for(let i = 0; i < num_bounds; ++i) {
      if(!bounds[i].box_) {
        continue;
      }

      console.log(bounds[0].box_);
    }
  }

  DrawBoxes(this.boxes_);
  //DrawBounds(this.bounds_);

 
//  const u_color_ = this.u_color_;


};




WebGL.DebugDrawer.prototype.DrawBox = function(pos, w, h) {
  'use strict';

  let new_box = {pos: pos, width: w, height: h};

  //this.boxes_[this.boxes_.length] = new_box;

  if(0 === this.boxes_.length) {
    this.boxes_.push(new_box);
  }
  
  console.log("DrawBox");
  console.log(this.boxes_);
}

WebGL.DebugDrawer.prototype.DrawBound = function(bound) {
  'use strict';

  this.bounds_.push(bound);

  //console.log(bound.instance_.GetWorldTransform());
  //console.log(this.bounds_);
}

WebGL.DebugDrawer.prototype.ClearAllBox = function() {
  'use strict';

  this.boxes_ = [];
}