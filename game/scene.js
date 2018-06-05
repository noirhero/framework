function Scene() {
  'use strict';

  /*
  public functions
  */
  this.Initialize = function() {
    context_ = new Context();
    if (false === context_.Initialize()) {
      alert('This browser does not support WebGL...');
      return false;
    }
    context_.SetTickFunction(Update_);

    res_mng_ = new ResourceManager(context_);
    timer_ = new Timer();

    camera_ = new Camera();
    camera_.SetPosition(0, 0, 3);
    projection_ = new Projection();

    pipeline_ = context_.CreatePipeline();

    timer_.Start();
    return true;
  };

  this.Start = function() {
    context_.Run();
  };

  this.ActorAssignment = function() {
    return actors_[actors_.length] = new Actor(res_mng_, pipeline_);
  };

  this.ActorRelease = function(actor) {
    actor.Release();
    actors_ = actors_.filter(function(iter_actor) {
      return actor !== iter_actor;
    });
  };



  /*
  private functions
  */
  var Update_ = function() {
    timer_.Update();

    projection_.SetFrustum(context_.GetFrustum());
    pipeline_.UpdateViewProjection(camera_, projection_);

    Updateactors_(timer_.GetDelta());

    pipeline_.Run();
  };

  var Updateactors_ = function(dt) {
    var num_objects = actors_.length;
    for(var i = 0; i < num_objects; ++i) {
      actors_[i].Update(dt);
    }
  };



  /*
  private variables
  */
  var context_ = null;
  var res_mng_ = null;
  var timer_ = null;

  var camera_ = null;
  var projection_ = null;

  var pipeline_ = null;
  var actors_ = [];
}
