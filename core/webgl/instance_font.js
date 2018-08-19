// Copyright TAP, Inc. All Rights Reserved.

WebGL.InstanceFont = function(font) {
  'use strict';

  this.font_ = font;

  this.font_info_ = {
    x: -100,
    y: -100,
    w: 30,
    h: 30,
    text: '',
  };
};

WebGL.InstanceFont.prototype = Object.create(WebGL.Instance.prototype);
WebGL.InstanceFont.prototype.constructor = WebGL.InstanceFont;

WebGL.InstanceFont.prototype.SetText = function(text) {
  'use strict';
  this.font_info_.text = text || '';
};

WebGL.InstanceFont.prototype.GetTexture = function() {
  'use strict';
  return this.font_.GetTexture();
};

WebGL.InstanceFont.prototype.FillVertices = function(offset, dest_vertices, quad_position, texture_index) {
  'use strict';

  const font_info =  this.font_info_;
  const text = font_info.text;
  const num_text = text.length;
  if(0 === num_text) {
    return 0;
  }

  let x = font_info.x;
  let y = font_info.y;
  const w = font_info.w;
  const h = font_info.h;

  const font = this.font_;
  for(let ti = 0; ti < num_text; ++ti) {
    const ch = text[ti];
    if(' ' === ch) {
      x += w;
      continue;
    }
    else if('\n' === ch) {
      x = font.x;
      y += h;
      continue;
    }

    const ascii_code = text.charCodeAt(ti);
    const tex_coord = font.GetCoordinate(ascii_code);

    dest_vertices[offset++] = x;
    dest_vertices[offset++] = y + h;
    dest_vertices[offset++] = 0;
    dest_vertices[offset++] = tex_coord[0];
    dest_vertices[offset++] = tex_coord[1];
    dest_vertices[offset++] = texture_index;

    dest_vertices[offset++] = x + w;
    dest_vertices[offset++] = y + h;
    dest_vertices[offset++] = 0;
    dest_vertices[offset++] = tex_coord[2];
    dest_vertices[offset++] = tex_coord[3];
    dest_vertices[offset++] = texture_index;

    dest_vertices[offset++] = x;
    dest_vertices[offset++] = y;
    dest_vertices[offset++] = 0;
    dest_vertices[offset++] = tex_coord[4];
    dest_vertices[offset++] = tex_coord[5];
    dest_vertices[offset++] = texture_index;

    dest_vertices[offset++] = x + w;
    dest_vertices[offset++] = y;
    dest_vertices[offset++] = 0;
    dest_vertices[offset++] = tex_coord[6];
    dest_vertices[offset++] = tex_coord[7];
    dest_vertices[offset++] = texture_index;

    x += w + 10;
  }

  return num_text;
};
