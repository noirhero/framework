function Main() {
  'use strict';

  var scene = new Scene();
  if(false === scene.Initialize()) {
    return;
  }

  var world_transform = null;
  var actor = null;
  for(var i = 0; i<100; ++i) {
    actor = scene.ActorAssignment();
    actor.Initialize('data/animations/skeleton.json');

    world_transform = actor.GetWorldTransform();
    mat4.translate(world_transform, world_transform, [RandomRanged(-300, 300), RandomRanged(-100, 100), 0]);
    mat4.scale(world_transform, world_transform, [200, 100, 1]);
  }

  scene.Start();

}
