#  OpenData

Linked Data models described using JSON-Schema and operated on as immutable `Map`s, `Set`s, and `Array`s.

### WORK IN PROGRESS

## dream code

```javascript
var jjv = require('jjv');
var OpenData = require('opendata');
var opendata = OpenData(jjv);

var Person = opendata({
  id: "Person",
  prefixes: {
    "": "http://schema.org/",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "org": "http://www.w3.org/TR/vocab-org#",
  },
  type: 'object',
  properties: {
    name: {
      type: "string",
      context: "foaf:name",
    },
    memberships: {
      type: "array",
      context: "org:hasMembership",
      items: {
        reverse: "member",
        "$ref": "Membership",
      },
    },
    // TODO 'memberOf' computed (get/set) property
  },
});

var bob = Person({
  name: "Bob Loblaw",
});
console.log(bob.toJSONLD())
//{
//  "@context": {
//    "@vocab": "http://schema.org/",
//    "foaf": "http://xmlns.com/foaf/0.1/",
//    "org": "http://www.w3.org/TR/vocab-org#",
//    "type": "@type",
//    "id": "@id"
//  },
//  "name": "Bob Loblaw",
//  "memberships": []
//}

var Group = opendata({
  id: "Group",
  prefixes: {
    "": "http://schema.org/",
    "foaf": "http://xmlns.com/foaf/0.1#",
    "org": "http://www.w3.org/TR/vocab-org#"
  },
  type: 'object',
  context: "org:Organization",
  properties: {
    name: {
      type: "string",
    },
    memberships: {
      type: "array",
      context: "org:hasMembership",
      items: {
        anyOf: [{
          reverse: "member",
          "$ref": "Membership",
        }, {
          reverse: "group",
          "$ref": "Membership",
        }],
      },
    },
    // TODO 'memberOf' computed (get/set) property
    // TODO 'members' computed (get/set) property
  },
});

var Membership = opendata({
  id: "Membership",
  prefixes: {
    "": "http://schema.org/",
    "foaf": "http://xmlns.com/foaf/0.1#",
    "org": "http://www.w3.org/TR/vocab-org#"
  },
  context: "org:Membership"
  properties: {
    member: {
      context: "org:member",
      anyOf: [{
        "$ref": "Person",
      }, {
        "$ref": "Group",
      }],
    },
    group: {
      "context": "org:organization",
      "$ref": "Group"
    },
  },
});
```
