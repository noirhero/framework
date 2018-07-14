// Copyright 2018 TAP, Inc. All Rights Reserved.

function ReadFile(url, callback) {
  'use strict';

  let http_request_ = null;

  function StateChange_() {
    if(4 === http_request_.readyState) {
      if(200 === http_request_.status || http_request_.response) {
        callback(http_request_.response);
        http_request_ = null;
      }
    }
  }

  http_request_ = new XMLHttpRequest();
  http_request_.open('GET', url, true);
  http_request_.onreadystatechange = StateChange_;
  http_request_.send(null);
}
