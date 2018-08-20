// Copyright TAP, Inc. All Rights Reserved.

WebGL.Font = function(font_url, texture_url, res_mng) {
  'use strict';

  this.font_url_ = font_url;
  this.texture_url_ = texture_url;
  this.res_mng_ = res_mng;

  this.font_infos_ = null;
  this.font_texture_ = null;
};

WebGL.Font.prototype = Object.create(WebGL.Resource.prototype);
WebGL.Font.prototype.constructor = WebGL.Font;

WebGL.Font.prototype.Initialize = function() {
  'use strict';

  function OnLoadFontInfo_(json_text) {
    this.font_infos_ = JSON.parse(json_text);
  }
  ReadFile(this.font_url_, OnLoadFontInfo_.bind(this));

  this.font_texture_ = this.res_mng_.GetTexture(this.texture_url_);
};

WebGL.Font.prototype.GetCoordinate = function(ch) {
  'use strict';

  const font_infos = this.font_infos_;
  if(!font_infos) {
    return CONST.ZERO_TEXCOORD;
  }

  const font_info = font_infos[ch];
  if(!font_info) {
    return CONST.ZERO_TEXCOORD;
  }

  return font_info.rect;
};

WebGL.Font.prototype.GetSrc = function() {
  'use strict';
  return this.font_url_;
};

WebGL.Font.prototype.GetTexture = function() {
  'use strict';
  return this.font_texture_;
};

WebGL.Font.prototype.GetTextureSrc = function() {
  return this.texture_url_;
};
