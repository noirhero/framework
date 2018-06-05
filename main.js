function Main() {
  'use strict';

  var scene = new Scene();
  if(false === scene.Initialize()) {
    return;
  }

  var actor = scene.ActorAssignment();
  actor.Initialize('data/animations/skeleton.json');

  scene.Start();

}
