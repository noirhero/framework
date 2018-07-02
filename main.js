'use strict';

function Main() {
  let context = new Context();
  if(false === context.Initialize()) {
    alert('This browser does not support WebGL...');
    return;
  }

  let scene = new Scene(context);
  if(false === scene.Initialize()) {
    return;
  }

  var world_transform = null;
  var actor = null;
  for(var i = 0; i<1; ++i) {
    actor = scene.ActorAssignment();
    actor.Initialize('data/animations/skeleton.json');

    if(0 === i) {
      actor.SetOwner(true);
    }

    world_transform = actor.GetWorldTransform();
  //  mat4.translate(world_transform, world_transform, [RandomRanged(-300, 300), RandomRanged(-100, 100), 0]);
    mat4.scale(world_transform, world_transform, [200, 100, 1]);
  }

  scene.Start();

}
