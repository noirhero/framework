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

  return this;
};

Sound.prototype.Loop = function(flag) {
  'use strict';

  this.handle_.loop(flag, this.id_);

  return this;
};

Sound.prototype.Pos = function(x, y ) {
  'use strict';

  this.handle_.pos(x, y, 0, this.id_);

  return this;
};

Sound.prototype.PannerAttribute = function(distance) {
  'use strict';

  this.handle_.pannerAttr({
    panningModel: 'HRTF',
    //refDistance: 0.8,
    //rolloffFactor: 2.5,
    distanceModel: 'linear',
    maxDistance: 1000000000,
  }, this.id_);

  return this;
};
