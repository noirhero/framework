function Instance(animation) {
  'use strict';

  /*
  public functions
  */
  this.Update = function(dt) {
    duration_ += dt;
  };

  this.FillVertices = function(offset, dest_vertices, quad_position) {
    var current_texcoord = animation.GetTextureCoordinate(state_, duration_);

    var texcoord_offset = 0;
    for(var i = 0; i < 4; ++i) {
      vec3.transformMat4(world_position_, quad_position[i], world_transform_);

      dest_vertices[offset++] = world_position_[0];
      dest_vertices[offset++] = world_position_[1];
      dest_vertices[offset++] = world_transform_[13];
      dest_vertices[offset++] = current_texcoord[texcoord_offset++];
      dest_vertices[offset++] = current_texcoord[texcoord_offset++];
    }
  };

  this.SetState = function(new_state, duration) {
    if(new_state === state_) {
      return;
    }

    state_ = new_state;
    duration_ = (undefined !== duration) ? duration : 0;
  };

  this.GetWorldTransform = function() {
    return world_transform_;
  };

  this.GetAnimation = function() {
    return animation;
  };



  /*
  private functions
  */



  /*
  private variables
  */
  var world_transform_ = mat4.create();
  var world_position_ = vec3.create();

  var state_ = null;
  var duration_ = 0;
}
