// Copyright TAP, Inc. All Rights Reserved.

Game.SceneSample = function(context) {
  'use strict';

  Game.Scene.call(this, context);
};

Game.SceneSample.prototype = Object.create(Game.Scene.prototype);
Game.SceneSample.prototype.constructor = Game.SceneSample;

Game.SceneSample.prototype.SceneInitialize = Game.Scene.prototype.Initialize;
Game.SceneSample.prototype.Initialize = function() {
  'use strict';

  if(false === this.SceneInitialize()) {
    return false;
  }

  let world_transform = null;
  let actor = null;

  actor = this.ActorAssignmentPlayer();
  actor.Initialize('data/animations/skeleton.json');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [100, 50, 1]);
  actor.SetTranslate(Math.RandomRanged(-200, 200), Math.RandomRanged(-50, 50));

  actor = this.ActorAssignmentBackground();
  actor.Initialize('data/textures/sample_level.png');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [1920, 1080, 1]);

  actor = this.ActorAssignmentPawn();
  actor.Initialize('data/animations/skeleton.json');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [100, 50, 1]);
  actor.SetTranslate(Math.RandomRanged(-200, 200), Math.RandomRanged(-50, 50));

  actor = this.ActorAssignmentInputArrow();
  actor.Initialize('data/textures/input_arrow.png');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [128, 128, 1]);

  return true;
};
