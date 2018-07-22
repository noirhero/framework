// Copyright TAP, Inc. All Right Reserved.

Game.BoundDynamic = function(instance, radius) {
  'use strict';

  Game.Bound.call(this, instance, radius);

  this.box_ = null;
  this.dirty_ = true;
};

Game.BoundDynamic.prototype = Object.create(Game.Bound.prototype);
Game.BoundDynamic.prototype.constructor = Game.BoundDynamic;

Game.BoundDynamic.prototype.SphereUpdate = Game.Bound.prototype.Update;
Game.BoundDynamic.prototype.Update = function() {
  'use strict';

  const wtm = this.instance_.GetWorldTransform();
  const sphere = this.sphere_;
  if(sphere.pos.x === wtm[12] && sphere.pos.y === wtm[13]) {
    return;
  }

  this.dirty_ = true;
  this.SphereUpdate();
};

Game.BoundDynamic.prototype.GetShape = function() {
  'use strict';

  if(true === this.dirty_) {
    this.dirty_ = false;

    const sphere = this.sphere_;
    const w = sphere.r * 2;
    this.box_ = sphere.getAABB();//new SAT.Box(sphere.pos, w, w).toPolygon();
  }

  return this.box_;
};
