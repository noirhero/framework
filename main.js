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
  for(let i = 0; i < 1; ++i) {
    actor = scene.ActorAssignment();
    actor.Initialize('data/animations/skeleton.json');

    if(0 === i) {
      actor.SetOwner(true);
    }

    //actor.SetTranslate(Math.RandomRanged(-500, 500), Math.RandomRanged(-200, 200));

    world_transform = actor.GetWorldTransform();
    mat4.scale(world_transform, world_transform, [200, 100, 1]);
  }

  scene.Start();
}
