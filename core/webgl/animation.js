function Animation(url, res_mng) {
  'use strict';

  /*
  public functions
  */
  this.BindTexture = function(index, sampler_pos) {
    if(!texture_) {
      return false;
    }

    return texture_.Bind(index, sampler_pos);
  };

  this.GetTextureCoordinate = function(key, duration) {
    var frame_info = frame_infos_[key];

    if(frame_info) {
      if(frame_info.total_duration < duration) {
        duration %= frame_info.total_duration;
      }

      //return ForFind_(frame_info.frames, duration);

      var frames = frame_info.frames;
      return RecursiveFind_(frames, duration, 0, frames.length);
    }

    return empty_texcoord_;
  };

  this.GetSrc = function() {
    return url;
  };

  this.GetTextureSrc = function() {
    return texture_ ? texture_.GetSrc() : undefined;
  };



  /*
  private functions
  */
  function RecursiveFind_(frames, duration, start, end) {
    var step = end - start;
    var offset = (0 === (step % 2)) ? 0 : 1;
    var pivot = start + Math.round(step / 2) - offset;

    var frame = frames[pivot];
    if(frame.start > duration) {
      return RecursiveFind_(frames, duration, start, pivot);
    }
    else if(frame.end < duration) {
      return RecursiveFind_(frames, duration, pivot, end);
    }

    return frame.rect;
  }

  function ForFind_(frames, duration) {
    var num_frames = frames.length;
    var frame = null;

    for(var i = 0; i < num_frames; ++i) {
      frame = frames[i];
      if(frame.start <= duration && frame.end >= duration) {
        return frame.rect;
      }
    }

    return empty_texcoord_;
  }

  function Initialize_() {
    read_file_ = new ReadFile(url, ReadAnimationData_);
  }

  function ReadAnimationData_(json_text) {
    var data = JSON.parse(json_text);

    texture_ = res_mng.GetTexture(data.meta.image);
    width_ = data.meta.size.w;
    height_ = data.meta.size.h;

    frame_infos_ = {};

    var frames = data.frames;
    for(var i in frames) {
      var state_name = i.slice(0, i.indexOf(' '));

      var frame_info = frame_infos_[state_name];
      if(!frame_info) {
        frame_info = frame_infos_[state_name]  = {
          'total_duration': 0,
          'frames': [],
        };
      }

      var src_frame = frames[i];
      var left = src_frame.frame.x / width_;
      var top = 1.0 - src_frame.frame.y / height_;
      var right = left + src_frame.frame.w / width_;
      var bottom = top - src_frame.frame.h / height_;

      frame_info.frames[frame_info.frames.length] = {
        'start': frame_info.total_duration,
        'end': frame_info.total_duration + src_frame.duration,
        'rect': [
          left, top,
          right, top,
          left, bottom,
          right, bottom,
        ],
      };
      frame_info.total_duration += src_frame.duration;
    }

    read_file_ = null;
  }



  /*
  private variables
  */
  var read_file_ = null;

  var texture_ = null;
  var width_ = 0;
  var height_ = 0;

  var frame_infos_ = {};
  var empty_texcoord_ = [
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
    1.0, 0.0,
  ];



  /*
  process
  */
  Initialize_();
}
