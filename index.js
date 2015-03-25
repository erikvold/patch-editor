"use strict";

var Promise = require("promise");
var fs = require("fs");

var newFileCheck = /^(\+{3}|\-{3})\s/;

function getChunks(options) {
  return new Promise(function(resolve) {
    var patch = options.patch;
    if (!patch) {
      throw new Error("Patch not found");
    }
    var contents = fs.readFileSync(patch, { encoding: "utf8" }).toString().replace(/\n\r/g, "\n");
    contents = contents.split("\n");

    var chunks = [];
    var lastIndex = contents.length - 1;
    for (var i = lastIndex - 1; i > 0; i--) {
      var line = contents[i];
      var isLineNewFile = newFileCheck.test(line);

      var prevLine = contents[i - 1];
      var isPrevLineNewFile = newFileCheck.test(line);

      if (isPrevLineNewFile) {
        i = i - 1;
      }

      if (isPrevLineNewFile || isLineNewFile) {
        chunks.push(new Chunk({
          start: i,
          end: lastIndex,
          contents: contents.slice(i, lastIndex)
        }));
        lastIndex = i - 1;
      }
    }
    resolve(chunks);
  });
}
exports.getChunks = getChunks;

function Chunk(options) {
  this.start = options.start;
  this.end = options.end;
  this.contents = options.contents;
}
Chunk.prototype.getFilesChanged = function() {
  var files = [];
  [
    this.contents[0],
    this.contents[1]
  ].forEach(function(line) {
    if (newFileCheck.test(line)) {
      var filename = line.replace(newFileCheck, "");
      files.push(filename);
    }
  });

  return files;
}
Chunk.prototype.toString = function() {
  return this.contents.join("\n");
}
