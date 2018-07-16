// Copyright 2018 TAP, Inc. All Rights Reserved.

function Sound(src, handle) {
  'use strict';

  this.src_ = src;
  this.handle_ = handle;
  this.id_ = null;
}

Sound.prototype.Play = function() {
  'use strict';

  if(!this.id_) {
    this.id_ = this.handle_.play();
  }
  else {
    this.handle_.play(this.id_);
  }
};
