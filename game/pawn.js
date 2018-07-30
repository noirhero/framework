// Copyright, TAP, Inc. All Rights Reserved.

Game.Pawn = function(res_mng, pipeline, col_scene) {
  'use strict';

  Game.Actor.call(this, res_mng, pipeline, col_scene);

  this.instance_ = null;
  this.col_shape_ = null;
};

Game.Pawn.prototype = Object.create(Game.Actor.prototype);
Game.Pawn.prototype.constructor = Game.Pawn;

Game.Pawn.prototype.GetWorldTransform = function() {
  'use strict';

  return this.instance_.GetWorldTransform();
};

Game.Pawn.prototype.SetTranslate = function(x, y) {
  let world_transform = this.instance_.GetWorldTransform();
  world_transform[12] = x;
  world_transform[13] = y;

  this.col_shape_.Update();
};

Game.Pawn.prototype.Initialize = function(url) {
  'use strict';

  let instance = new WebGL.InstanceAnimation(this.res_mng_.GetAnimation(url));
  instance.SetState('idle_l', Math.RandomRanged(0, 1000));
  this.pipeline_.AddInstance(instance);

  this.instance_ = instance;
  this.col_shape_ = this.col_scene_.AssignementDynamic(instance, 20);
};

Game.Pawn.prototype.Update = function(dt) {
  'use strict';

  this.instance_.Update(dt);
};

Game.Pawn.prototype.Release = function() {
  'use strict';

  this.res_mng_.DeleteTexture(this.instance_.GetTexture());
  this.pipeline_.DeleteInstance(this.instance_);
  this.instance_ = null;
};
