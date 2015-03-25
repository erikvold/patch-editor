/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

var path = require("path");
var fs = require("fs");
var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;

var patch = require("../");

describe("test patches", function () {
  it("test patch 1", function (done) {
    patch.getChunks({
      patch: path.resolve("./test/patches/1.diff")
    }).then(function(chunks) {
      expect(chunks.length).to.equal(1);

      var result = fs.readFileSync(path.resolve("./test/result/1.diff"), {
        encoding: "utf8"
      }).toString();

      expect(chunks.join("\n") + "\n").to.equal(result);
    }).then(done).catch(done);
  });
});
