function Actor(res_mng, pipeline) {
  'use strict';

  /*
  public functions
  */
  this.Initialize = function(url) {
    instance_ = new Instance(res_mng.GetAnimation(url));
    pipeline.AddInstance(instance_);

    InitializeInputs_();

    var world_transform = instance_.GetWorldTransform();
    mat4.scale(world_transform, world_transform, [200, 200, 1]);
  };

  this.Update = function(dt) {
    instance_.Update(dt);
  };

  this.Release = function() {
    res_mng.DeleteAnimation(instance_.GetAnimation());
    pipeline.DeleteInstance(instance_);
    instance_ = null;
  };



  /*
  private functions
  */
  var InitializeInputs_ = function() {
    document.addEventListener('keydown', Keydown_, false);
    document.addEventListener('keyup', Keyup_, false);
  };

  var Keydown_ = function(event) {
    var key_code = event.code;
    if(-1 !== key_code.indexOf('Arrow')) {
      instance_.SetState('walk');
    }
    else if(-1 !== key_code.indexOf('Space')) {
      instance_.SetState('attack');
    }
  };

  var Keyup_ = function(event) {
    var key_code = event.code;
    if(-1 !== key_code.indexOf('Arrow')) {
      instance_.SetState('idle');
    }
  };


  /*
  private variables
  */
  var instance_ = null;
}
