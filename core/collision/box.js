// Copyright 2018 TAP, Inc. All Rights Reserved.

Col.Box = function(w, h) {
  'use strict';

  this.data_ = new SAT.Box(undefined, w, h);
};

Col.Box.prototype = Object.create(Col.Shape.prototype);
Col.Box.prototype.constructor = Col.Box;

Col.Box.prototype.GetData = function() {
  'use strict';

  return this.data_;
};

Col.Box.prototype.UpdateTranslate = function(x, y) {
  'use strict';

  this.data_.pos.x = x;
  this.data_.pos.y = y;
};
