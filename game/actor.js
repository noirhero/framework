// Copyright 2018 TAP, Inc. All Rights Reserved.

Game.Actor = function(res_mng, pipeline, col_scene, debug_drawer) {
  'use strict';

  this.res_mng_ = res_mng;
  this.pipeline_ = pipeline;
  this.col_scene_ = col_scene;
  this.debug_drawer_ = debug_drawer;
};

Game.Actor.prototype.Initialize = function() {
  // do nothing
};

Game.Actor.prototype.Update = function() {
  // do nothing
};

Game.Actor.prototype.Release = function() {
  // do nothing
};
