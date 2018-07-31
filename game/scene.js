// Copyright 2018 TAP, Inc. All Rights Reserved.

var Game = Game || {};

Game.Scene = function(context) {
  'use strict';

  this.context_ = context;

  this.res_mng_ = null;
  this.timer_ = null;

  this.camera_ = null;
  this.projection_ = null;

  this.pipeline_ = null;
  this.actors_ = [];

  this.col_scene_ = null;
  this.sound_mng_ = null;
};

Game.Scene.prototype.ActorAssignmentPlayer = function() {
  return this.actors_[this.actors_.length] = new Game.Player(this.res_mng_, this.pipeline_, this.col_scene_);
};

Game.Scene.prototype.ActorAssignmentPawn = function() {
  return this.actors_[this.actors_.length] = new Game.Pawn(this.res_mng_, this.pipeline_, this.col_scene_);
};

Game.Scene.prototype.ActorAssignmentBackground = function() {
  return this.actors_[this.actors_.length] = new Game.Background(this.res_mng_, this.pipeline_, this.col_scene_);
};

Game.Scene.prototype.ActorRelease = function(actor) {
  actor.Release();

  this.actors_ = this.actors_.filter(function(iter_actor) {
    return actor !== iter_actor;
  });
};

Game.Scene.prototype.Start = function() {
  this.context_.Run();
};

Game.Scene.prototype.Initialize = function() {
  const context = this.context_;

  context.SetTickFunction(this.Update.bind(this));

  this.res_mng_ = new ResourceManager(context);
  this.timer_ = new Timer();

  this.camera_ = new Camera();
  this.camera_.SetPosition(0, 0, 3);
  this.projection_ = new Projection();

  this.pipeline_ = context.CreatePipeline();

  this.col_scene_ = new Game.CollisionScene();
  this.sound_mng_ = new SoundManager();
  this.sound_mng_.Generate('data/sounds/quiet_hill').Play().Loop(true).Pos(0, 0);//.PannerAttribute(10000000);

  this.timer_.Start();
  return true;
};

Game.Scene.prototype.Update = function() {
  'use strict';

  this.timer_.Update();

  this.projection_.Update();
  this.pipeline_.UpdateViewProjection(this.camera_, this.projection_);

  const dt = this.timer_.GetDelta();
  const num_objects = this.actors_.length;
  for(let i = 0; i < num_objects; ++i) {
    this.actors_[i].Update(dt);
  }

  this.pipeline_.Run();
};
