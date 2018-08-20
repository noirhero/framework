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

CONST.NUM_MAX_TEXTURES = 8;
CONST.NUM_MAX_INSTANCES = 10;
CONST.VERTEX_STRIDE_X_Y_Z_TU_TV_TI = 24;
CONST.INDEX_STRIDE_TWO_POLYGON = 6;
CONST.QUAD_STRIDE = 4;

CONST.PLAYER_MAX_VELOCITY = 5;
CONST.PLAYER_BRAKE_DECELERATION = 0.1;
CONST.PLAYER_FRICTION = 0.1;
CONST.PLAYER_BRAKE_STOP_VELOCITY_LEN = 0.0001;

CONST.NUM_MAX_DEBUG_DRAWING = 10;
CONST.VERTEX_STRIDE_X_Y_Z = 12;
CONST.DRAW_CIRCLE_SEGMENTS = 32;