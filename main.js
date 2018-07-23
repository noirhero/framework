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

  actor = scene.ActorAssignmentBackground();
  actor.Initialize('data/textures/dungeon_tile.png')

  world_transform = actor.GetWorldTransform();
  mat4.scale(world_transform, world_transform, [256, 256, 1]);

  for(let i = 0; i < 2; ++i) {
    actor = scene.ActorAssignment();
    actor.Initialize('data/animations/skeleton.json');

    if(0 === i) {
      actor.SetOwner(true);
    }

    world_transform = actor.GetWorldTransform();
    mat4.scale(world_transform, world_transform, [200, 100, 1]);

    actor.SetTranslate(Math.RandomRanged(-200, 200), Math.RandomRanged(-50, 50));
  }

  scene.Start();
}
