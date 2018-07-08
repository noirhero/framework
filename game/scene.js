'use strict';

function Scene(context) {
  let res_mng_ = null;
  let timer_ = null;

  let camera_ = null;
  let projection_ = null;

  let pipeline_ = null;
  let actors_ = [];

  let col_scene_ = null;

  /*
  public functions
  */
  this.Initialize = function() {
    context.SetTickFunction(Update_);

    res_mng_ = new ResourceManager(context);
    timer_ = new Timer();

    camera_ = new Camera();
    camera_.SetPosition(0, 0, 3);
    projection_ = new Projection();

    pipeline_ = context.CreatePipeline();

    col_scene_ = new Col.Scene();

    timer_.Start();
    return true;
  };

  this.Start = function() {
    context.Run();
  };

  this.ActorAssignment = function() {
    return actors_[actors_.length] = new Actor(res_mng_, pipeline_, col_scene_);
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
  function Update_() {
    timer_.Update();

    projection_.SetFrustum(context.GetFrustum());
    pipeline_.UpdateViewProjection(camera_, projection_);

    Updateactors_(timer_.GetDelta());

    pipeline_.Run();
  }

  function Updateactors_(dt) {
    var num_objects = actors_.length;
    for(var i = 0; i < num_objects; ++i) {
      actors_[i].Update(dt);
    }
  }
}
