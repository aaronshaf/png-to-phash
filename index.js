var fs = require('fs')
var pHash = require('phash')
var glob = require('glob')
var tmp = require('temporary')
var gm = require('gm')
var uuid = require('uuid')
var path = require('path')
var async = require('async')

var tmpDir = new tmp.Dir()
var tasks = []

function generateHash(file,callback) {
  var jpeg = path.join(tmpDir.path,uuid.v4() + '.jpg')
  gm(file).write(jpeg, function(error,test) {
    if(error) {
      fs.unlinkSync(jpeg)
      return callback(error)
    }

    pHash.imageHash(jpeg,function(error, phash) {
      fs.unlinkSync(jpeg)
      if(error) {
        return callback(error)
      }
      callback(null,{
        file: file,
        phash: phash
      })
    })
  })
}

module.exports = function (files,callback) {
  files.forEach(function(file) {
    tasks.push(function(callback) {
      generateHash(file,callback)
    })
  })

  async.parallelLimit(tasks,5,function(error,results) {
    tmpDir.rmdir()
    callback(error,results)
  })
}
