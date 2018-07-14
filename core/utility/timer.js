// Copyright 2018 TAP, Inc. All Rights Reserved.

function Timer() {
  'use strict';

  let old_ = 0;
  let now_ = 0;
  let delta_ = 0;
  let delta_ms_ = 0;

  let second_ = 0;
  let frame_ = 0;
  let fps_ = 0;

  this.Start = function() {
    old_ = now_ = Date.now();
  };

  this.Update = function() {
    now_ = Date.now();
    delta_ms_ = now_ - old_;
    delta_ = delta_ms_ * 0.001;
    old_ = now_;

    second_ += delta_;
    if(1 <= second_) {
      fps_ = frame_ + 1;
      frame_ = 0;
      second_ -= 1000.0;
    }
    else {
      ++frame_;
    }
  };

  this.GetDelta = function() {
    return delta_;
  };

  this.GetDeltaMS = function() {
    return delta_ms_;
  };

  this.GetFPS = function() {
    return fps_;
  };
}
