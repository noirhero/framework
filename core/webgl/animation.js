// Copyright 2018 TAP, Inc. All Rights Reserved.

WebGL.Animation = function(url, res_mng) {
  'use strict';

  this.url_ = url;
  this.frame_infos_ = null;

  this.res_mng_ = res_mng;
  this.texture_ = null;
};

WebGL.Animation.prototype = Object.create(WebGL.Resource.prototype);
WebGL.Animation.prototype.constructor = WebGL.Animation;

WebGL.Animation.prototype.Initialize = function() {
  'use strict';

  function OnLoadAnimation_(json_text) {
    const data = JSON.parse(json_text);

    this.texture_ = this.res_mng_.GetTexture(data.meta.image);

    const width = data.meta.size.w;
    const height = data.meta.size.h;

    let frame_infos = {};

    const frames = data.frames;
    for(const i in frames) {
      const state_name = i.slice(0, i.indexOf(' '));

      let frame_info = frame_infos[state_name];
      if(!frame_info) {
        frame_info = frame_infos[state_name]  = {
          total_duration: 0,
          frames: [],
          mode: 'loop',
          next_state: undefined,
        };
      }

      const src_frame = frames[i];
      const left = src_frame.frame.x / width;
      const top = 1.0 - src_frame.frame.y / height;
      const right = left + src_frame.frame.w / width;
      const bottom = top - src_frame.frame.h / height;

      frame_info.frames[frame_info.frames.length] = {
        start: frame_info.total_duration,
        end: frame_info.total_duration + src_frame.duration,
        rect: [
          left, top,
          right, top,
          left, bottom,
          right, bottom,
        ],
      };
      frame_info.total_duration += src_frame.duration;
    }

    let attack_l = frame_infos['attack_l'];
    attack_l.mode = 'once';
    attack_l.next_state = 'idle_l';

    let attack_r = frame_infos['attack_r'];
    attack_r.mode = 'once';
    attack_r.next_state = 'idle_r';

    this.frame_infos_ = frame_infos;
  }

  ReadFile(this.url_, OnLoadAnimation_.bind(this));
};

WebGL.Animation.prototype.GetTextureCoordinate = function(state_info) {
  'use strictr';

  function RecursiveFind_(frames, duration, start, end) {
    const step = end - start;
    const offset = (0 === (step % 2)) ? 0 : 1;
    const pivot = start + Math.round(step / 2) - offset;

    const frame = frames[pivot];
    if(frame.start > duration) {
      return RecursiveFind_(frames, duration, start, pivot);
    }
    else if(frame.end < duration) {
      return RecursiveFind_(frames, duration, pivot, end);
    }

    return frame.rect;
  }

  const key = state_info.name;
  const frame_info = this.frame_infos_[key];
  let duration = state_info.duration;

  if(frame_info) {
    if(frame_info.total_duration < duration) {
      duration %= frame_info.total_duration;
      state_info.duration = duration;

      if('once' == frame_info.mode) {
        state_info.name = frame_info.next_state;

        return this.GetTextureCoordinate(state_info);
      }
    }

    const frames = frame_info.frames;
    return RecursiveFind_(frames, duration, 0, frames.length);
  }

  return CONST.EMPTY_TEXCOORD;
};

WebGL.Animation.prototype.SetMode = function(state, mode, next_state) {
  'use strict';

  let frame_info = this.frame_infos_[state];
  if(!frame_info) {
    return false;
  }

  frame_info.mode = mode;
  frame_info.next_state = next_state;
};

WebGL.Animation.prototype.GetSrc = function() {
  return this.url_;
};

WebGL.Animation.prototype.GetTexture = function() {
  return this.texture_;
};

WebGL.Animation.prototype.GetTextureSrc = function() {
  return this.texture_ ? this.texture_.GetSrc() : undefined;
};
