// Copyright 2018 TAP, Inc. All Rights Reserved.

function ResourceManager(context) {
  'use strict';

  let textures_ = {};
  let animations_ = {};
  let fonts_ = {};

  function CreateResource_(url, res_array, create_fn) {
    let resource = res_array[url];
    if(!resource) {
      resource = {
        data: create_fn(),
        ref_count: 0,
      };

      res_array[url] = resource;
    }

    ++resource.ref_count;
    return resource.data;
  }

  function DeleteResource_(data, res_array) {
    const url = data.GetSrc();
    let resource = res_array[url];
    if(!resource) {
      return;
    }

    --resource.ref_count;
    if(0 >= resource.ref_count) {
      delete res_array[url];
    }
  }

  function CreateTexture_(url) {
    return context.CreateTexture(url);
  }

  function CreateAnimation_(url) {
    let animation = new WebGL.Animation(url, this);
    animation.Initialize();
    return animation;
  }

  function CreateFont_(font_url, texture_url) {
    let font = new WebGL.Font(font_url, texture_url, this);
    font.Initialize();
    return font;
  }

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

  this.GetFont = function(font_url, texture_url) {
    return CreateResource_(font_url, fonts_, CreateFont_.bind(this, font_url, texture_url));
  };

  this.DeleteFont = function(font) {
    DeleteResource_(font.GetTextureSrc(), textures_);
    DeleteResource_(font.GetSrc(), fonts_);
  };
}
