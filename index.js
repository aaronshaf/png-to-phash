var fs = require('fs')
var pHash = require('phash-image')
var tmp = require('temporary')
var gm = require('gm')
var uuid = require('uuid')
var path = require('path')

module.exports = function(file,callback) {
  var tmpDir = new tmp.Dir()

  var jpeg = path.join(tmpDir.path,uuid.v4() + '.jpg')
  gm(file).write(jpeg, function(error,test) {
    if(error) {
      fs.unlinkSync(jpeg)
      return callback(error)
    }

    pHash(jpeg,function(error, phash) {
      fs.unlinkSync(jpeg)
      tmpDir.rmdir()

      if(error) {
        return callback(error)
      }

      callback(null,phash)
    })
  })
}
