var _ = require('lodash');
var predefine = require('predefine');

function OpenData (jjv) {
  return opendata.bind({ jjv: jjv })
}

var opendata = function opendata (schema) {
  var jjv = this.jjv;

  // add schema to jjv
  jjv.addSchema(schema.id, schema);


  // setup properties
  var property = {
    enumerable: true,
    writable: true,
  }

  //
  // define Data constructor
  //
  var Data = function (obj) {
    if (!(this instanceof Data)) return new Data(obj);
    var errors;
    if (errors = this.validate(obj)) {
      var err = new Error("invalid object passed to " + schema.id + " constructor.")
      err.errors = errors;
      throw err;
    }

    //
    // setup instance properties
    //
    var instanceProperty = predefine(this, property);

    instanceProperty("type", schema.id);

    // TODO handle nested schemas (by $ref)

    // define shallow properties
    _.forEach(obj, function (val, key) {
      // if not nested then
      instanceProperty(key, val);
    }.bind(this));
  };

  //
  // setup class properties
  //
  var classProperty = predefine(Data, property);
  
  classProperty("schema", schema);

  //
  // setup hidden properties
  //
  var hidden = {
    enumerable: false,
    writable: false
  }
  // in class
  var classHidden = predefine(Data, hidden);

  classHidden("__isOpenData", true);

  // in prototype
  var protoHidden = predefine(Data.prototype, hidden);

  protoHidden("_schema", schema);

  //
  // setup methods
  //
  //
  var classMethod = predefine(Data, {
    enumerable: false,
    writable: true,
  });
  
  classMethod("toContext", function () {
    var context = {
      id: "@id",
      type: "@type",
    };
    // get prefixes
    _.forIn(this.schema.prefixes, function (val, key) {
      if (_.isString(key) && _.isEmpty(key)) {
        key = "@vocab";
      }
      context[key] = val;
    });
    // get top-level context
    if (this.schema.context) {
      context[this.schema.id] = this.schema.context;
    }
    // get property contexts
    _.forIn(this.schema.properties, function (propSchema, propName) {
      if (propSchema.context) {
        context[propName] = propSchema.context;
      }
    });
    // TODO merge context of nested objects
    return context;
  });

  var protoMethod = predefine(Data.prototype, {
    enumerable: false,
    writable: true,
  });

  protoMethod("validate", function (options) {
    return jjv.validate(schema.id, this.toJSON())
  });
  
  protoMethod("toJSON", function () {
    // create object to return
    var json = {};
    // TODO set properties of nested objects
    // set own properties
    _.forIn(this, function (val, key) {
      json[key] = val;
    });
    return json;
  });
  
  protoMethod("toContext", function () {
    return this.constructor.toContext()
  });
  
  protoMethod("toJSONLD", function () {
    return _.extend(this.toJSON(), {
      "@context": this.toContext(),
      type: schema.id,
    });
  });

  return Data;
};

module.exports = OpenData;
