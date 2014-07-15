var _ = require('lodash');
var predefine = require('predefine');

function OpenData (jjv) {
  return opendata.bind({ jjv: jjv })
}

var opendata = function opendata (schema) {
  var jjv = this.jjv;

  // save type for later
  var type = schema.type;

  // jjv expects type to be object
  schema.type = 'object';

  // add schema to jjv
  jjv.addSchema(schema.id, schema);

  //
  // define Data constructor
  //
  var Data = function (obj) {
    if (!(this instanceof Data)) return new Data(obj);
    if (this.validate(obj)) {
      throw new Error("invalid object passed to " + schema.id + " constructor.");
    }

    var property = predefine(this, {
      enumerable: true,
      writeable: true,
    });

    // set type property
    property("type", schema.type);

    // TODO handle nested schemas (by $ref)

    // define shallow properties
    _.forEach(obj, function (val, key) {
      // if not nested then
      property(key, val);
    }.bind(this));
  };

  //
  // setup hidden properties
  //
  var hidden = {
    enumerable: false,
    writeable: false
  }
  // in class
  var classHidden = predefine(Data, hidden);

  classHidden("__isOpenData", true);

  // in prototype
  var protoHidden = predefine(Data.prototype, hidden);

  protoHidden("_schema", schema);

  //
  // setup methods in prototype
  //
  var method = predefine(Data.prototype, {
    enumerable: false,
    writeable: true,
  });

  method("validate", function (options) {
    return jjv.validate(schema.id, this.toJSON())
  });
  
  method("toJSON", function () {
    // create object to return
    var json = {};
    // TODO set properties of nested objects
    // set own properties
    _.forIn(this, function (val, key) {
      json[key] = val;
    });
    return json;
  });
  
  method("toContext", function () {
    var context = {
      id: "@id",
      type: "@type",
    };
    // get prefixes
    _.forIn(this._schema.prefixes, function (val, key) {
      if (_.isString(key) && _.isEmpty(key)) {
        key = "@vocab";
      }
      context[key] = val;
    });
    // get property contexts
    _.forIn(this._schema.properties, function (propschema, propName) {
      if (propschema.context) {
        context[propName] = propschema.context;
      }
    });
    // TODO merge context of nested objects
    return context;
  });
  
  method("toJSONLD", function () {
    return _.extend(this.toJSON(), {
      "@context": this.toContext(),
      type: type,
    });
  });

  return Data;
};

module.exports = OpenData;
