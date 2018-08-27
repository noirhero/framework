// Copyright TAP, Inc. All Rights Reserved.

Game.InputArrow = function(res_mng, pipeline, col_scene) {
    'use strict';
  
    Game.Actor.call(this, res_mng, pipeline, col_scene);
  
    this.instance_ = null;
  };
  
  Game.InputArrow.prototype = Object.create(Game.Actor.prototype);
  Game.InputArrow.prototype.constructor = Game.InputArrow;
  
  Game.InputArrow.prototype.GetWorldTransform = function() {
    'use strict';
  
    return this.instance_.GetWorldTransform();
  };
  
  Game.InputArrow.prototype.SetTranslate = function(x, y) {
    let world_transform = this.instance_.GetWorldTransform();

    world_transform[12] = x;
    world_transform[13] = y;
  };

  Game.InputArrow.prototype.SetRotate = function() {
    let world_transform = this.instance_.GetWorldTransform();
    let local_transform = mat4.create();

    mat4.scale(local_transform, local_transform, [128, 128, 1]);
    mat4.rotate(local_transform, local_transform, 90.0 * Math.PI / 180.0, [0,0,1]);
    
    world_transform[0] = local_transform[0];
    world_transform[1] = local_transform[1];
    world_transform[2] = local_transform[2];
    world_transform[3] = local_transform[3];
    world_transform[4] = local_transform[4];
    world_transform[5] = local_transform[5];
    world_transform[6] = local_transform[6];
    world_transform[7] = local_transform[7];
    world_transform[8] = local_transform[8];
    world_transform[9] = local_transform[9];
    world_transform[10] = local_transform[10];
    world_transform[11] = local_transform[11];
  };

  Game.InputArrow.prototype.Initialize = function(url) {
    'use strict';
  
    let instance = new WebGL.InstanceTexture(this.res_mng_.GetTexture(url), -1);
    this.pipeline_.AddInstance(instance);
    this.instance_ = instance;
  };

  Game.InputArrow.prototype.Release = function() {
    'use strict';
  
    this.res_mng_.DeleteTexture(this.instance_.GetTexture());
    this.pipeline_.DeleteInstance(this.instance_);
    this.instance_ = null;
  };
