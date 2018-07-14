// Copyright 2018 TAP, Inc. All Rights Reserved.

function Instance(animation) {
  'use strict';

  let world_transform_ = mat4.create();
  let world_position_ = vec3.create();

  let state_ = {
    state: null,
    duration: 0,
  };

  this.Update = function(dt) {
    state_.duration += dt * 1000;
  };

  this.FillVertices = function(offset, dest_vertices, quad_position) {
    const current_texcoord = animation.GetTextureCoordinate(state_);

    let texcoord_offset = 0;
    for(let i = 0; i < 4; ++i) {
      vec3.transformMat4(world_position_, quad_position[i], world_transform_);

      dest_vertices[offset++] = world_position_[0];
      dest_vertices[offset++] = world_position_[1];
      dest_vertices[offset++] = world_transform_[13];
      dest_vertices[offset++] = current_texcoord[texcoord_offset++];
      dest_vertices[offset++] = current_texcoord[texcoord_offset++];
    }
  };

  this.GetState = function() {
    return state_.state;
  };

  this.SetState = function(new_state, duration) {
    if(new_state === state_.state) {
      return;
    }

    state_.state = new_state;
    state_.duration = (undefined !== duration) ? duration : 0;
  };

  this.GetWorldTransform = function() {
    return world_transform_;
  };

  this.GetAnimation = function() {
    return animation;
  };
}
