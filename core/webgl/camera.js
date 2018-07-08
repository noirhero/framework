// Copyright 2018 TAP, Inc. All Rights Reserved.

function Camera() {
  'use strict';

  /*
  public functions
  */
  this.GetTransform = function() {
    if (true === dirty_) {
      MakeViewTransform_();
      dirty_ = false;
    }

    return view_transform_;
  };

  this.SetPosition = function(x, y, z) {
    vec3.set(pos_, x, y, z);
    dirty_ = true;
  };



  /*
  private functions
  */
  function MakeViewTransform_() {
    vec3.add(target_, pos_, dir_);
    mat4.lookAt(view_transform_, pos_, target_, up_);
  }



  /*
  private variables
  */
  var dirty_ = false;
  var view_transform_ = mat4.create();
  var pos_ = vec3.create();
  var dir_ = vec3.fromValues(0.0, 0.0, -1.0);
  var up_ = vec3.fromValues(0.0, 1.0, 0.0);

  var target_ = vec3.create();
}
