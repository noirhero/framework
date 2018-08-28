// Copyright 2018 TAP, Inc. All Rights Reserved.

function Input() {
  'use strict';

  /*
  public functions
  */
  this.Initialize = function() {
    // keyboard
    document.addEventListener('keydown', Keydown_, false);
    document.addEventListener('keyup', Keyup_, false);

    // touch
    document.addEventListener("touchstart", TouchStart_, false);
    document.addEventListener("touchend", TouchEnd_, false);
    document.addEventListener("touchcancel", TouchCancel_, false);
    document.addEventListener("touchmove", TouchMove_, false);
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

  this.IsTouchState = function(key) {
    return (touch_state_ & key) ? true : false;
  }

  this.GetTouchLocation = function() {
    return touch_location;
  }

  this.IsDownTouch = function() {
    return input_touch_stack.length != 0;
  }
  
  this.IsTouchMoving = function() {
    return pending_touch_moving_;
  }
  
  this.CleanUpTouchMoveData = function()
  {
    vec2.set(input_direction_, 0, 0);
    pending_touch_moving_ = false;
  }

  /*
  private functions - keyboard
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

    SetInputDirection(1);
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

    SetInputDirection(1);
  }

  function SetInputDirection(speed) {
    vec2.set(input_direction_, 0, 0);

    if(input_state_ & input_enum_.KeyLeft) {
      input_direction_[0] += -1 * speed;
    }
    if(input_state_ & input_enum_.KeyRight) {
      input_direction_[0] -= -1 * speed;
    }
    if(input_state_ & input_enum_.KeyUp) {
      input_direction_[1] -= -1 * speed;
    }
    if(input_state_ & input_enum_.KeyDown) {
      input_direction_[1] -= 1 * speed; 
    }
  }

  /*
  private functions - touch
  */
  function TouchStart_(event){      
    touch_location = { x: event.changedTouches[0].clientX, y : event.changedTouches[0].clientY};
    ReleaseTouchInputState();
  }

  function TouchEnd_(event){    
    ReleaseTouchInputState();
  }

  function TouchCancel_(event){
    ReleaseTouchInputState();
  }

  function TouchMove_(event){
    let cached_touches = event.changedTouches;
    for(let i=0; i<cached_touches.length; i++) {
      input_touch_stack.push({
        x : cached_touches[i].screenX,
        y : cached_touches[i].screenY,
      });
    }

    RegistTouchInputState();
  }

  function RegistTouchInputState() {
    if(input_touch_stack.length > 1)
    {
      let inPivot = input_touch_stack[0];
      let inTarget = input_touch_stack[input_touch_stack.length-1];

      let calculateX = inTarget.x - inPivot.x;
      let calculateY = inTarget.y - inPivot.y;
      
      let absX = Math.abs(calculateX);
      let absY = Math.abs(calculateY);

      if(absX == 0 && absY == 0)
        return;

      vec2.set(input_direction_, 0, 0);
      touch_state_ = 0;

      let vertical = absX < absY;
      if(!vertical && calculateX < 0) {
        touch_state_ = input_enum_.KeyLeft; 
      }
      else if(!vertical && calculateX > 0) {
        touch_state_ = input_enum_.KeyRight; 
      }
      else if(vertical && calculateY < 0) {
        touch_state_ = input_enum_.KeyUp; 
      }
      else if(vertical &&calculateY > 0) {
        touch_state_ = input_enum_.KeyDown; 
      }

      //
      pending_touch_moving_ = false;
    }
  }
  
  function ReleaseTouchInputState() {    
    pending_touch_moving_ = true;
    input_state_ = touch_state_;
    
    SetInputDirection(100);

    input_touch_stack.length = 0;
    touch_state_ = 0;
  }

  /*
  private variables
  */ 
  var pending_touch_moving_;
  var touch_state_ = 0;
  var input_state_ = 0;
  var input_direction_ = vec2.create();
  var input_touch_stack = [];
  var touch_location = vec2.create();
  const input_enum_ = {KeyLeft: 1, KeyRight: 2, KeyUp: 4, KeyDown: 8, SpaceBar: 16};

  this.input_enum = input_enum_;
}
