// Copyright 2018 TAP, Inc. All Rights Reserved.

function Main() {
  'use strict';

  let context = new Context();
  if(false === context.Initialize()) {
    alert('This browser does not support WebGL...');
    return;
  }

  let scene = new Scene(context);
  if(false === scene.Initialize()) {
    return;
  }

  let world_transform = null;
  let actor = null;

  actor = scene.ActorAssignmentPlayer();
  actor.Initialize('data/animations/skeleton.json');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [100, 50, 1]);
  actor.SetTranslate(Math.RandomRanged(-200, 200), Math.RandomRanged(-50, 50));

  actor = scene.ActorAssignmentBackground();
  actor.Initialize('data/textures/sample_level.png');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [1920, 1080, 1]);

  actor = scene.ActorAssignmentPawn();
  actor.Initialize('data/animations/skeleton.json');
  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [100, 50, 1]);
  actor.SetTranslate(Math.RandomRanged(-200, 200), Math.RandomRanged(-50, 50));

  scene.Start();
}
