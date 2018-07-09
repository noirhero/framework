// Copyright 2018 TAP, Inc. All Rights Reserved.

Col.Shape = function() {
  'use strict';

  this.data_ = null;
};

Col.Shape.prototype.GetData = function() {
  'use strict';

  return this.data_;
};

Col.Shape.prototype.UpdateTranslate = function(x, y) {
  'use strict';

  let pos = this.data_.pos;
  pos.x = x;
  pos.y = y;
};

Col.Shape.prototype.AddTranslate = function(x, y) {
  'use strict';

  let pos = this.data_.pos;
  pos.x += x;
  pos.y += y;
};
