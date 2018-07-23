// Copyright TAP, Inc. All Right Reserved.

WebGL.InstanceAnimation = function(animation) {
  'use strict';

  WebGL.Instance.call(this);

  this.animation_ = animation;
  this.state_ = {
    name: null,
    duration: 0,
  };
};

WebGL.InstanceAnimation.prototype = Object.create(WebGL.Instance.prototype);
WebGL.InstanceAnimation.prototype.constructor = WebGL.InstanceAnimation;

WebGL.InstanceAnimation.prototype.GetState = function() {
  'use strict';
  return this.state_.name;
};

WebGL.InstanceAnimation.prototype.SetState = function(new_state, duration) {
  'use strict';

  let state = this.state_;
  if(new_state === state.name) {
    return;
  }

  state.name = new_state;
  state.duration = (undefined !== duration) ? duration : 0;
};

WebGL.InstanceAnimation.prototype.GetAnimation = function() {
  'use strict';
  return this.animation_;
};

WebGL.InstanceAnimation.prototype.GetTexture = function() {
  'use strict';
  return this.animation_.GetTexture();
};

WebGL.InstanceAnimation.prototype.Update = function(dt) {
  'use strict';
  this.state_.duration += dt * 1000;
};

WebGL.InstanceAnimation.prototype.FillVertices = function(offset, dest_vertices, quad_position) {
  'use strict';

  const world_transform = this.world_transform_;
  const current_texcoord = this.animation_.GetTextureCoordinate(this.state_);
  let world_position = this.world_position_;

  let texcoord_offset = 0;
  for(let i = 0; i < 4; ++i) {
    vec3.transformMat4(world_position, quad_position[i], world_transform);

    dest_vertices[offset++] = world_position[0];
    dest_vertices[offset++] = world_position[1];
    dest_vertices[offset++] = world_transform[13];
    dest_vertices[offset++] = current_texcoord[texcoord_offset++];
    dest_vertices[offset++] = current_texcoord[texcoord_offset++];
  }
};
