// Copyright 2018 TAP, Inc. All Rights Reserved.

function Timer() {
  'use strict';

  /*
  public functions
  */
  this.Start = function() {
    old_ = now_ = Date.now();
  };

  this.Update = function() {
    now_ = Date.now();
    delta_ = now_ - old_;
    delta_ms_ = delta_ * 0.001;
    old_ = now_;

    second_ += delta_;
    if(1000.0 <= second_) {
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



  /*
  private variables
  */
  var old_ = 0;
  var now_ = 0;
  var delta_ = 0;
  var delta_ms_ = 0;

  var second_ = 0;
  var frame_ = 0;
  var fps_ = 0;
}
