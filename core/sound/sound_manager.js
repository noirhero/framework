// Copyright 2018 TAP, Inc. All Rights Reserved.

function SoundManager() {
  'use strict';

  let handles_ = [];
  let sounds_ = [];

  this.Generate = function(src) {
    let handle = handles_[src];
    if(!handle) {
      handle = handles_[src] = new Howl({
        src: [src + '.ogg', src + '.mp4'],
      });
    }

    let sound = new Sound(src, handle);
    sounds_[sounds_.length] = sound;

    return sound;
  };
}