function Actor(res_mng, pipeline) {
  'use strict';

  /*
  public functions
  */
  this.Initialize = function(url) {
    instance_ = new Instance(res_mng.GetAnimation(url));
    instance_.SetState('idle_l', RandomRanged(0, 1000));
    pipeline.AddInstance(instance_);

    input_ = new Input();
    input_.Initialize();
  };

  this.Update = function(dt) {
    instance_.Update(dt);

    if(is_owner_) {
      ChangeInputState();
      CalcVelocity(dt);
      Moving(dt);
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
  function ChangeInputState() {
    var input_direction_ = input_.GetInputDirection();
    var input_enum_ = input_.input_enum;

    if(0 === vec2.len(input_direction_)) {
      if(input_.IsDownKey(input_enum_.SpaceBar)) {
        SetState_('attack');
      }
      else {
        SetState_('idle');
      }
    }
    else {
      SetState_('walk');

      if(input_.IsDownKey(input_enum_.KeyLeft)) {
        direction_ = '_l';
      }
      else if(input_.IsDownKey(input_enum_.KeyRight)) {
        direction_ = '_r';
      }
    }
  }

  function CalcVelocity(dt) {
    var input_direction_ = input_.GetInputDirection();
    acceleration_[0] = input_direction_[0] * accel_rate_;
    acceleration_[1] = input_direction_[1] * accel_rate_;

    var zero_accel_ = (vec2.len(acceleration_) > 0) ? false : true;
    if(zero_accel_) {
      BrakingVelocity(dt);
    }
    else {
      var accel_dir_ = vec2.create();
      vec2.normalize(accel_dir_, acceleration_);

      var velo_len_ = vec2.len(velocity_);
      velocity_[0] = velocity_[0] - (velocity_[0] - accel_dir_[0] * velo_len_) * Math.min(dt * friction_, 1);
      velocity_[1] = velocity_[1] - (velocity_[1] - accel_dir_[1] * velo_len_) * Math.min(dt * friction_, 1);
    }

    velocity_[0] = acceleration_[0] * dt;
    velocity_[1] = acceleration_[1] * dt;

    // todo : velocity clamp(new_max_speed_)
  }

  function Moving(dt) {
    var world_trans_ = instance_.GetWorldTransform();
    if(velocity_[0]) {
      world_trans_[12] += velocity_[0] * dt;
    }
    if (velocity_[1]) {
      world_trans_[13] += velocity_[1] * dt;
    }
  }

  function BrakingVelocity(dt) {
    var reverse_accel_ = vec2.create();
    vec2.normalize(reverse_accel_, velocity_);

    reverse_accel_[0] = break_deceleration * -reverse_accel_[0];
    reverse_accel_[1] = break_deceleration * -reverse_accel_[1];

    velocity_[0] = velocity_[0] + ((-friction_) * velocity_[0] + reverse_accel_[0]) * dt;
    velocity_[1] = velocity_[1] + ((-friction_) * velocity_[1] + reverse_accel_[1]) * dt;

    if(BrakeStopVelocityLen >= vec2.len(velocity_)) {
      velocity_[0] = 0;
      velocity_[1] = 0;
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
  var input_ = null;

  var state_ = 'idle';
  var direction_ = '_l';

  var accel_rate_ = 0.005;
  var acceleration_ = vec2.create();
  var velocity_ = vec2.create();
  var break_deceleration = 1;
  var friction_ = 1;
  const BrakeStopVelocityLen = 1;
}
