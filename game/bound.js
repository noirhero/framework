// Copyright TAP, Inc. All Reight Reserved.

Game.Bound = function(instance) {
  'use strict';

  this.instance_ = instance;
  this.sphere_ = new SAT.Circle();
};

Game.Bound.prototype.Update = function() {
  'use strict';

  const wtm = instance.GetWorldTransform();

  let sphere = this.sphere_;
  sphere.pos.x = wtm[12];
  sphere.pos.y = wtm[13];
  sphere.r = Math.max(Math.max(wtm[0], wtm[5]), wtm[9]);
};

Game.Bound.prototype.GetSphere = function() {
  'use strict';
  return this.sphere_;
};

Game.Bound.prototype.GetShape = function() {
  'use strict';
  return this.sphere_;
};
