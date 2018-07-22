// Copyright TAP, Inc. All Right Reserved.

Game.BoundDynamic = function(instance) {
  'use strict';

  Game.Bound.call(this, instance);

  this.box_ = null;
  this.dirty = true;
};

Game.BoundDynamic.prototype = Object.create(Game.Bound);
Game.BoundDynamic.ptotoyype.constructor = Game.BoundDynamic;

Game.BoundDynamic.prototype.SphereUpdate = Game.Bound.prototype.Update;
Game.BoundDynamic.prototype.Update = function() {
  'use strict';

  const wtm = this.instance_.GetWorldTransform();
  const r = Math.max(Math.max(wtm[0], wtm[5]), wtm[9]);
  const sphere = this.sphere_;
  if(sphere.pos.x === wtm[12] && sphere.pos.y === wtm[13] && sphere.pos.r === r) {
    return;
  }

  this.dirty_ = true;
  this.SphereUpdate();
};

Game.BoundDynamic.prototype.GetShape = function() {
  'use strict';

  if(true === this.dirty_) {
    this.dirty_ = false;
    this.box_ = this.sphere_.getAABB();
  }
  
  return this.box_;
};
