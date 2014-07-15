var test = module.exports = {
  schema: {
    id: "Person",
    prefixes: {
      "": "http://schema.org/",
      "foaf": "http://xmlns.com/foaf/0.1/",
    },
    type: 'object',
    context: 'foaf:Person',
    properties: {
      name: {
        type: "string",
      },
    },
  },
  inputs: [{
    name: "Mikey",
  }],
  outputs: [{
    "@context": {
      "@vocab": "http://schema.org/",
      "foaf": "http://xmlns.com/foaf/0.1/",
      "id": "@id",
      "type": "@type",
      "Person": "foaf:Person",
    },
    type: "Person",
    name: "Mikey",
  }],
};
