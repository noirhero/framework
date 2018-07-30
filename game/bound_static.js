// Copyright TAP, Inc. All Right Reserved.

Game.BoundStatic = function(instance, points) {
  'use strict';

  this.instance_ = instance;

  const wtm = instance.GetWorldTransform();
  this.convex_ = new SAT.Polygon(new SAT.Vector(wtm[12], wtm[13]), points);

  const convex = this.convex_;
  const aabb = convex.getAABB();
  const r = aabb.points[2].len() * 0.5;
  this.sphere_ = new SAT.Circle(convex.getCentroid(), r);
};

Game.BoundStatic.prototype = Object.create(Game.Bound.prototype);
Game.BoundStatic.prototype.constructor = Game.BoundStatic;

Game.BoundStatic.prototype.Update = function() {
  // do nothing!
};

Game.BoundStatic.prototype.GetShape = function() {
  'use strict';
  return this.convex_;
};
