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

  const max = CONST.NUM_MAX_DEBUG_DRAWING;
  const stride = CONST.VERTEX_STRIDE_X_Y_Z;

  let vertices = new Float32Array(max * stride);

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

  UpdateBounds(this);

  DrawBoxes(this.boxes_);
  DrawCircles(this.circles_);
  DrawLines(this.lines_);
  
  // Box ----------------
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

    for(let i = 0; i < num_boxes; ++i) {
      let fill_index = 0;
      let world_transform_ = boxes[i].GetWorldTransform();
      
      for(let j = 0; j < CONST.QUAD_STRIDE; ++j) {
        vec3.transformMat4(world_position_, quad_position[j], world_transform_);
        vertices_[fill_index++] = world_position_[0];
        vertices_[fill_index++] = world_position_[1];
        vertices_[fill_index++] = world_position_[2];
      }

      if(0 === fill_index) {
        continue;
      }

      gl.uniformMatrix4fv(u_vp_transform_, false, transform_vp_);
  
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer_);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices_);
    
      gl.vertexAttribPointer(a_world_pos_, 3, gl.FLOAT, false, CONST.VERTEX_STRIDE_X_Y_Z, 0);
      gl.enableVertexAttribArray(a_world_pos_);
    
      gl.drawArrays(gl.LINE_LOOP, 0, 4);
    }
  }

  // Circle ----------------
  function DrawCircles(circles) {
    const num_circles = circles.length;
    if(0 === num_circles) {
      return;
    }

    let fill_index = 0;
    const seg_radian = ((360 / CONST.DRAW_CIRCLE_SEGMENTS) / 180) * Math.PI;

    for(let i = 0; i < num_circles; ++i) {
      let radius = circles[i].radius;

      for(let j = 0; j < CONST.DRAW_CIRCLE_SEGMENTS; ++j) {
        let world_transform_ = circles[i].instance.GetWorldTransform();

        world_transform_[12] += Math.sin(seg_radian * j) * radius;
        world_transform_[13] += Math.cos(seg_radian * j) * radius;

        vertices_[fill_index++] = world_transform_[12];
        vertices_[fill_index++] = world_transform_[13];
        vertices_[fill_index++] = world_transform_[14];
      }

      if(0 === fill_index) {
        return;
      }
      
      gl.uniformMatrix4fv(u_vp_transform_, false, transform_vp_);
    
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer_);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices_);
    
      gl.vertexAttribPointer(a_world_pos_, 3, gl.FLOAT, false, CONST.VERTEX_STRIDE_X_Y_Z, 0);
      gl.enableVertexAttribArray(a_world_pos_);
    
      gl.drawArrays(gl.LINE_LOOP, 0, CONST.DRAW_CIRCLE_SEGMENTS);
    }
  }

  // Line ----------------
  function DrawLines(lines) {
    const num_lines = lines.length;
    if(0 === num_lines) {
      return;
    }

    const QUAD_POSITION = [
      vec3.fromValues(-0.5, 0.5, 0.0),
      vec3.fromValues(0.5, 0.5, 0.0)
    ];
  
    const quad_position = QUAD_POSITION;
    let world_position_ = vec3.create();

    let fill_index = 0;
    for(let i = 0; i < num_lines; ++i) {
      for(let j = 0; j < 2; ++j) {
        let world_transform_ = mat4.create();

        world_transform_[12] = (0 === j) ? lines[i].start_pos[0] : lines[i].end_pos[0];
        world_transform_[13] = (0 === j) ? lines[i].start_pos[1] : lines[i].end_pos[1];

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
  
    gl.vertexAttribPointer(a_world_pos_, 3, gl.FLOAT, false, CONST.VERTEX_STRIDE_X_Y_Z, 0);
    gl.enableVertexAttribArray(a_world_pos_);
  
    gl.drawArrays(gl.LINES, 0, 2 * lines.length);
  }

  // Bounds ---------------- (add to box/circle array after checking dirty)
  function UpdateBounds(debug_drawer) {
    let bounds = debug_drawer.bounds_;
    if(0 === bounds.length) {
      return;
    }

    for(let i = 0; i < bounds.length; ++i) {
      if(!bounds[i] || (true === bounds[i].dirty_)) {
        continue;
      }

      let new_box_instance = new WebGL.Instance();
      new_box_instance.world_transform_ = bounds[i].instance_.GetWorldTransform();
    
      let boxes = debug_drawer.boxes_;
      boxes.push(new_box_instance);

      if(bounds[i].sphere_) {
        let new_circle_instance = new WebGL.Instance();
        new_circle_instance.world_transform_ = bounds[i].instance_.GetWorldTransform();

        let r = bounds[i].sphere_.r;
        let new_circle = {instance: new_circle_instance, radius: r};

        let circles = debug_drawer.circles_;
        circles.push(new_circle);
      }

      // Remove element
      bounds.splice(i, 1);
      --i;
    }
  }

  


 
 
//  const u_color_ = this.u_color_;
};


WebGL.DebugDrawer.prototype.DrawBox = function(pos, w, h) {
  'use strict';

  let new_instance = new WebGL.Instance();
  let wtm = new_instance.GetWorldTransform();
  wtm[12] = pos[0];
  wtm[13] = pos[1];
  wtm[0] = w;
  wtm[5] = h;

  this.boxes_.push(new_instance);
}

WebGL.DebugDrawer.prototype.DrawLine = function(start, end) {
  'use strict';

  let new_line = {start_pos: start, end_pos: end};
  this.lines_.push(new_line);
}

WebGL.DebugDrawer.prototype.DrawCircle = function(center, radius) {
  'use strict';

  let new_instance = new WebGL.Instance();
  let wtm = new_instance.GetWorldTransform();
  wtm[12] = center[0];
  wtm[13] = center[1];

  let new_circle = {instance: new_instance, radius: radius};
  this.circles_.push(new_circle);
}

WebGL.DebugDrawer.prototype.DrawBound = function(bound) {
  'use strict';

  this.bounds_.push(bound);
}

WebGL.DebugDrawer.prototype.ClearAllBox = function() {
  'use strict';

  this.boxes_ = [];
}