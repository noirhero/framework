function Actor(res_mng, pipeline) {
  'use strict';

  /*
  public functions
  */
  this.Initialize = function(url) {
    instance_ = new Instance(res_mng.GetAnimation(url));
    instance_.SetState('idle_l', RandomRanged(0, 1000));
    pipeline.AddInstance(instance_);

    InitializeInputs_();
  };

  this.Update = function(dt) {
    instance_.Update(dt);

    if(false === is_owner_) {
      return;
    }
    
    if((MoveLeft === (input_state_ & MoveLeft)) || (MoveRight === (input_state_ & MoveRight)) ||
       (MoveUp === (input_state_ & MoveUp)) || (MoveDown === (input_state_ & MoveDown))) {
      SetState_('walk');
    }
    else if (Attack === (input_state_ & Attack)) {
      SetState_('attack');
    }
    else {
      SetState_('idle');
    }
    
    var world_trans_ = instance_.GetWorldTransform();
    if(x_velocity_) {
      world_trans_[12] += x_velocity_ * dt * 0.01;
    }
    if (y_velocity_) {
      world_trans_[13] += y_velocity_ * dt * 0.01;
    }
  };

  this.Release = function() {
    res_mng.DeleteAnimation(instance_.GetAnimation());
    pipeline.DeleteInstance(instance_);
    instance_ = null;
  };

  this.GetWorldTransform = function() {
    return instance_.GetWorldTransform();
  };

  this.SetOwner = function(flag) {
    is_owner_ = flag;
  }



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
      direction_ = '_l';
      input_state_ |= MoveLeft;
      x_velocity_ = -1;
    }
    else if(-1 !== key_code.indexOf('ArrowRight')) {
      direction_ = '_r';
      input_state_ |= MoveRight;
      x_velocity_ = 1;
    }
    else if (-1 !== key_code.indexOf('ArrowUp')) {
      input_state_ |= MoveUp;
      y_velocity_ = 1;
    }
    else if (-1 !== key_code.indexOf('ArrowDown')) {
      input_state_ |= MoveDown;
      y_velocity_ = -1;
    }
    else if(-1 !== key_code.indexOf('Space')) {
      input_state_ |= Attack;
    }
  }

  function Keyup_(event) {
    var key_code = event.code;
    if(-1 !== key_code.indexOf('ArrowLeft')) {
      input_state_ &= ~MoveLeft;

      if(MoveRight === (input_state_ & MoveRight)) {
        direction_ = '_r';
        x_velocity_ = 1;
      }
      else {
        x_velocity_ = 0;
      }
    }
    else if(-1 !== key_code.indexOf('ArrowRight')) {
      input_state_ &= ~MoveRight;

      if(MoveLeft === (input_state_ & MoveLeft)) {
        direction_ = '_l';
        x_velocity_ = -1;
      }
      else {
        x_velocity_ = 0;
      }
    }
    else if (-1 !== key_code.indexOf('ArrowUp')) {
      input_state_ &= ~MoveUp;

      if(MoveDown === (input_state_ & MoveDown)) {
        y_velocity_ = -1;
      }
      else {
        y_velocity_ = 0;
      }
    }
    else if (-1 !== key_code.indexOf('ArrowDown')) {
      input_state_ &= ~MoveDown;
      
      if(MoveUp === (input_state_ & MoveUp)) {
        y_velocity_ = 1;
      }
      else {
        y_velocity_ = 0;
      }
    }
    else if(-1 !== key_code.indexOf('Space')) {
      input_state_ &= ~Attack;
    }
  }

  function SetState_(key) {
    state_ = key + direction_;
    instance_.SetState(state_);
  }


  /*
  private variables
  */
  var is_owner_ = false;

  var instance_ = null;
  var state_ = 'idle';
  var direction_ = '_l';

  const MoveLeft = 1;
  const MoveRight = 2;
  const MoveUp = 4;
  const MoveDown = 8;
  const Attack = 16;

  var input_state_ = 0;

  var x_velocity_ = 0;
  var y_velocity_ = 0;
}
