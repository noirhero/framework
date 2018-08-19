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
    let font_infos = JSON.parse(json_text);

    for(let i in font_infos) {
      let font_info = font_infos[i];

      const left = font_info.x;
      const top = 1.0 - font_info.y;
      const right = left + font_info.w;
      const bottom = top - font_info.h;
      font_info.rect = [
        left, top,
        right, top,
        left, bottom,
        right, bottom,
      ];
    }

    this.font_infos_ = font_infos;
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
