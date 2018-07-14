// Copyright 2018 TAP, Inc. All Rights Reserved.

function Input() {
  'use strict';

  /*
  public functions
  */
  this.Initialize = function() {
    document.addEventListener('keydown', Keydown_, false);
    document.addEventListener('keyup', Keyup_, false);
  }

  this.IsDownKey = function(key) {
    return (input_state_ & key) ? true : false;
  }

  this.IsDownAnyKey = function() {
    return (input_state_ !== 0) ? true : false;
  }

  this.GetInputDirection = function() {
    return input_direction_;
  }

  /*
  private functions
  */
  function Keydown_(event) {
    var key_code = event.code;
    switch(key_code) {
    case 'ArrowLeft':  { input_state_ |= input_enum_.KeyLeft; } break;
    case 'ArrowRight': { input_state_ |= input_enum_.KeyRight; } break;
    case 'ArrowUp':    { input_state_ |= input_enum_.KeyUp; } break;
    case 'ArrowDown':  { input_state_ |= input_enum_.KeyDown; } break;
    case 'Space':      { input_state_ |= input_enum_.SpaceBar; } break;
    }

    SetInputDirection();
  }

  function Keyup_(event) {
    var key_code = event.code;
    switch(key_code) {
    case 'ArrowLeft':  { input_state_ &= ~input_enum_.KeyLeft; } break;
    case 'ArrowRight': { input_state_ &= ~input_enum_.KeyRight; } break;
    case 'ArrowUp':    { input_state_ &= ~input_enum_.KeyUp; } break;
    case 'ArrowDown':  { input_state_ &= ~input_enum_.KeyDown; } break;
    case 'Space':      { input_state_ &= ~input_enum_.SpaceBar; } break;
    }

    SetInputDirection();
  }

  function SetInputDirection() {
    vec2.set(input_direction_, 0, 0);

    if(input_state_ & input_enum_.KeyLeft) {
      input_direction_[0] += -1;
    }
    if(input_state_ & input_enum_.KeyRight) {
      input_direction_[0] -= -1;
    }
    if(input_state_ & input_enum_.KeyUp) {
      input_direction_[1] -= -1;
    }
    if(input_state_ & input_enum_.KeyDown) {
      input_direction_[1] -= 1;
    }
  }

  /*
  private variables
  */
  var input_state_ = 0;
  var input_direction_ = vec2.create();
  const input_enum_ = {KeyLeft: 1, KeyRight: 2, KeyUp: 4, KeyDown: 8, SpaceBar: 16};

  this.input_enum = input_enum_;
}
