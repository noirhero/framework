function Instance(animation) {
  'use strict';

  /*
  public functions
  */
  this.Update = function(dt) {
    duration_ += dt;
  };

  this.FillVertices = function(dest_vertices, quad_position) {
    var current_texcoord = animation.GetTextureCoordinate(state_, duration_);

    var vertex_offset = 0;
    var texcoord_offset = 0;
    for(var i = 0; i < 4; ++i) {
      var world_position = world_position_[0];
      vec3.transformMat4(world_position, quad_position[i], world_transform_);

      dest_vertices[vertex_offset++] = world_position[0];
      dest_vertices[vertex_offset++] = world_position[1];
      dest_vertices[vertex_offset++] = world_position[2];
      dest_vertices[vertex_offset++] = current_texcoord[texcoord_offset++];
      dest_vertices[vertex_offset++] = current_texcoord[texcoord_offset++];
    }
  };

  this.SetState = function(new_state) {
    if(new_state === state_) {
      return;
    }

    state_ = new_state;
    duration_ = 0;
  };

  this.GetWorldTransform = function() {
    return world_transform_;
  };

  this.GetAnimation = function() {
    return animation;
  };

  this.GetTextureCoordinate = function() {
    return animation.GetTextureCoordinate(state_, duration_);
  };



  /*
  private functions
  */



  /*
  private variables
  */
  var world_transform_ = mat4.create();
  var world_position_ = [
    vec3.create(),
    vec3.create(),
    vec3.create(),
    vec3.create(),
  ];

  var state_ = 'idle_l';
  var duration_ = 0;
}
