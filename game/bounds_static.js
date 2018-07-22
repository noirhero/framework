// Copyright TAP, Inc. All Right Reserved.

Game.BoundStatic = function(instance, points) {
  'use strict';

  Game.Bound.call(this, instance);

  const wtm = instance.GetWorldTransform();
  this.convex_ = new SAT.Polygon(new SAT.Vector(wtm[12], wtm[13]), points);

  const convex = this.convex_;
  const aabb = this.convex_.getAABB();
  let sphere = this.sphere_;
  sphere.pos = this.convex_.getCentroid();
  sphere.r = Math.max(aabb.w, aabb.h) * 0.5;
};

Game.BoundStatic.prototype = Object.create(Game.Bound);
Game.BoundStatic.protptype.constructor = Game.BoundStatic;

Game.BoundStatic.prototype.Update = function() {
  // do nothing!
};

Game.BoundStatic.prototype.GetShape = function() {
  'use strict';
  return this.convex_;
};
