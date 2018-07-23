// Copyright TAP, Inc. All Right Reserverd.

WebGL.InstanceTexture = function(texture, pos_z) {
  'use strict';

  WebGL.Instance.call(this);

  this.texture_ = texture;
  this.pos_z_ = pos_z || 0;
};

WebGL.InstanceTexture.prototype = Object.create(WebGL.Instance.prototype);
WebGL.InstanceTexture.prototype.constructor = WebGL.InstanceTexture;

WebGL.InstanceTexture.prototype.GetTexture = function() {
  'use strict';

  return this.texture_;
};

WebGL.InstanceTexture.prototype.FillVertices = function(offset, dest_vertices, quad_position, texture_index) {
  'use strict';

  const world_transform = this.world_transform_;
  const pos_z = this.pos_z_;
  const current_texcoord = CONST.EMPTY_TEXCOORD;

  let texcoord_offset = 0;
  let world_position = this.world_position_;
  for(let i = 0; i < 4; ++i) {
    vec3.transformMat4(world_position, quad_position[i], world_transform);

    dest_vertices[offset++] = world_position[0];
    dest_vertices[offset++] = world_position[1];
    dest_vertices[offset++] = pos_z;
    dest_vertices[offset++] = current_texcoord[texcoord_offset++];
    dest_vertices[offset++] = current_texcoord[texcoord_offset++];
    dest_vertices[offset++] = texture_index;
  }
};
