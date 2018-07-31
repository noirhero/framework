// Copyright TAP, Inc. All Rights Reserved.

Game.SceneSample = function(context) {
  'use strict';

  Game.Scene.call(this, context);

  this.player_ = null;
};

Game.SceneSample.prototype = Object.create(Game.Scene.prototype);
Game.SceneSample.prototype.constructor = Game.SceneSample;

Game.SceneSample.prototype.SceneUpdate = Game.Scene.prototype.Update;
Game.SceneSample.prototype.Update = function() {
  'use strict';

  this.SceneUpdate();

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

  let world_transform = null;
  let actor = null;

  actor = this.ActorAssignmentPlayer();
  actor.Initialize('data/animations/skeleton.json');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [100, 50, 1]);
  actor.SetTranslate(Math.RandomRanged(-200, 200), Math.RandomRanged(-50, 50));

  this.player_ = actor;

  actor = this.ActorAssignmentBackground();
  //actor.Initialize('data/textures/sample_level.png');
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
