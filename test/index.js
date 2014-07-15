var expect = require('chai').expect;
var _ = require('lodash');
var jjv = require('jjv');

var opendata = require('../')(jjv());
var fixtures = {};
var dir = __dirname + '/fixtures/';
[
  "SimplePerson",
].forEach(function (name) {
  fixtures[name] = require(dir + name);
});

_.forEach(fixtures, function (fixture) {
  var schemaId = fixture.schema.id;
  describe(schemaId, function () {
    var Data;
    it("should load", function () {
      Data = opendata(fixture.schema);
      expect(Data).to.have.property('__isOpenData', true);
    });
    it("should correctly .toJSONLD()", function () {
      _.forEach(fixture.inputs, function (input, index) {
        var out = Data(input);
        expect(out.toJSONLD()).to.deep.equal(fixture.outputs[index]);
      });
    });
  });
});
