function Actor(res_mng, pipeline, col_scene) {
  'use strict';

  let col_shape_ = null;

  /*
  public functions
  */
  this.Initialize = function(url) {
    instance_ = new Instance(res_mng.GetAnimation(url));
    instance_.SetState('idle_l', Math.RandomRanged(0, 1000));
    pipeline.AddInstance(instance_);

    input_ = new Input();
    input_.Initialize();

    col_shape_ = col_scene.AssignmentBox(0, 0, 50, 50);
  };

  this.Update = function(dt) {
    instance_.Update(dt);

    if(is_owner_) {
      ChangeInputState();
      CalcVelocity(dt);
      Moving();
    }
  };

  this.Release = function() {
    res_mng.DeleteAnimation(instance_.GetAnimation());
    pipeline.DeleteInstance(instance_);
    instance_ = null;
  };

  this.SetTranslate = function(x, y) {
    let world_transform = instance_.GetWorldTransform();
    world_transform[12] = x;
    world_transform[13] = y;

    col_shape_.UpdateTranslate(x, y);
  };

  this.GetWorldTransform = function() {
    return instance_.GetWorldTransform();
  };

  this.SetOwner = function(flag) {
    is_owner_ = flag;
  };

  /*
  private functions
  */
  function ChangeInputState() {
    var input_direction_ = input_.GetInputDirection();
    var input_enum_ = input_.input_enum;

    if(0 === vec2.len(input_direction_)) {
      if(input_.IsDownKey(input_enum_.SpaceBar) || -1 !== instance_.GetState().indexOf('attack')) {
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
    var zero_accel_ = (vec2.sqrLen(input_direction_) > 0) ? false : true;
    if(zero_accel_) {
      BrakingVelocity(dt);
    }
    else {
      vec2.scale(acceleration_, input_direction_, accel_rate_);
      var accel_dir_ = vec2.create();
      var velocity_len_ = vec2.len(velocity_);

      vec2.normalize(accel_dir_, acceleration_);
      vec2.scale(accel_dir_, accel_dir_, velocity_len_);

      var adjusted_friction_ = Math.min(dt * 0.001 * Friction_, 1);
      var temp_velo_ = vec2.create();

      // velocity_ = velocity_ - ((velocity_ - accel_dir_) * adjusted_friction_)
      vec2.subtract(temp_velo_, velocity_, accel_dir_);
      vec2.scale(temp_velo_, temp_velo_, adjusted_friction_);
      vec2.subtract(velocity_, velocity_, temp_velo_);
    }

    // velocity_ += acceleration_ * dt
    vec2.scale(acceleration_, acceleration_, dt * 0.001);
    vec2.add(velocity_, velocity_, acceleration_);

    // clamp velocity
    if(vec2.len(velocity_) > MaxVelocity_) {
      vec2.normalize(velocity_, velocity_);
      vec2.scale(velocity_, velocity_, MaxVelocity_);
    }
  }

  function BrakingVelocity(dt) {
    vec2.set(acceleration_, 0, 0);

    var reverse_accel_ = vec2.create();
    vec2.normalize(reverse_accel_, velocity_);

    reverse_accel_[0] = BrakeDeceleration_ * -reverse_accel_[0] * dt * 0.001;
    reverse_accel_[1] = BrakeDeceleration_ * -reverse_accel_[1] * dt * 0.001;

    velocity_[0] = velocity_[0] + ((-Friction_) * velocity_[0] + reverse_accel_[0]);
    velocity_[1] = velocity_[1] + ((-Friction_) * velocity_[1] + reverse_accel_[1]);

    if(BrakeStopVelocityLen_ >= vec2.len(velocity_)) {
      vec2.set(velocity_, 0, 0);
    }
  }

  function Moving() {
    var world_trans_ = instance_.GetWorldTransform();
    if(velocity_[0]) {
      world_trans_[12] += velocity_[0];
    }
    if (velocity_[1]) {
      world_trans_[13] += velocity_[1];
    }

    col_shape_.UpdateTranslate(world_trans_[12], world_trans_[13]);
    if(true === col_scene.Sweep(col_shape_)) {
      const shape_pos = col_shape_.GetData().pos;
      world_trans_[12] = shape_pos.x;
      world_trans_[13] = shape_pos.y;
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

  var accel_rate_ = 2;
  var acceleration_ = vec2.create();
  var velocity_ = vec2.create();

  const MaxVelocity_ = 5;
  const BrakeDeceleration_ = 0.1;
  const Friction_ = 0.1;
  const BrakeStopVelocityLen_ = 0.0001;
}
