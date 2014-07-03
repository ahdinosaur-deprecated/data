var jjv = require('jjv');
var _ = require('lodash');

function Registry () {
  this.jjv = jjv();
  this.validate = this.jjv.validate.bind(this.jjv);
}

Registry.prototype.define = function (ldr, descriptor) {
  var name = descriptor.name;

  // add types
  // add formats
  // add checks
  // add type coercions
  // add schema
  this.jjv.addSchema(name, descriptor.schema);

  // find nested definitions

  var Definition = function (obj) {
    if (this._ldr.validate(obj)) {
      throw new Error("invalid object passed to " + name + " constructor.");
    }
    _.forEach(obj, function (val, key) {
      this[key] = val;
    }.bind(this));
  };
  Definition.name = name;
  Object.defineProperties(Definition.prototype, {
    "_ldr": {
      enumerable: false,
      configurable: true,
      writable: false,
      value: ldr,
    },
    "_descriptor": {
      enumerable: false,
      configurable: true,
      writable: false,
      value: descriptor,
    },
    "validate": {
      enumerable: false,
      configurable: true,
      writable: false,
      value: function (options) {
        return this._ldr.validate(name, this.toJSON());
      },
    },
    "toJSON": {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function () {
        // create object to return
        var json = {};
        // set id
        // set type
        // set properties
        _.forIn(this, function (val, key) {
          json[key] = val;
        });
        // TODO set properties of nested objects
        return json;
      },
    },
    "toContext": {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function () {
        var context = {
          id: "@id",
          type: "@type",
        };
        // get prefixes
        _.forIn(this._descriptor.prefixes, function (val, key) {
          if (_.isString(key) && _.isEmpty(key)) {
            key = "@vocab";
          }
          context[key] = val;
        });
        // get properties
        _.forIn(this._descriptor.properties, function (propDescriptor, propName) {
          if (propDescriptor.context) {
            context[propName] = propDescriptor.context;
          }
        });
        // TODO merge context of nested objects
        return context;
      }
    },
    "toJSONLD": {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function () {
        return _.extend(this.toJSON(), {
          "@context": this.toContext(),
          type: this._descriptor.type,
        });
      },
    },
  });
  return Definition;
}

Registry.prototype.use = function (descriptor) {
  this[descriptor.name] = this.define(this, descriptor);
}

module.exports = Registry;
