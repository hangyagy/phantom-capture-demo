var _         = require('lodash');
var path      = require('path');
var fs        = require('fs');
var Promise   = require('bluebird');
var config    = require('./config');
var capture   = require('./capture');

var createPictures = function(siteConfig) {

  return new Promise(function(resolve, reject) {
    var urls     = siteConfig.urls;
    var dest     = siteConfig.dest;
    var promises = [];

    fs.mkdir(dest, 0777, function(err) {
      if (err && err.code !== 'EEXIST') {
        reject(err);
      } else {
        var promises = [];

        _.each(urls, function(url, name) {
          var promise = capture(url)
            .then(function(images) {
              _.each(images, function(img, size) {
                var fileName = path.resolve(dest, name + '-' + size + '.png');
                fs.writeFileSync(fileName, img);

                return fileName;
              });
            });

          promises.push(promise);
        });

        Promise
          .all(promises)
          .then(function() {
            resolve();
          })
          .catch(function(err) {
            reject(err);
          });
      }
    });
  });
};

Promise
  .all([
    createPictures(config.original),
    createPictures(config.modified)
  ])
  .then(function() {
    console.log('Done');
  })
  .catch(function(err) {
    throw err;
  });
