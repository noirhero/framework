// Copyright TAP, Inc. All Right Reserved.

Game.CollisionScene = function() {
  'use strict';

  let bounds_ = [];
  let response_ = new SAT.Response();

  this.ReleaseBound = function(bound) {
    bounds_ = bounds_.filter((iter_bound)=>{
      return iter_bound != bound;
    });
  };

  this.AssignementDynamic = function(instance) {
    let bound = new Game.BoundDynamic(instance);
    bounds_[bounds_.length] = bound;
    return bound;
  };

  this.AssignmentStatic = function(instance, points) {
    let bound = new Game.BoundStatic(instance, points);
    bounds_[bounds_.length] = bound;
    return bound;
  };

  this.Update = function(bound) {
    const bound_sphere = bound.GetSphere();
    const bound_shape = bound.GetShape();
    let wtm = bound.instance_.GetWorldTransform();

    const num_bounds = bounds_.length;
    for(let i = 0; i < num_bounds; ++i) {
      const other = bounds_[i];
      if(other === bound) {
        continue;
      }

      if(false === SAT.testCircleCircle(other.GetCircle(), bound_sphere)) {
        continue;
      }

      response_.clear();
      if(true === SAT.testPolygonPolygon(other.GetShape(), bound_shape)) {
        wtm[12] += response_.overlapN.x;
        wtm[13] += response_.overlapN.y;
        bound.Update();
      }
    }
  };
};
