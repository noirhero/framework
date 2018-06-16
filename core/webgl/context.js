function Context() {
  'use strict';

  /*
  public functions
  */
  this.Initialize = function() {
    UpdateFrustum_();
    InitializeCanvas_();
    InitializeWebGL_();

    // debug simulation
    window.addEventListener('mousedown', function() {
      canvas_.loseContext();
    });

    return true;
  };

  this.Run = function() {
    frame_id_ = frame_fn_(run_fn_);

    Clear_();
    tick_fn_();
  };

  this.CreateTexture = function(src) {
    var texture = new Texture(gl_, src);
    texture.Initialize();

    gl_resources_[gl_resources_.length] = texture;
    return texture;
  };

  this.DeleteTexture = function(texture) {
    gl_resources_ = gl_resources_.filter(function(iter_texture) {
      return texture !== iter_texture;
    });
  };

  this.CreatePipeline = function() {
    var pipeline = new Pipeline(gl_);
    pipeline.Initialize();

    gl_resources_[gl_resources_.length] = pipeline;
    return pipeline;
  };

  this.DeletePipeline = function(pipeline) {
    gl_resources_ = gl_resources_.filter(function(iter_pipeline) {
      return pipeline !== iter_pipeline;
    });
  };

  this.SetTickFunction = function(tick_fn) {
    tick_fn_ = tick_fn;
  };

  this.GetFrustum = function() {
    return frustum_;
  };



  /*
  private functions
  */
  function InitializeCanvas_() {
    canvas_ = document.getElementById('main_canvas');
    canvas_.width = frustum_.width;
    canvas_.height = frustum_.height;
    canvas_ = WebGLDebugUtils.makeLostContextSimulatingCanvas(canvas_);
    canvas_.addEventListener('webglcontextlost', ContextLost_, false);
    canvas_.addEventListener('webglcontextrestored', ContextRestored_, false);
  }

  function InitializeWebGL_() {
    gl_ = canvas_.getContext('webgl', {
      premultipliedAlpha: false
    });
    if (null === gl_) {
      return false;
    }
    gl_ = WebGLDebugUtils.makeDebugContext(gl_);

    gl_.enable(gl_.DEPTH_TEST);
    gl_.depthFunc(gl_.GREATER);

    gl_.disable(gl_.CULL_FACE);
    gl_.frontFace(gl_.CW);
    gl_.enable(gl_.BLEND);
    gl_.blendFuncSeparate(gl_.SRC_ALPHA, gl_.ONE_MINUS_SRC_ALPHA, gl_.ONE, gl_.ONE_MINUS_SRC_ALPHA);

    gl_.clearColor(0, 0, 1, 1);
    gl_.clearDepth(0);
  }

  function UpdateFrustum_() {
    frustum_.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    frustum_.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  }

  function UpdateViewport_() {
    UpdateFrustum_();

    if(frustum_.width !== canvas_.width || frustum_.height !== canvas_.height) {
      canvas_.width = frustum_.width;
      canvas_.height = frustum_.height;
    }

    gl_.viewport(frustum_.x, frustum_.y, frustum_.width, frustum_.height);
  }

  function Clear_() {
    UpdateViewport_();

    gl_.clear(gl_.COLOR_BUFFER_BIT | gl_.DEPTH_BUFFER_BIT);
  }

  function ContextLost_(event) {
    var num_resources = gl_resources_.length;
    for(var i = 0; i < num_resources; ++i) {
      if(gl_resources_[i].OnContextLost) {
        gl_resources_[i].OnContextLost();
      }
    }

    event.preventDefault();
    cancel_fram_fn_(frame_id_);
  }

  function ContextRestored_() {
    gl_.enable(gl_.DEPTH_TEST);
    gl_.depthFunc(gl_.GREATER);

    gl_.disable(gl_.CULL_FACE);
    gl_.frontFace(gl_.CW);
    gl_.enable(gl_.BLEND);
    gl_.blendFuncSeparate(gl_.SRC_ALPHA, gl_.ONE_MINUS_SRC_ALPHA, gl_.ONE, gl_.ONE_MINUS_SRC_ALPHA);

    gl_.clearColor(0, 0, 1, 1);
    gl_.clearDepth(0);

    var num_resources = gl_resources_.length;
    for (var i = 0; i < num_resources; ++i) {
      gl_resources_[i].Initialize();
    }

    run_fn_();
  }



  /*
  private variables
  */
  var canvas_ = null;
  var gl_ = null;
  var gl_resources_ = [];

  var frame_id_ = 0;
  var frustum_ = {
    x: 0,
    y: 0,
    width: 1920,
    height: 1200,
    near: -1000,
    far: 1000,
  };

  var run_fn_ = this.Run;
  var tick_fn_ = null;
  var frame_fn_ = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  var cancel_fram_fn_ = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
}
