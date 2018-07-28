// Copyright, TAP, Inc. All Rights Reserved.

Game.Player = function(res_mng, pipeline, col_scene) {
  'use strict';

  Game.Pawn.call(this, res_mng, pipeline, col_scene);

  this.input_ = null;

  this.state_ = 'idle';
  this.direction_ = '_l';

  this.accel_rate_ = 2;
  this.acceleration_ = vec2.create();
  this.velocity_ = vec2.create();
};

Game.Player.prototype = Object.create(Game.Pawn.prototype);
Game.Player.prototype.constructor = Game.Player;

Game.Player.prototype.PawnInitialize = Game.Pawn.prototype.Initialize;
Game.Player.prototype.Initialize = function(url) {
  'use strict';

  this.PawnInitialize(url);

  this.input_ = new Input();
  this.input_.Initialize();

  return true;
};

Game.Player.prototype.PawnUpdate = Game.Pawn.prototype.Update;
Game.Player.prototype.Update = function(dt) {
  'use strict';

  this.PawnUpdate(dt);

  function SetState_(key) {
    this.state_ = key + this.direction_;
    this.instance_.SetState(this.state_);
  }

  function ChangeInputState() {
    let input_direction_ = this.input_.GetInputDirection();
    let input_enum_ = this.input_.input_enum;

    if(0 === vec2.sqrLen(input_direction_)) {
      if(this.input_.IsDownKey(input_enum_.SpaceBar) || -1 !== this.instance_.GetState().indexOf('attack')) {
        SetState_.call(this, 'attack');
      }
      else {
        SetState_.call(this, 'idle');
      }
    }
    else {
      SetState_.call(this, 'walk');

      if(this.input_.IsDownKey(input_enum_.KeyLeft)) {
        this.direction_ = '_l';
      }
      else if(this.input_.IsDownKey(input_enum_.KeyRight)) {
        this.direction_ = '_r';
      }
    }
  }

  function CalcVelocity(dt) {
    let input_direction_ = this.input_.GetInputDirection();
    const zero_accel_ = (vec2.sqrLen(input_direction_) > 0) ? false : true;
    if(zero_accel_) {
      BrakingVelocity.call(this, dt);
    }
    else {
      vec2.scale(this.acceleration_, input_direction_, this.accel_rate_);
      let accel_dir_ = vec2.create();
      const velocity_len_ = vec2.len(this.velocity_);

      vec2.normalize(accel_dir_, this.acceleration_);
      vec2.scale(accel_dir_, accel_dir_, velocity_len_);

      const adjusted_friction_ = Math.min(dt * CONST.PLAYER_FRICTION, 1);
      let temp_velo_ = vec2.create();

      // velocity_ = velocity_ - ((velocity_ - accel_dir_) * adjusted_friction_)
      vec2.subtract(temp_velo_, this.velocity_, accel_dir_);
      vec2.scale(temp_velo_, temp_velo_, adjusted_friction_);
      vec2.subtract(this.velocity_, this.velocity_, temp_velo_);
    }

    // velocity_ += acceleration_ * dt
    vec2.scale(this.acceleration_, this.acceleration_, dt);
    vec2.add(this.velocity_, this.velocity_, this.acceleration_);

    // clamp velocity
    if(vec2.len(this.velocity_) > CONST.PLAYER_MAX_VELOCITY) {
      vec2.normalize(this.velocity_, this.velocity_);
      vec2.scale(this.velocity_, this.velocity_, CONST.PLAYER_MAX_VELOCITY);
    }
  }

  function BrakingVelocity(dt) {
    vec2.set(this.acceleration_, 0, 0);

    let reverse_accel_ = vec2.create();
    vec2.normalize(reverse_accel_, this.velocity_);

    reverse_accel_[0] = CONST.PLAYER_BRAKE_DECELERATION * -reverse_accel_[0] * dt;
    reverse_accel_[1] = CONST.PLAYER_BRAKE_DECELERATION * -reverse_accel_[1] * dt;

    this.velocity_[0] = this.velocity_[0] + ((-CONST.PLAYER_FRICTION) * this.velocity_[0] + reverse_accel_[0]);
    this.velocity_[1] = this.velocity_[1] + ((-CONST.PLAYER_FRICTION) * this.velocity_[1] + reverse_accel_[1]);

    if(CONST.PLAYER_BRAKE_STOP_VELOCITY_LEN >= vec2.len(this.velocity_)) {
      vec2.set(this.velocity_, 0, 0);
    }
  }

  function Moving() {
    let world_trans_ = this.instance_.GetWorldTransform();
    if(this.velocity_[0]) {
      world_trans_[12] += this.velocity_[0];
    }
    if (this.velocity_[1]) {
      world_trans_[13] += this.velocity_[1];
    }

    this.col_shape_.Update();
    this.col_scene_.Test(this.col_shape_);
  }

  ChangeInputState.call(this);
  CalcVelocity.call(this, dt);
  Moving.call(this);
};
