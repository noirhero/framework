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
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
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
