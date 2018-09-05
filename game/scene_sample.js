// Copyright TAP, Inc. All Rights Reserved.

Game.SceneSample = function(context) {
  'use strict';

  Game.Scene.call(this, context);

  this.font_ = null;
  this.pipeline_font_ = null;
  this.postprocess_ = null;

  this.player_ = null;
};

Game.SceneSample.prototype = Object.create(Game.Scene.prototype);
Game.SceneSample.prototype.constructor = Game.SceneSample;

Game.SceneSample.prototype.SceneUpdate = Game.Scene.prototype.Update;
Game.SceneSample.prototype.Update = function() {
  'use strict';

  this.timer_.Update();

  this.projection_.Update();

  const dt = this.timer_.GetDelta();
  const num_objects = this.actors_.length;
  for(let i = 0; i < num_objects; ++i) {
    this.actors_[i].Update(dt);
  }

  this.postprocess_.Begin();
  this.pipeline_.UpdateViewProjection(this.camera_, this.projection_);
  this.pipeline_.Run();
  // this.pipeline_font_.UpdateViewProjection(this.camera_, this.projection_);
  // this.pipeline_font_.Run();
  this.postprocess_.End();
  this.debug_drawer_.UpdateViewProjection(this.camera_, this.projection_);
  this.debug_drawer_.Run();

  const wtm = this.player_.GetWorldTransform();
  this.sound_mng_.UpdateListenerPos(wtm[12], wtm[13]);
};

Game.SceneSample.prototype.SceneInitialize = Game.Scene.prototype.Initialize;
Game.SceneSample.prototype.Initialize = function() {
  'use strict';

  if(false === this.SceneInitialize()) {
    return false;
  }

  this.context_.SetTickFunction(this.Update.bind(this));

  // this.font_ = this.res_mng_.GetFont('data/fonts/font_kor.json', 'data/fonts/font_kor_sdf.png');
  // let font_instance = new WebGL.InstanceFont(this.font_);
  // font_instance.SetText('이난호\n김현정\n주혜리');
  //
  // this.pipeline_font_ = this.context_.CreatePipelineFont();
  // this.pipeline_font_.AddInstance(font_instance);

  this.postprocess_ = this.context_.CreatePostprocess();
  this.postprocess_.AddInstance(this.context_.CreateInstancePostprocessMonoColor());

  let world_transform = null;
  let actor = null;

  let ui_arrow_ = null;
  ui_arrow_ = this.ActorAssignmentInputArrow();
  ui_arrow_.Initialize('data/textures/input_arrow.png');

  actor = this.ActorAssignmentPlayer();
  actor.Initialize('data/animations/skeleton.json');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [100, 50, 1]);
  actor.SetTranslate(Math.RandomRanged(-200, 200), Math.RandomRanged(-50, 50));
  actor.SetUIArrow(ui_arrow_);

  this.player_ = actor;

  actor = this.ActorAssignmentBackground();
  actor.Initialize('data/textures/dungeon_tile.png');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [50, 50, 1]);

  actor = this.ActorAssignmentPawn();
  actor.Initialize('data/animations/skeleton.json');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [100, 50, 1]);
  actor.SetTranslate(Math.RandomRanged(-200, 200), Math.RandomRanged(-50, 50));

  return true;
};
