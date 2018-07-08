// Copyright 2018 TAP, Inc. All Rights Reserved.

var CONST = CONST || {};

CONST.EMPTY_TEXCOORD = [
  0.0, 1.0,
  1.0, 1.0,
  0.0, 0.0,
  1.0, 0.0,
];

CONST.QUAD_POSITION = [
  vec3.fromValues(-0.5, 0.5, 0.0),
  vec3.fromValues(0.5, 0.5, 0.0),
  vec3.fromValues(-0.5, -0.5, 0.0),
  vec3.fromValues(0.5, -0.5, 0.0),
];

CONST.NUM_MAX_INSTANCES = 100;
CONST.VERTEX_STRIDE_X_Y_Z_TU_TV = 20;
CONST.INDEX_STRIDE_TWO_POLYGON = 6;
CONST.QUAD_STRIDE = 4;
