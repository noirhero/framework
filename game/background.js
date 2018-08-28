// Copyright TAP, Inc. All Rights Reserved.

Game.Background = function(res_mng, pipeline, col_scene, debug_drawer) {
  'use strict';

  Game.Actor.call(this, res_mng, pipeline, col_scene, debug_drawer);

  this.instance_ = null;
};

Game.Background.prototype = Object.create(Game.Actor.prototype);
Game.Background.prototype.constructor = Game.Background;

Game.Background.prototype.GetWorldTransform = function() {
  'use strict';

  return this.instance_.GetWorldTransform();
};

Game.Background.prototype.Initialize = function(url) {
  'use strict';

  let instance = new WebGL.InstanceTexture(this.res_mng_.GetTexture(url), 999);
  this.pipeline_.AddInstance(instance);
  this.instance_ = instance;
};

Game.Background.prototype.Release = function() {
  'use strict';

  this.res_mng_.DeleteTexture(this.instance_.GetTexture());
  this.pipeline_.DeleteInstance(this.instance_);
  this.instance_ = null;
};
