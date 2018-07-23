// Copyright 2018 TAP, Inc. All Rights Reserved.

function Context() {
  'use strict';

  let canvas_ = null;
  let gl_ = null;
  let gl_resources_ = [];

  let frame_id_ = 0;
  let tick_fn_ = null;

  const frame_fn_ = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  const cancel_fram_fn_ = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  this.Run = function() {
    frame_id_ = frame_fn_(run_fn_);
    tick_fn_();
  };

  const run_fn_ = this.Run;

  function InitializeAndInsertResource(resource, resources) {
    resource.Initialize();
    resources[resources.length] = resource;
    return resource;
  }

  function ContextLost_(event) {
    event.preventDefault();
    cancel_fram_fn_(frame_id_);

    const num_resources = gl_resources_.length;
    for(let i = 0; i < num_resources; ++i) {
      gl_resources_[i].OnContextLost();
    }
  }

  function ContextRestored_() {
    const num_resources = gl_resources_.length;
    for (let i = 0; i < num_resources; ++i) {
      gl_resources_[i].Initialize();
    }

    run_fn_();
  }

  this.Initialize = function() {
    canvas_ = document.getElementById('main_canvas');
    canvas_ = WebGLDebugUtils.makeLostContextSimulatingCanvas(canvas_);
    canvas_.addEventListener('webglcontextlost', ContextLost_, false);
    canvas_.addEventListener('webglcontextrestored', ContextRestored_, false);

    gl_ = canvas_.getContext('webgl', {
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl_) {
      return false;
    }
    gl_ = WebGLDebugUtils.makeDebugContext(gl_);

    window.addEventListener('mousedown', function() {
      canvas_.loseContext();
    });

    return true;
  };

  this.DeleteResource = function(resource) {
    gl_resources_ = gl_resources_.filter(function(iter_resource) {
      return resource !== iter_resource;
    });
  };

  this.CreateTexture = function(src) {
    return InitializeAndInsertResource(new WebGL.Texture(gl_, src), gl_resources_);
  };

  this.CreatePipeline = function() {
    return InitializeAndInsertResource(new WebGL.Pipeline(gl_), gl_resources_);
  };

  this.SetTickFunction = function(tick_fn) {
    tick_fn_ = tick_fn;
  };
}
