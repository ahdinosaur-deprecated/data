var expect = require('chai').expect;
var _ = require('lodash');

var LDR = require('../');
var ldr = new LDR();
var fixtures = {};
var dir = __dirname + '/fixtures/';
[
  "SimplePerson",
].forEach(function (name) {
  fixtures[name] = require(dir + name);
});

console.log(ldr);

_.forEach(fixtures, function (fixture) {
  var name = fixture.descriptor.name;
  describe(name, function () {
    it("should load", function () {
      ldr.use(fixture.descriptor);
      expect(ldr).to.have.property(name);
    });
    it("should toJSONLD", function () {
      _.forEach(fixture.inputs, function (input, index) {
        var out = new ldr[name](input);
        expect(out.toJSONLD()).to.deep.equal(fixture.outputs[index]);
      });
    });
  });
});
