// Copyright TAP, Inc. All Reight Reserved.

Game.Bound = function(instance, radius) {
  'use strict';

  const wtm = instance.GetWorldTransform();

  this.instance_ = instance;
  this.sphere_ = new SAT.Circle(new SAT.Vector(wtm[12], wtm[13]), radius);
};

Game.Bound.prototype.Update = function() {
  'use strict';

  const wtm = this.instance_.GetWorldTransform();

  let sphere = this.sphere_;
  sphere.pos.x = wtm[12];
  sphere.pos.y = wtm[13];
};

Game.Bound.prototype.GetSphere = function() {
  'use strict';
  return this.sphere_;
};

Game.Bound.prototype.GetShape = function() {
  'use strict';
  return this.sphere_;
};
