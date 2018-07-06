// Copyright 2018 TAP, Inc. All Rights Reserved.

var WebGL = WebGL || {};

WebGL.Texture = function(gl, url) {
  'use strict';

  WebGL.Resource.call(this, gl);

  this.url_ = url;
  this.texture_ = null;
  this.image_ = null;
};

WebGL.Texture.prototype = Object.create(WebGL.Resource.prototype);
WebGL.Texture.prototype.constructor = WebGL.Texture;

WebGL.Texture.prototype.Initialize = function() {
  'use strict';

  function OnLoadImage_() {
    const gl = this.gl_;

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, this.texture_);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image_);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.image_ = null;
  }

  this.image_ = new Image();
  this.image_.onload = OnLoadImage_.bind(this);
  this.image_.src = this.url_;
};

WebGL.Texture.prototype.OnContextLost = function() {
  'use strict';

  if(this.image_) {
    this.image_.onload = null;
  }
};

WebGL.Texture.prototype.Bind = function(index, sampler_pos) {
  'use strict';

  if(this.image_) {
    return false;
  }

  const gl = this.gl_;
  gl.activeTexture(gl.TEXTURE0 + index);
  gl.bindTexture(gl.TEXTURE_2D, this.texture_);
  gl.uniform1i(sampler_pos, index);

  return true;
};

function Texture(gl, src) {
  'use strict';

  /*
  public functions
  */
  this.Initialize = function() {
    texture_ = gl.createTexture();

    image_ = new Image();
    image_.onload = OnLoadImage_;
    image_.src = src;
  };

  this.OnContextLost = function() {
    if(image_ && image_.onload) {
      image_.onload = null;
    }
  };

  this.Bind = function(index, sampler_pos) {
    if(null !== image_) {
      return false;
    }

    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, texture_);
    gl.uniform1i(sampler_pos, index);

    return true;
  };

  this.GetSrc = function() {
    return src;
  };



  /*
  private functions
  */
  function OnLoadImage_() {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture_);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image_);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);

    image_ = null;
  }



  /*
  private variables
  */
  var image_ = null;
  var texture_ = null;
}
