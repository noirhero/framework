function ResourceManager(context) {
  'use strict';

  /*
  public functions
  */
  this.GetTexture = function(url) {
    return CreateResource_(url, textures_, CreateTexture_.bind(this, url));
  };

  this.DeleteTexture = function(texture) {
    DeleteResource_(texture, textures_);
  };

  this.GetAnimation = function(url) {
    return CreateResource_(url, animations_, CreateAnimation_.bind(this, url));
  };

  this.DeleteAnimation = function(animation) {
    DeleteResource_(animation.GetTextureSrc(), textures_);
    DeleteResource_(animation, animations_);
  };



  /*
  private functions
  */
  var CreateTexture_ = function(url) {
    return context.CreateTexture(url);
  };

  var CreateAnimation_ = function(url) {
    return new Animation(url, this);
  };

  var CreateResource_ = function(url, res_array, create_fn) {
    var resource = res_array[url];
    if(!resource) {
      resource = {
        'data': create_fn(),
        'ref_count': 0,
      };

      res_array[url] = resource;
    }

    ++resource.ref_count;
    return resource.data;
  };

  var DeleteResource_ = function(data, res_array) {
    var url = data.GetSrc();
    var resource = res_array[url];
    if(!resource) {
      return;
    }

    --resource.ref_count;
    if(0 >= resource.ref_count) {
      delete res_array[url];
    }
  };



  /*
  private variables
  */
  var textures_ = {};
  var animations_ = {};
}
