var screenshot = require('url-to-screenshot');
var Promise    = require('bluebird');

screenshot.prototype.captureAsync = Promise.promisify(screenshot.prototype.capture);

var defaultSizes = [
  // Full hd
  '1920x1080',
  // iPhone 5
//  '320x568',
  // iPad
 // '1024x768',
];

module.exports = function(url, sizes) {
  sizes = sizes || defaultSizes;

  var promises = {};

  sizes.forEach(function(sizeString) {
    var size  = sizeString.split('x');
    var width = parseInt(size[0]);
    var height = parseInt(size[1]);

    var promise = screenshot(url)
      .width(width)
      .height(height)
      .captureAsync();

    promises[width + '-' + height] = promise;

    promise = screenshot(url)
      .width(height)
      .height(width)
      .captureAsync();

    promises[height + '-' + width] = promise;
  });

  return Promise.props(promises);
};
