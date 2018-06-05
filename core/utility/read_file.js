function ReadFile(url, callback) {
  'use strict';

  /*
  public functions
  */



  /*
  private functions
  */
  var Run_ = function() {
    http_request_ = new XMLHttpRequest();
    http_request_.open('GET', url, true);
    http_request_.onreadystatechange = StateChange_;
    http_request_.send(null);
  };

  var StateChange_ = function() {
    if(4 === http_request_.readyState) {
      if(200 === http_request_.status || http_request_.response) {
        callback(http_request_.response);
        http_request_ = null;
      }
    }
  };



  /*
  private variables
  */
  var http_request_ = null;



  /*
  process
  */
  Run_();
}
