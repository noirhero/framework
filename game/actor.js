function Actor(res_mng, pipeline) {
  'use strict';

  /*
  public functions
  */
  this.Initialize = function(url) {
    instance_ = new Instance(res_mng.GetAnimation(url));
    instance_.SetState('idle_l');
    pipeline.AddInstance(instance_);

    InitializeInputs_();

    var world_transform = instance_.GetWorldTransform();
    mat4.scale(world_transform, world_transform, [200, 100, 1]);
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
  function InitializeInputs_() {
    document.addEventListener('keydown', Keydown_, false);
    document.addEventListener('keyup', Keyup_, false);
  }

  function Keydown_(event) {
    var key_code = event.code;
    if(-1 !== key_code.indexOf('ArrowLeft')) {
      instance_.SetState('walk_l');
    }
    else if(-1 !== key_code.indexOf('ArrowRight')) {
      instance_.SetState('walk_r');
    }
    // else if(-1 !== key_code.indexOf('Space')) {
    //   instance_.SetState('attack');
    // }
  }

  function Keyup_(event) {
    var key_code = event.code;
    if(-1 !== key_code.indexOf('ArrowLeft')) {
      instance_.SetState('idle_l');
    }
    else if(-1 !== key_code.indexOf('ArrowRight')) {
      instance_.SetState('idle_r');
    }
  }


  /*
  private variables
  */
  var instance_ = null;
}
