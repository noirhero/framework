// Copyright 2018 TAP, Inc. All Rights Reserved.

function Main() {
  'use strict';

  let context = new Context();
  if(false === context.Initialize()) {
    alert('This browser does not support WebGL...');
    return;
  }

  let scene = new Game.SceneSample(context);
  if(false === scene.Initialize()) {
    return;
  }

  scene.Start();
}
